// // // // src/components/super-admin/add-new/AddController.js
// // // import React, { useState } from 'react';
// // // import './AddController.css';

// // // const AddController = () => {
// // //   const [generatedData, setGeneratedData] = useState([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [approving, setApproving] = useState(false);
// // //   const [message, setMessage] = useState('');
// // //   const [error, setError] = useState('');

// // //   const handleGenerateData = async () => {
// // //     setLoading(true);
// // //     setMessage('');
// // //     setError('');
    
// // //     try {
// // //       console.log('Fetching controller data...');
      
// // //       // Use the same pattern as your existing code
// // //       const response = await fetch('http://localhost:3000/api/new-department/generate-controller-data');
      
// // //       // Debug: Check the raw response first
// // //       const responseText = await response.text();
// // //       console.log('Raw API Response:', responseText);
      
// // //       if (!response.ok) {
// // //         throw new Error(`HTTP error! status: ${response.status}`);
// // //       }
      
// // //       let data;
// // //       try {
// // //         data = JSON.parse(responseText);
// // //       } catch (parseError) {
// // //         console.error('JSON parse error:', parseError);
// // //         throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
// // //       }
      
// // //       console.log('Parsed API Data:', data);
      
// // //       // Handle the response structure based on your backend response
// // //       if (data.data) {
// // //         setGeneratedData(data.data);
// // //         setMessage(data.message || `Generated ${data.data.length} controller records for preview`);
// // //       } else if (Array.isArray(data)) {
// // //         setGeneratedData(data);
// // //         setMessage(`Generated ${data.length} controller records for preview`);
// // //       } else {
// // //         throw new Error('Unexpected API response structure');
// // //       }
      
// // //     } catch (err) {
// // //       console.error('Error generating controller data:', err);
// // //       setError('Error generating controller data: ' + err.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleApproveData = async () => {
// // //     if (generatedData.length === 0) {
// // //       setError('No data to approve. Please generate data first.');
// // //       return;
// // //     }

// // //     setApproving(true);
// // //     setMessage('');
// // //     setError('');

// // //     try {
// // //       console.log('Approving controller data...', generatedData);
      
// // //       const response = await fetch('http://localhost:3000/api/new-department/approve-controller-data', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify({ controllers: generatedData }),
// // //       });

// // //       // Debug: Check the raw response first
// // //       const responseText = await response.text();
// // //       console.log('Raw Approval Response:', responseText);
      
// // //       if (!response.ok) {
// // //         throw new Error(`HTTP error! status: ${response.status}`);
// // //       }
      
// // //       let result;
// // //       try {
// // //         result = JSON.parse(responseText);
// // //       } catch (parseError) {
// // //         console.error('JSON parse error:', parseError);
// // //         throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
// // //       }
      
// // //       console.log('Parsed Approval Result:', result);
      
// // //       if (result.message) {
// // //         setMessage(result.message);
// // //         setGeneratedData([]);
// // //       } else {
// // //         throw new Error('Unexpected API response structure');
// // //       }
      
// // //     } catch (err) {
// // //       console.error('Error approving controller data:', err);
// // //       setError('Error approving controller data: ' + err.message);
// // //     } finally {
// // //       setApproving(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="add-controller">
// // //       <div className="add-controller__header">
// // //         <h1>Add Controller</h1>
// // //         <p>Generate controller records from student data</p>
// // //       </div>

// // //       <div className="add-controller__actions">
// // //         <button 
// // //           className="add-controller__btn add-controller__btn--generate"
// // //           onClick={handleGenerateData}
// // //           disabled={loading}
// // //         >
// // //           {loading ? 'Generating...' : 'Generate Controller Data'}
// // //         </button>
        
// // //         <button 
// // //           className="add-controller__btn add-controller__btn--approve"
// // //           onClick={handleApproveData}
// // //           disabled={approving || generatedData.length === 0}
// // //         >
// // //           {approving ? 'Approving...' : 'Approve and Save'}
// // //         </button>
// // //       </div>

// // //       {message && (
// // //         <div className="add-controller__message add-controller__message--success">
// // //           {message}
// // //         </div>
// // //       )}

