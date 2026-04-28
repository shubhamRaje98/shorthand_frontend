from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import re
import difflib
from Levenshtein import distance as levenshtein_distance
import nltk
from nltk.tokenize import word_tokenize
from langdetect import detect, DetectorFactory
from difflib import SequenceMatcher
from concurrent.futures import ProcessPoolExecutor, as_completed
import multiprocessing
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DetectorFactory.seed = 0  # Make language detection deterministic

# Download the necessary resources
nltk.download('punkt')

app = Flask(__name__)

# Configure CORS with no timeout restrictions
CORS(app, supports_credentials=True, origins='*')

# Disable Flask's default timeout and set unlimited request size
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['MAX_CONTENT_LENGTH'] = None  # No limit on request size

def preprocess_text(text):
    text = str(text) if pd.notna(text) else ""
    text = re.sub(r'_x[0-9A-Fa-f]{4}_', '', text)
    # Strip line-break markers (////, ///, //, /) before other processing
    text = re.sub(r'/+', ' ', text)
    text = text.replace('-', '').replace('.', ' ').replace(',','').replace('$','').replace('#','').replace('"','').replace("'","").replace('|','').replace('।','').replace('\u200d','').replace('?','').replace('!','').replace("'","").replace('"','').replace('"','').replace('\u2018','').replace('\u2019','').replace('—',' ').replace('–',' ').replace('…',' ').replace('(',' ').replace(')',' ').replace('[',' ').replace(']',' ').replace('{',' ').replace('}',' ').replace(':','')
    text = re.sub(r'\s{2,}', ' ', text)
    text = text.strip()
    return text


def tokenize_text(text, language):
    if language in ['hi', 'mar']:
        return re.findall(r'\S+', text)
    elif language == 'en':
        text = text.lower()
        return word_tokenize(text)
    else:
        return text.split()

def word_similarity(word1, word2):
    return SequenceMatcher(None, word1, word2).ratio()

def is_compound_word_candidate(word1, word2, target):
    """
    Helper function to determine if two words should be combined to match a target word
    Returns True if this looks like a valid compound word case, False otherwise
    """
    # If target exactly matches either component word, don't combine
    if (word1.lower() == target.lower() or word2.lower() == target.lower()):
        return False
    
    # Check for compound form matching target
    combined = (word1 + word2).replace(" ", "").lower()
    target_clean = target.replace(" ", "").lower() 
    
    # If compound form exactly matches target, this is a candidate
    if combined == target_clean:
        return True
        
    # If not an exact match, check using similarity
    if len(combined) == len(target_clean):
        similarity = SequenceMatcher(None, combined, target_clean).ratio()
        if similarity > 0.8:
            return True
    
    return False

def check_combined_word_similarity(current_word, other_word, next_word):
    """
    Check if words should be combined or split
    Uses both exact matches and similarity thresholds
    """
    if not current_word or not other_word or not next_word:
        return False, None, False
    
    # Check if other_word is exactly the same as either current_word or next_word
    # This prevents combining when one of the words already matches
    if current_word.lower() == other_word.lower() or next_word.lower() == other_word.lower():
        return False, None, False
    
    # Check if other word contains either current_word or next_word as complete words
    # This handles the "critical (a critical)" case
    if " " in other_word:
        other_parts = other_word.lower().split()
        if current_word.lower() in other_parts or next_word.lower() in other_parts:
            return False, None, False
    
    # First check exact matches
    # Check if other word is already a compound of current and next
    current_next_combined_clean = (current_word + next_word).replace(" ", "")
    other_clean = other_word.replace(" ", "")
    
    if current_next_combined_clean.lower() == other_clean.lower():
        # Additional check for connector words
        if " " in other_word:
            other_parts = other_word.lower().split()
            if len(other_parts) > 1 and (current_word.lower() in other_parts or next_word.lower() in other_parts):
                return False, None, False
                
        # Return with space between words to maintain clarity
        return True, current_word + " " + next_word, False
    
    # Check if current word is a compound that should be split
    if current_word.replace(" ", "").lower() == (other_word + next_word).replace(" ", "").lower():
        # Additional check for connector words
        if " " in current_word:
            current_parts = current_word.lower().split()
            if len(current_parts) > 1 and (other_word.lower() in current_parts or next_word.lower() in current_parts):
                return False, None, False
                
        # Return with space between words to maintain clarity
        return True, other_word + " " + next_word, True
    
    # If exact matches fail, try similarity-based checks
    # Check if current matches other+next using similarity
    other_combined_clean = (other_word + next_word).replace(" ", "")
    current_clean = current_word.replace(" ", "")
    
    if len(other_combined_clean) == len(current_clean):
        similarity = SequenceMatcher(None, other_combined_clean, current_clean).ratio()
        if similarity > 0.8:
            # Return with space between words to maintain clarity
            return True, other_word + " " + next_word, True
    
    # Then check if current+next matches other using similarity
    combined_clean = (current_word + next_word).replace(" ", "")
    
    if len(combined_clean) == len(other_clean):
        similarity = SequenceMatcher(None, combined_clean, other_clean).ratio()
        if similarity > 0.8:
            # Return with space between words to maintain clarity
            return True, current_word + " " + next_word, False
            
    return False, None, False

