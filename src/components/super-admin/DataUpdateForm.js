// // import React, { useState } from 'react';
// // import axios from 'axios';

// // const DataUpdateForm = () => {
// //   const [updateType, setUpdateType] = useState('');
// //   const [studentId, setStudentId] = useState('');
// //   const [formData, setFormData] = useState({});
// //   const [message, setMessage] = useState('');

// //   const updateTypes = [
// //     { value: 'audio-logs', label: 'Audio Logs' },
// //     { value: 'text-logs', label: 'Text Logs' },
// //     { value: 'final-passage-submit', label: 'Final Passage Submit' },
// //     { value: 'typing-passage-logs', label: 'Typing Passage Logs' },
// //     { value: 'typing-passage', label: 'Typing Passage' },
// //   ];

// //   const fieldsets = {
// //     'audio-logs': ['trial', 'passageA', 'passageB'],
// //     'text-logs': ['mina', 'texta', 'minb', 'textb'],
// //     'final-passage-submit': ['passageA', 'passageB'],
// //     'typing-passage-logs': ['trialTime', 'trialPassage', 'passageTime', 'passage'],
// //     'typing-passage': ['trialPassage', 'passage'],
// //   };

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData({ ...formData, [name]: value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const response = await axios.post(`http://localhost:3000/${updateType}`, {
// //         studentId,
// //         ...formData,
// //       });
// //       setMessage(response.data.message);
// //     } catch (error) {
// //       setMessage(error.response?.data || 'An error occurred');
// //     }
// //   };

// //   const handleReset = async () => {
// //     try {
// //       const response = await axios.post(`http://localhost:3000/${updateType}`, {
// //         studentId,
// //         reset: true,
// //       });
// //       setMessage(response.data);
// //     } catch (error) {
// //       setMessage(error.response?.data || 'An error occurred');
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2>Update Student Data</h2>
// //       <form onSubmit={handleSubmit}>
// //         <div>
// //           <label>
// //             Update Type:
// //             <select value={updateType} onChange={(e) => setUpdateType(e.target.value)}>
// //               <option value="">Select type</option>
// //               {updateTypes.map((type) => (
// //                 <option key={type.value} value={type.value}>
// //                   {type.label}
// //                 </option>
// //               ))}
// //             </select>
// //           </label>
// //         </div>
// //         <div>
// //           <label>
// //             Student ID:
// //             <input
// //               type="text"
// //               value={studentId}
// //               onChange={(e) => setStudentId(e.target.value)}
// //               required
// //             />
// //           </label>
// //         </div>
// //         {updateType && fieldsets[updateType].map((field) => (
// //           <div key={field}>
// //             <label>
// //               {field.charAt(0).toUpperCase() + field.slice(1)}:
// //               <input
// //                 type="text"
// //                 name={field}
// //                 value={formData[field] || ''}
// //                 onChange={handleInputChange}
// //               />
// //             </label>
// //           </div>
// //         ))}
// //         <button type="submit">Update</button>
// //         <button type="button" onClick={handleReset}>Reset</button>
// //       </form>
// //       {message && <p>{message}</p>}
// //     </div>
// //   );
// // };

// // export default DataUpdateForm;


// import React, { useState } from 'react';
// import axios from 'axios';
// import {
//   Container,
//   Form,
//   Button,
//   Card,
//   Row,
//   Col,
//   Alert,
// } from 'react-bootstrap';
// import './DataUpdateForm.css';

// const DataUpdateForm = () => {
//   const [updateType, setUpdateType] = useState('');
//   const [studentId, setStudentId] = useState('');
//   const [formData, setFormData] = useState({});
//   const [message, setMessage] = useState('');

//   const updateTypes = [
//     { value: 'audio-logs', label: 'Audio Logs' },
//     { value: 'text-logs', label: 'Text Logs' },
//     { value: 'final-passage-submit', label: 'Final Passage Submit' },
//     { value: 'typing-passage-logs', label: 'Typing Passage Logs' },
//     { value: 'typing-passage', label: 'Typing Passage' },
//   ];

//   const fieldsets = {
//     'audio-logs': ['trial', 'passageA', 'passageB'],
//     'text-logs': ['mina', 'texta', 'minb', 'textb'],
//     'final-passage-submit': ['passageA', 'passageB'],
//     'typing-passage-logs': ['trialTime', 'trialPassage', 'passageTime', 'passage'],
//     'typing-passage': ['trialPassage', 'passage'],
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`http://localhost:3000/${updateType}`, {
//         studentId,
//         ...formData,
//       });
//       setMessage(response.data.message);
//     } catch (error) {
//       setMessage(error.response?.data || 'An error occurred');
//     }
//   };

//   const handleReset = async () => {
//     try {
//       const response = await axios.post(`http://localhost:3000/${updateType}`, {
//         studentId,
//         reset: true,
//       });
//       setMessage(response.data);
//     } catch (error) {
//       setMessage(error.response?.data || 'An error occurred');
//     }
//   };

//   return (
//     <Container className="my-4">
//       <Card className="shadow-sm p-4 mx-auto" style={{ maxWidth: '500px' }}>
//         <h2 className="text-center mb-4">Update Student Data</h2>
//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3">
//             <Form.Label>Update Type</Form.Label>
//             <Form.Select
//               value={updateType}
//               onChange={(e) => setUpdateType(e.target.value)}
//             >
//               <option value="">Select type</option>
//               {updateTypes.map((type) => (
//                 <option key={type.value} value={type.value}>
//                   {type.label}
//                 </option>
//               ))}
//             </Form.Select>
//           </Form.Group>
//           <Form.Group className="mb-3">
//             <Form.Label>Student ID</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Enter Student ID"
//               value={studentId}
//               onChange={(e) => setStudentId(e.target.value)}
//               required
//             />
//           </Form.Group>
//           {updateType &&
//             fieldsets[updateType].map((field) => (
//               <Form.Group className="mb-3" key={field}>
//                 <Form.Label>
//                   {field.charAt(0).toUpperCase() + field.slice(1)}
//                 </Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder={`Enter ${field}`}
//                   name={field}
//                   value={formData[field] || ''}
//                   onChange={handleInputChange}
//                 />
//               </Form.Group>
//             ))}
//           <div className="d-flex justify-content-center gap-2 mt-4">
//             <Button variant="primary" type="submit">
//               Update
//             </Button>
//             <Button variant="danger" type="button" onClick={handleReset}>
//               Reset
//             </Button>
//           </div>
//         </Form>
//         {message && (
//           <Alert
//             className="mt-4 text-center"
//             variant={
//               message.includes('Error') || message.includes('error') || message.includes('occurred')
//                 ? 'danger'
//                 : 'success'
//             }
//           >
//             {message}
//           </Alert>
//         )}
//       </Card>
//     </Container>
//   );
// };

// export default DataUpdateForm;


import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  Fade,
  IconButton,
  Avatar,
  Stack,
  useTheme,
  alpha,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  RestartAlt as ResetIcon,
  CheckCircle as CheckCircleIcon,
  AudioFile as AudioIcon,
  TextFields as TextIcon,
  Assignment as AssignmentIcon,
  Keyboard as KeyboardIcon,
  Send as SendIcon,
  Clear as ClearIcon,
  Speed as SpeedIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Super simplified styled components
const EasyCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid #e0e0e0',
  transition: 'all 0.2s ease',
}));

const EasyTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#fafafa',
    fontSize: '16px', // Larger for mobile
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
    '& input': {
      padding: '16px 14px', // Larger touch target
    }
  },
  '& .MuiInputLabel-root': {
    fontSize: '16px',
  }
}));