// // //       {error && (
// // //         <div className="add-controller__message add-controller__message--error">
// // //           {error}
// // //         </div>
// // //       )}

// // //       {generatedData.length > 0 && (
// // //         <div className="add-controller__preview">
// // //           <h2>Preview Generated Controller Data</h2>
// // //           <div className="add-controller__table-container">
// // //             <table className="add-controller__table">
// // //               <thead>
// // //                 <tr>
// // //                   <th>Batch No</th>
// // //                   <th>Center</th>
// // //                   <th>Department ID</th>
// // //                   <th>Generated Password</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {generatedData.map((controller, index) => (
// // //                   <tr key={index}>
// // //                     <td>{controller.batchNo}</td>
// // //                     <td>{controller.center}</td>
// // //                     <td>{controller.departmentId}</td>
// // //                     <td>{controller.controller_pass}</td>
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //           <div className="add-controller__summary">
// // //             Total Records: {generatedData.length}
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default AddController;



// // src/components/super-admin/add-new/AddController.js
// import React, { useState } from 'react';
// import './AddController.css';

// const AddController = () => {
//   const [generatedData, setGeneratedData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [approving, setApproving] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [recordsPerPage] = useState(25);
//   const [debugInfo, setDebugInfo] = useState(null);

//   const handleGenerateData = async () => {
//     setLoading(true);
//     setMessage('');
//     setError('');
//     setDebugInfo(null);

//     try {
//       console.log('Fetching controller data...');
//       const response = await fetch('http://localhost:3000/api/new-department/generate-controller-data');

//       const responseText = await response.text();
//       console.log('Raw API Response:', responseText);

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
//       }

//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (parseError) {
//         console.error('JSON parse error:', parseError);
//         throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
//       }

//       console.log('Parsed API Data:', data);

//       // Store debug info
//       setDebugInfo({
//         totalCombinations: data.totalCombinations,
//         duplicatesSkipped: data.duplicatesSkipped,
//         batchesGenerated: data.batchesGenerated,
//         count: data.count
//       });

//       if (data.data && Array.isArray(data.data)) {
//         setGeneratedData(data.data);
//         setMessage(data.message || `Generated ${data.data.length} controller records for preview`);
//         setCurrentPage(1);
        
//         // Log batch distribution
//         const batchCounts = data.data.reduce((acc, record) => {
//           acc[record.batchNo] = (acc[record.batchNo] || 0) + 1;
//           return acc;
//         }, {});
//         console.log('Records per batch:', batchCounts);
//       } else if (Array.isArray(data)) {
//         setGeneratedData(data);
//         setMessage(`Generated ${data.length} controller records for preview`);
//         setCurrentPage(1);
//       } else {
//         throw new Error('Unexpected API response structure');
//       }
//     } catch (err) {
//       console.error('Error generating controller data:', err);
//       setError('Error generating controller data: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApproveData = async () => {
//     if (generatedData.length === 0) {
//       setError('No data to approve. Please generate data first.');
//       return;
//     }

//     setApproving(true);
//     setMessage('');
//     setError('');

//     try {
//       console.log('Approving controller data...', {
//         count: generatedData.length,
//         batches: [...new Set(generatedData.map(r => r.batchNo))].sort((a, b) => a - b)
//       });

//       const response = await fetch('http://localhost:3000/api/new-department/approve-controller-data', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ controllers: generatedData }),
//       });

//       const responseText = await response.text();
//       console.log('Raw Approval Response:', responseText);

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
//       }

//       let result;
//       try {
//         result = JSON.parse(responseText);
//       } catch (parseError) {
//         console.error('JSON parse error:', parseError);
//         throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
//       }

//       console.log('Parsed Approval Result:', result);

//       if (result.message) {
//         setMessage(`${result.message} - Inserted: ${result.insertedCount}, Skipped: ${result.skippedDuplicates || 0}, Batches: ${result.batchesInserted?.join(', ') || 'N/A'}`);
//         setGeneratedData([]);
//         setDebugInfo(null);
//       } else {
//         throw new Error('Unexpected API response structure');
//       }
//     } catch (err) {
//       console.error('Error approving controller data:', err);
//       setError('Error approving controller data: ' + err.message);
//     } finally {
//       setApproving(false);
//     }
//   };