def check_exact_compound_ignore_match(alignment, idx, ignore_list):
    """
    Check if current and next positions form an exact compound match that should be ignored
    Only returns True if both sequences match the ignored compound exactly
    """
    if idx + 1 >= len(alignment):
        return False
    
    op1, word1_1, word2_1 = alignment[idx]
    op2, word1_2, word2_2 = alignment[idx + 1]
    
    # Only check for compounds in match or similar operations
    if op1 not in ['match', 'similar'] or op2 not in ['match', 'similar']:
        return False
    
    # Check if word1 sequence forms a compound in ignore list
    if word1_1 and word1_2:
        compound1 = word1_1 + " " + word1_2
        if compound1.lower() in ignore_list:
            # Verify that word2 also represents the same compound
            # Either as a compound or as a single word without space
            if word2_1 and word2_2:
                compound2 = word2_1 + " " + word2_2
                if compound2.lower() == compound1.lower():
                    return True
            elif word2_1 and not word2_2:
                # Check if word2_1 is the compound without space
                if word2_1.replace(" ", "").lower() == compound1.replace(" ", "").lower():
                    return True
    
    return False

def compare_texts(text1, text2, ignore_list):
    if text1 is None or text2 is None:
        return {'is_empty': True}

    text1 = preprocess_text(text1)
    text2 = preprocess_text(text2)
    ignore_list = [preprocess_text(word).lower() for word in ignore_list]

    try:
        language = detect(text1) if len(text1) > len(text2) else detect(text2)
    except:
        language = 'en'

    tokens1 = tokenize_text(text1, language)
    tokens2 = tokenize_text(text2, language)

    added = []
    missed = []
    spelling = []
    grammar = []
    colored_words = []

    # Create alignment matrix
    m, n = len(tokens1), len(tokens2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Fill the matrix
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if tokens1[i-1].lower() == tokens2[j-1].lower():
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                similarity = word_similarity(tokens1[i-1].lower(), tokens2[j-1].lower())
                dp[i][j] = max(dp[i-1][j], dp[i][j-1], dp[i-1][j-1] + similarity)

    # Backtrack to find the alignment
    i, j = m, n
    alignment = []
    while i > 0 and j > 0:
        if tokens1[i-1].lower() == tokens2[j-1].lower():
            alignment.append(('match', tokens1[i-1], tokens2[j-1]))
            i -= 1
            j -= 1
        elif dp[i][j] == dp[i-1][j-1] + word_similarity(tokens1[i-1].lower(), tokens2[j-1].lower()):
            # Check for compound words
            combined_word1 = tokens1[i-1]
            combined_word2 = tokens2[j-1]
            
            # Look ahead for potential compound words in text1
            if i > 1:
                # Check if combining tokens1[i-2] + tokens1[i-1] matches tokens2[j-1]
                if is_compound_word_candidate(tokens1[i-2], tokens1[i-1], tokens2[j-1]):
                    # Preserve space between combined words
                    combined_word1 = tokens1[i-2] + " " + tokens1[i-1]
                    alignment.append(('similar', combined_word1, tokens2[j-1]))
                    i -= 2
                    j -= 1
                    continue
            
            # Look ahead for potential compound words in text2
            if j > 1:
                # Check if combining tokens2[j-2] + tokens2[j-1] matches tokens1[i-1]
                if is_compound_word_candidate(tokens2[j-2], tokens2[j-1], tokens1[i-1]):
                    # Preserve space between combined words
                    combined_word2 = tokens2[j-2] + " " + tokens2[j-1]
                    alignment.append(('similar', tokens1[i-1], combined_word2))
                    i -= 1
                    j -= 2
                    continue
            
            # If no compound words found, just align as similar
            alignment.append(('similar', tokens1[i-1], tokens2[j-1]))
            i -= 1
            j -= 1
            
        elif dp[i][j] == dp[i-1][j]:
            # Look ahead for compound words before deciding delete
            found_compound = False
            if i > 1 and j > 0:
                # Check if combining tokens1[i-2] + tokens1[i-1] matches tokens2[j-1]
                if is_compound_word_candidate(tokens1[i-2], tokens1[i-1], tokens2[j-1]):
                    alignment.append(('similar', tokens1[i-2] + " " + tokens1[i-1], tokens2[j-1]))
                    i -= 2
                    j -= 1
                    found_compound = True

            # FIX: removed the look-ahead block here — it was scanning j+look_ahead
            # (forward) during right-to-left backtracking, causing duplicate word emissions.
            if not found_compound:
                alignment.append(('delete', tokens1[i-1], None))
                i -= 1
        else:
            # Look ahead for compound words before deciding insert
            found_compound = False
            if j > 1 and i > 0:
                # Check if combining tokens2[j-2] + tokens2[j-1] matches tokens1[i-1]
                if is_compound_word_candidate(tokens2[j-2], tokens2[j-1], tokens1[i-1]):
                    alignment.append(('similar', tokens1[i-1], tokens2[j-2] + " " + tokens2[j-1]))
                    i -= 1
                    j -= 2
                    found_compound = True
            
            if not found_compound:
                alignment.append(('insert', None, tokens2[j-1]))
                j -= 1

    while i > 0:
        alignment.append(('delete', tokens1[i-1], None))
        i -= 1
    while j > 0:
        alignment.append(('insert', None, tokens2[j-1]))
        j -= 1

    alignment.reverse()
    
    # Process alignment to handle None cases - combine with next tokens
    processed_alignment = []
    i = 0
    while i < len(alignment):
        op, word1, word2 = alignment[i]
        
        # Handle the case where word1 is None (insert operation)
        if op == 'insert' and word1 is None and i+1 < len(alignment):
            next_op, next_word1, next_word2 = alignment[i+1]
            
            # If the next operation has a valid word1, try to find a match with combined word2
            if next_word1 is not None:
                # Check using compound word candidate function
                if word2 and next_word1 and is_compound_word_candidate(word2, next_word2 or "", next_word1):
                    combined_word2 = word2 + " " + next_word2 if next_word2 else word2
                    processed_alignment.append(('similar', next_word1, combined_word2))
                    i += 2  # Skip the next token since we used it
                    continue
                else:
                    processed_alignment.append((op, word1, word2))
            else:
                processed_alignment.append((op, word1, word2))
        
        # Handle the case where word2 is None (delete operation)
        elif op == 'delete' and word2 is None and i+1 < len(alignment):
            next_op, next_word1, next_word2 = alignment[i+1]
            
            # If the next operation has a valid word2, try to find a match with combined word1
            if next_word2 is not None:
                # Check using compound word candidate function
                if word1 and next_word2 and is_compound_word_candidate(word1, next_word1 or "", next_word2):
                    combined_word1 = word1 + " " + next_word1 if next_word1 else word1
                    processed_alignment.append(('similar', combined_word1, next_word2))
                    i += 2  # Skip the next token since we used it
                    continue
                else:
                    processed_alignment.append((op, word1, word2))
            else:
                processed_alignment.append((op, word1, word2))
        
        # If no special handling needed, add the operation as is
        else:
            processed_alignment.append((op, word1, word2))
        
        i += 1

    alignment = processed_alignment

    skip_next = False

    for idx, (op, word1, word2) in enumerate(alignment):
        if skip_next:
            skip_next = False
            continue

        if op == 'match':
            colored_words.append({'word': word1, 'color': 'black'})
        elif op == 'similar':
            # Check if this is part of an exact compound match that should be ignored
            if check_exact_compound_ignore_match(alignment, idx, ignore_list):
                colored_words.append({'word': word1, 'color': 'black'})
                skip_next = True
                continue
            
            if word1 and word2 and (word1.lower() in ignore_list or word2.lower() in ignore_list):
                # Handle single word ignores or compound words written as single word
                if " " in word1 and word1.replace(" ", "").lower() in ignore_list:
                    parts = word1.split()
                    for part in parts:
                        colored_words.append({'word': part, 'color': 'black'})
                else:
                    colored_words.append({'word': word1, 'color': 'black'})
            else:
                next_word1 = None
                next_word2 = None
                if idx + 1 < len(alignment):
                    next_op, next_w1, next_w2 = alignment[idx + 1]
                    # Look ahead for valid next words
                    look_ahead = 1
                    while (next_w1 is None or next_w2 is None) and idx + look_ahead + 1 < len(alignment):
                        _, temp_w1, temp_w2 = alignment[idx + look_ahead + 1]
                        if next_w1 is None and temp_w1 is not None:
                            next_w1 = temp_w1
                        if next_w2 is None and temp_w2 is not None:
                            next_w2 = temp_w2
                        look_ahead += 1

                    next_word1 = next_w1 if next_w1 != word1 else None
                    next_word2 = next_w2 if next_w2 != word2 else None

                # Process combination attempts
                if next_word1:
                    is_combined1, combined1, reverse1 = check_combined_word_similarity(word1, word2, next_word1)
                else:
                    is_combined1, combined1, reverse1 = False, None, False

                if next_word2:
                    is_combined2, combined2, reverse2 = check_combined_word_similarity(word2, word1, next_word2)
                else:
                    is_combined2, combined2, reverse2 = False, None, False

                # Check if combined words are in ignore list (only if they match exactly)
                if is_combined1 and combined1 and combined1.lower() in ignore_list:
                    parts = combined1.split()
                    for part in parts:
                        colored_words.append({'word': part, 'color': 'black'})
                    skip_next = True
                elif is_combined2 and combined2 and combined2.lower() in ignore_list:
                    parts = combined2.split()
                    for part in parts:
                        colored_words.append({'word': part, 'color': 'black'})
                    skip_next = True
                elif is_combined1 and not reverse1:
                    # Split combined word when showing
                    if " " in combined1:
                        parts = combined1.split()
                        for part in parts:
                            colored_words.append({'word': part, 'color': 'red'})
                    else:
                        colored_words.append({'word': combined1, 'color': 'red'})
                    colored_words.append({'word': word2, 'color': 'green'})
                    spelling.append((combined1, word2))
                    skip_next = True
                elif is_combined2 and not reverse2:
                    colored_words.append({'word': word1, 'color': 'red'})
                    # Split combined word when showing
                    if " " in combined2:
                        parts = combined2.split()
                        for part in parts:
                            colored_words.append({'word': part, 'color': 'green'})
                    else:
                        colored_words.append({'word': combined2, 'color': 'green'})
                    spelling.append((word1, combined2))
                    skip_next = True
                elif is_combined1 and reverse1:
                    colored_words.append({'word': word1, 'color': 'red'})
                    # Split combined word when showing
                    if " " in combined1:
                        parts = combined1.split()
                        for part in parts:
                            colored_words.append({'word': part, 'color': 'green'})
                    else:
                        colored_words.append({'word': combined1, 'color': 'green'})
                    spelling.append((word1, combined1))
                    skip_next = True
                elif is_combined2 and reverse2:
                    # Split combined word when showing
                    if " " in combined2:
                        parts = combined2.split()
                        for part in parts:
                            colored_words.append({'word': part, 'color': 'red'})
                    else:
                        colored_words.append({'word': combined2, 'color': 'red'})
                    colored_words.append({'word': word2, 'color': 'green'})
                    spelling.append((combined2, word2))
                    skip_next = True
                elif word1 and word2:  # Only process if both words exist
                    # Remove spaces for comparing compound words
                    word1_clean = word1.replace(" ", "")
                    word2_clean = word2.replace(" ", "")
                    
                    similarity = SequenceMatcher(None, word1_clean.lower(), word2_clean.lower()).ratio()
                    
                    if similarity > 0.8:
                        colored_words.append({'word': word1, 'color': 'red'})
                        colored_words.append({'word': word2, 'color': 'green'})
                        spelling.append((word1, word2))
                    else:
                        distance = levenshtein_distance(word1_clean, word2_clean)
                        max_length = max(len(word1_clean), len(word2_clean))
                        similarity_pct = (max_length - distance) / max_length * 100

                        if similarity_pct >= 40:
                            colored_words.append({'word': word1, 'color': 'red'})
                            colored_words.append({'word': word2, 'color': 'green'})
                            spelling.append((word1, word2))
                        else:
                            colored_words.append({'word': word1, 'color': 'red'})
                            colored_words.append({'word': word2, 'color': 'green'})
                            missed.append(word1)
                            added.append(word2)
        elif op == 'delete':
            if word1 and word1.lower() not in ignore_list:
                colored_words.append({'word': word1, 'color': 'red'})
                missed.append(word1)
            elif word1:
                colored_words.append({'word': word1, 'color': 'black'})
        elif op == 'insert':
            if word2 and word2.lower() not in ignore_list:
                colored_words.append({'word': word2, 'color': 'green'})
                added.append(word2)
            elif word2:
                colored_words.append({'word': word2, 'color': 'black'})

    # When a spelling pair combines multiple words (e.g., "a continous" -> "continuous"),
    # the individual component words sometimes also leak into missed/added and get
    # double-counted. Strip those leaked components.
    spelling_left_parts = set()
    spelling_right_parts = set()
    for pair in spelling:
        if isinstance(pair, (tuple, list)) and len(pair) == 2:
            left, right = pair
            if isinstance(left, str) and ' ' in left:
                for p in left.split():
                    spelling_left_parts.add(p.lower())
            if isinstance(right, str) and ' ' in right:
                for p in right.split():
                    spelling_right_parts.add(p.lower())
    if spelling_left_parts:
        missed = [w for w in missed
                  if not (isinstance(w, str) and w.lower() in spelling_left_parts)]
    if spelling_right_parts:
        added = [w for w in added
                 if not (isinstance(w, str) and w.lower() in spelling_right_parts)]

    return {
        'colored_words': colored_words,
        'missed': missed,
        'added': added,
        'spelling': spelling,
        'grammar': grammar
    }

@app.route('/compare', methods=['POST'])
def compare():
    """
    Single comparison endpoint (deprecated - use /compare-batch instead)
    """
    data = request.json
    text1 = data.get('text1')
    text2 = data.get('text2')
    ignore_list = data.get('ignore_list', [])

    result = compare_texts(text1, text2, ignore_list)
    return jsonify(result)

def process_single_comparison(item):
    """
    Process a single comparison item for parallel execution.
    Each item contains: id, text1, text2, ignore_list
    """
    try:
        item_id = item.get('id')
        text1 = item.get('text1')
        text2 = item.get('text2')
        ignore_list = item.get('ignore_list', [])

        result = compare_texts(text1, text2, ignore_list)
        return {
            'id': item_id,
            'success': True,
            'result': result
        }
    except Exception as e:
        logger.error(f"Error processing item {item.get('id')}: {str(e)}")
        return {
            'id': item.get('id'),
            'success': False,
            'error': str(e)
        }

@app.route('/compare-batch', methods=['POST'])
def compare_batch():
    """
    Batch comparison endpoint that processes multiple text comparisons in parallel.
    Expects JSON: { "items": [...], "max_workers": 16 }
    Each item: { "id": "unique_id", "text1": "...", "text2": "...", "ignore_list": [...] }

    This endpoint has NO TIMEOUT and will process all items regardless of how long it takes.
    """
    try:
        data = request.json
        items = data.get('items', [])
        max_workers = min(data.get('max_workers', 16), multiprocessing.cpu_count())

        logger.info(f"Starting batch processing: {len(items)} items with {max_workers} workers")

        if not items:
            return jsonify({'success': True, 'results': []})

        results = []

        # Use ProcessPoolExecutor for CPU-bound parallel processing
        # NO TIMEOUT - will run until all items are processed
        with ProcessPoolExecutor(max_workers=max_workers) as executor:
            # Submit all tasks
            future_to_item = {executor.submit(process_single_comparison, item): item for item in items}

            # Collect results as they complete
            completed_count = 0
            total_items = len(future_to_item)

            for future in as_completed(future_to_item):
                try:
                    result = future.result()
                    results.append(result)
                    completed_count += 1

                    # Log progress every 10% completion
                    if completed_count % max(1, total_items // 10) == 0:
                        logger.info(f"Progress: {completed_count}/{total_items} items completed ({(completed_count/total_items)*100:.1f}%)")

                except Exception as e:
                    item = future_to_item[future]
                    logger.error(f"Future execution error for item {item.get('id')}: {str(e)}")
                    results.append({
                        'id': item.get('id'),
                        'success': False,
                        'error': str(e)
                    })
                    completed_count += 1

        # Sort results by id to maintain order
        results.sort(key=lambda x: str(x.get('id', '')))

        logger.info(f"Batch processing completed: {len(results)} results returned")

        return jsonify({
            'success': True,
            'results': results,
            'total_processed': len(results)
        })

    except Exception as e:
        logger.error(f"Batch processing endpoint error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Batch processing failed. Check server logs for details.'
        }), 500

if __name__ == '__main__':
    # Run with threaded=True to handle multiple requests
    # debug=False in production to avoid timeout issues
    logger.info("Starting Flask server on localhost:5002")
    logger.info("Configuration: No timeout, unlimited request size, parallel processing enabled")

    app.run(
        host='localhost',
        port=5002,
        debug=False,  # Set to False to prevent development server timeouts
        threaded=True,  # Enable threading for better performance
        use_reloader=False  # Disable reloader in production
    )