const EasySelect = styled(Select)(({ theme }) => ({
  borderRadius: '12px',
  backgroundColor: '#fafafa',
  fontSize: '16px',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
  '& .MuiSelect-select': {
    padding: '16px 14px',
  }
}));

const BigButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  fontWeight: 600,
  textTransform: 'none',
  padding: '16px 32px',
  fontSize: '18px',
  minHeight: '56px', // Large touch target
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  }
}));

const DataUpdateForm = () => {
  const theme = useTheme();
  const [updateType, setUpdateType] = useState('');
  const [studentId, setStudentId] = useState('');
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Simplified update types with clearer labels
  const updateTypes = [
    { 
      value: 'audio-logs', 
      label: 'Audio Files',
      icon: <AudioIcon />,
      color: '#e91e63'
    },
    { 
      value: 'text-logs', 
      label: 'Text Content',
      icon: <TextIcon />,
      color: '#2196f3'
    },
    { 
      value: 'final-passage-submit', 
      label: 'Final Submission',
      icon: <CheckCircleIcon />,
      color: '#4caf50'
    },
    { 
      value: 'typing-passage-logs', 
      label: 'Typing Records',
      icon: <KeyboardIcon />,
      color: '#ff9800'
    },
    { 
      value: 'typing-passage', 
      label: 'Typing Content',
      icon: <AssignmentIcon />,
      color: '#9c27b0'
    },
  ];

  // Simplified field definitions with better labels
  const fieldsets = {
    'audio-logs': [
      { name: 'trial', label: 'Trial Recording', placeholder: 'Enter trial details' },
      { name: 'passageA', label: 'Audio Passage A', placeholder: 'Enter passage A details' },
      { name: 'passageB', label: 'Audio Passage B', placeholder: 'Enter passage B details' }
    ],
    'text-logs': [
      { name: 'mina', label: 'Duration A (minutes)', placeholder: '0', type: 'number' },
      { name: 'texta', label: 'Text Content A', placeholder: 'Enter text content...', multiline: true },
      { name: 'minb', label: 'Duration B (minutes)', placeholder: '0', type: 'number' },
      { name: 'textb', label: 'Text Content B', placeholder: 'Enter text content...', multiline: true }
    ],
    'final-passage-submit': [
      { name: 'passageA', label: 'Final Passage A', placeholder: 'Enter final passage A...', multiline: true, required: true },
      { name: 'passageB', label: 'Final Passage B', placeholder: 'Enter final passage B...', multiline: true, required: true }
    ],
    'typing-passage-logs': [
      { name: 'trialTime', label: 'Trial Time (minutes)', placeholder: '0', type: 'number' },
      { name: 'trialPassage', label: 'Trial Text', placeholder: 'Enter trial passage...', multiline: true },
      { name: 'passageTime', label: 'Passage Time (minutes)', placeholder: '0', type: 'number' },
      { name: 'passage', label: 'Main Passage', placeholder: 'Enter main passage...', multiline: true }
    ],
    'typing-passage': [
      { name: 'trialPassage', label: 'Trial Passage', placeholder: 'Enter trial passage...', multiline: true },
      { name: 'passage', label: 'Main Passage', placeholder: 'Enter main passage...', multiline: true }
    ],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuickAction = async (action) => {
    if (!updateType || !studentId.trim()) {
      setMessage('⚠️ Please fill Student ID and select update type first');
      return;
    }

    setIsLoading(true);
    try {
      let response;
      if (action === 'update') {
        response = await axios.post(`http://localhost:3000/${updateType}`, {
          studentId,
          ...formData,
        });
        setMessage('✅ Update successful!');
      } else if (action === 'reset') {
        response = await axios.post(`http://localhost:3000/${updateType}`, {
          studentId,
          reset: true,
        });
        setMessage('🔄 Reset successful!');
      }
    } catch (error) {
      setMessage('❌ Error: ' + (error.response?.data || 'Something went wrong'));
    } finally {
      setIsLoading(false);
    }
  };

  const clearEverything = () => {
    setFormData({});
    setStudentId('');
    setUpdateType('');
    setMessage('');
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Fade in={true} timeout={400}>
        <Box>
          {/* Super Simple Header */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
              📝 Quick Data Update
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Just fill and click - that's it!
            </Typography>
          </Box>

          {/* Main Form Card */}
          <EasyCard sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Step 1: Student ID */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                  1️⃣ Enter Student ID
                </Typography>
                <EasyTextField
                  fullWidth
                  label="Student ID"
                  placeholder="Type student ID here..."
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                  }}
                />
              </Grid>

              {/* Step 2: Select Type */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                  2️⃣ What do you want to update?
                </Typography>
                <FormControl fullWidth>
                  <InputLabel sx={{ fontSize: '16px' }}>Choose update type</InputLabel>
                  <EasySelect
                    value={updateType}
                    label="Choose update type"
                    onChange={(e) => {
                      setUpdateType(e.target.value);
                      setFormData({}); // Clear form when changing type
                    }}
                  >
                    {updateTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: type.color }}>
                            {type.icon}
                          </Avatar>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {type.label}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </EasySelect>
                </FormControl>
              </Grid>

              {/* Step 3: Form Fields */}
              {updateType && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                    3️⃣ Fill the details
                  </Typography>
                  <Grid container spacing={2}>
                    {fieldsets[updateType]?.map((field) => (
                      <Grid item xs={12} sm={field.multiline ? 12 : 6} key={field.name}>
                        <EasyTextField
                          fullWidth
                          label={field.label}
                          placeholder={field.placeholder}
                          name={field.name}
                          type={field.type || 'text'}
                          multiline={field.multiline}
                          rows={field.multiline ? 4 : 1}
                          value={formData[field.name] || ''}
                          onChange={handleInputChange}
                          required={field.required}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              )}

              {/* Step 4: Action Buttons */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                  4️⃣ Choose action
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <BigButton
                    variant="contained"
                    color="success"
                    onClick={() => handleQuickAction('update')}
                    disabled={!studentId || !updateType || isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
                    sx={{ flex: 1 }}
                  >
                    {isLoading ? 'Updating...' : '💾 Save Update'}
                  </BigButton>
                  
                  <BigButton
                    variant="contained"
                    color="warning"
                    onClick={() => handleQuickAction('reset')}
                    disabled={!studentId || !updateType || isLoading}
                    startIcon={<ResetIcon />}
                    sx={{ flex: 1 }}
                  >
                    🔄 Reset Data
                  </BigButton>
                  
                  <Tooltip title="Clear everything and start over">
                    <BigButton
                      variant="outlined"
                      onClick={clearEverything}
                      disabled={isLoading}
                      startIcon={<ClearIcon />}
                    >
                      🗑️ Clear All
                    </BigButton>
                  </Tooltip>
                </Stack>
              </Grid>
            </Grid>
          </EasyCard>

          {/* Simple Message Display */}
          {message && (
            <Fade in={Boolean(message)} timeout={300}>
              <Alert
                severity={message.includes('❌') ? 'error' : 'success'}
                sx={{
                  mt: 2,
                  borderRadius: '12px',
                  fontSize: '16px',
                  '& .MuiAlert-message': {
                    fontSize: '16px',
                  }
                }}
                action={
                  <IconButton size="small" onClick={() => setMessage('')}>
                    <CloseIcon />
                  </IconButton>
                }
              >
                {message}
              </Alert>
            </Fade>
          )}

          {/* Quick Help */}
          <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              💡 <strong>Quick Tip:</strong> You can update data by just entering Student ID and selecting type. 
              The detail fields are optional!
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};

export default DataUpdateForm;