//   // Pagination logic
//   const totalPages = Math.ceil(generatedData.length / recordsPerPage);
//   const indexOfLastRecord = currentPage * recordsPerPage;
//   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//   const currentRecords = generatedData.slice(indexOfFirstRecord, indexOfLastRecord);

//   const handleNextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) setCurrentPage(prev => prev - 1);
//   };

//   const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

//   // Get batch statistics
//   const getBatchStats = () => {
//     const stats = generatedData.reduce((acc, record) => {
//       acc[record.batchNo] = (acc[record.batchNo] || 0) + 1;
//       return acc;
//     }, {});
//     return Object.entries(stats).sort((a, b) => Number(a[0]) - Number(b[0]));
//   };

//   return (
//     <div className="add-controller">
//       <div className="add-controller__header">
//         <h1>Add Controller</h1>
//         <p>Generate controller records from student data (All Batches)</p>
//       </div>

//       <div className="add-controller__actions">
//         <button 
//           className="add-controller__btn add-controller__btn--generate"
//           onClick={handleGenerateData}
//           disabled={loading}
//         >
//           {loading ? 'Generating...' : 'Generate Controller Data'}
//         </button>

//         <button 
//           className="add-controller__btn add-controller__btn--approve"
//           onClick={handleApproveData}
//           disabled={approving || generatedData.length === 0}
//         >
//           {approving ? 'Approving...' : 'Approve and Save'}
//         </button>
//       </div>

//       {message && <div className="add-controller__message add-controller__message--success">{message}</div>}
//       {error && <div className="add-controller__message add-controller__message--error">{error}</div>}

//       {debugInfo && (
//         <div className="add-controller__debug">
//           <h3>Generation Summary</h3>
//           <p><strong>Total Combinations Found:</strong> {debugInfo.totalCombinations}</p>
//           <p><strong>New Records Generated:</strong> {debugInfo.count}</p>
//           <p><strong>Duplicates Skipped:</strong> {debugInfo.duplicatesSkipped}</p>
//           <p><strong>Batches Generated:</strong> {debugInfo.batchesGenerated?.join(', ') || 'None'}</p>
//         </div>
//       )}

//       {generatedData.length > 0 && (
//         <div className="add-controller__preview">
//           <h2>Preview Generated Controller Data</h2>

//           {/* Batch Statistics */}
//           <div className="add-controller__stats">
//             <h3>Records by Batch:</h3>
//             <div className="stats-grid">
//               {getBatchStats().map(([batch, count]) => (
//                 <span key={batch} className="stat-item">
//                   Batch {batch}: <strong>{count}</strong> records
//                 </span>
//               ))}
//             </div>
//           </div>

//           <div className="add-controller__table-container">
//             <table className="add-controller__table">
//               <thead>
//                 <tr>
//                   <th>Batch No</th>
//                   <th>Center</th>
//                   <th>Department ID</th>
//                   <th>Generated Password</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentRecords.map((controller, index) => (
//                   <tr key={index}>
//                     <td>{controller.batchNo}</td>
//                     <td>{controller.center}</td>
//                     <td>{controller.departmentId}</td>
//                     <td>{controller.controller_pass}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination Controls */}
//           {totalPages > 1 && (
//             <div className="pagination">
//               <button onClick={handlePrevPage} disabled={currentPage === 1}>
//                 ◀ Prev
//               </button>

//               {[...Array(totalPages)].map((_, index) => (
//                 <button
//                   key={index + 1}
//                   className={currentPage === index + 1 ? 'active' : ''}
//                   onClick={() => handlePageClick(index + 1)}
//                 >
//                   {index + 1}
//                 </button>
//               ))}

//               <button onClick={handleNextPage} disabled={currentPage === totalPages}>
//                 Next ▶
//               </button>
//             </div>
//           )}

//           <div className="add-controller__summary">
//             Showing <strong>{currentRecords.length}</strong> of <strong>{generatedData.length}</strong> records — Page {currentPage}/{totalPages}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddController;


// src/components/super-admin/AddController.js
import React, { useState } from 'react';
import axios from 'axios';
import './AddController.css';

const AddController = () => {
  const [loading, setLoading] = useState(false);
  const [controllers, setControllers] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', or 'info'
  const [showTable, setShowTable] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Generate controllers (preview only)
  const handleGenerateControllers = async () => {
    setLoading(true);
    setMessage('');
    setMessageType('');
    setShowTable(false);
    
    try {
      const response = await axios.post('http://localhost:3000/api/new-department/generate-controllers');
      
      if (response.data.success) {
        setControllers(response.data.data);
        setShowTable(true);
        setMessage(`Generated ${response.data.count} controller records. Review and click "Approve" to save.`);
        setMessageType('info');
      }
    } catch (error) {
      console.error('Generate Controllers Error:', error);
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Approve and save controllers to database using the same endpoint with a flag
  const handleApproveControllers = async () => {
    setIsApproving(true);
    setMessage('');
    setMessageType('');
    
    try {
      // Send the controllers data back to the same endpoint with save flag
      const response = await axios.post('http://localhost:3000/api/new-department/generate-controllers', {
        save: true,
        controllers: controllers
      });
      
      if (response.data.success) {
        setMessage(`✅ Successfully saved ${response.data.count} controllers to database!`);
        setMessageType('success');
        setShowTable(false);
        setControllers([]);
      }
    } catch (error) {
      console.error('Approve Controllers Error:', error);
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
      setMessageType('error');
    } finally {
      setIsApproving(false);
    }
  };

  // Cancel and clear the table
  const handleCancel = () => {
    setControllers([]);
    setShowTable(false);
    setMessage('');
    setMessageType('');
  };

  return (
    <div className="add-controller-container">
      <div className="add-controller-header">
        <h2>Add Controller</h2>
        <p className="subtitle">Generate controller accounts for department-batch-center combinations</p>
      </div>

      {/* Action Buttons */}
      <div className="button-group">
        <button 
          onClick={handleGenerateControllers} 
          disabled={loading || showTable}
          className="btn btn-generate"
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Generating...
            </>
          ) : (
            'Generate Controllers'
          )}
        </button>

        {showTable && (
          <>
            <button 
              onClick={handleApproveControllers} 
              disabled={isApproving}
              className="btn btn-approve"
            >
              {isApproving ? (
                <>
                  <span className="spinner"></span>
                  Approving...
                </>
              ) : (
                '✓ Approve & Save to Database'
              )}
            </button>

            <button 
              onClick={handleCancel} 
              disabled={isApproving}
              className="btn btn-cancel"
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {/* Message Display */}
      {message && (
        <div className={`message message-${messageType}`}>
          {message}
        </div>
      )}

      {/* Controllers Table */}
      {showTable && controllers.length > 0 && (
        <div className="table-container">
          <h3>Preview: {controllers.length} Controller Records</h3>
          <div className="table-wrapper">
            <table className="controllers-table">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Department ID</th>
                  <th>Batch No</th>
                  <th>Center</th>
                  <th>Controller Code</th>
                  <th>Controller Contact</th>
                  <th>Controller Email</th>
                  <th>Controller Name</th>
                  <th>Controller Password</th>
                </tr>
              </thead>
              <tbody>
                {controllers.map((ctrl, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{ctrl.departmentId}</td>
                    <td>{ctrl.batchNo}</td>
                    <td>{ctrl.center}</td>
                    <td className="empty-field">{ctrl.controller_code || '—'}</td>
                    <td className="empty-field">{ctrl.controller_contact || '—'}</td>
                    <td className="empty-field">{ctrl.controller_email || '—'}</td>
                    <td className="empty-field">{ctrl.controller_name || '—'}</td>
                    <td className="password-field">{ctrl.controller_pass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="table-footer">
            <p className="footer-note">
              <strong>Note:</strong> Empty fields (—) will be stored as empty strings in the database.
              Passwords are auto-generated based on batch number and center.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddController;
