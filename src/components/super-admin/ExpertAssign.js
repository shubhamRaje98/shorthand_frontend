// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import './ExpertAssign.css';
// import { toast } from 'react-toastify';

// const ExpertAssign = () => {
//   const [data, setData] = useState({ departments: [], subjects: [], qsets: [] });
//   const [selectedDepartment, setSelectedDepartment] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [error, setError] = useState('');
//   const [modalError, setModalError] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [selectedExpert, setSelectedExpert] = useState(null);
//   const [studentCount, setStudentCount] = useState('');
//   const [selectedQset, setSelectedQset] = useState(null);
//   const [experts, setExperts] = useState([]);
//   const [modalStep, setModalStep] = useState('expertList');
//   const [stage, setStage] = useState('stage1');
//   const [summaryData, setSummaryData] = useState([]);
//   const [unassignCount, setUnassignCount] = useState('');
//   const [selectedSummaryDepartment, setSelectedSummaryDepartment] = useState('all');
//   const [expertsWithAssignedCounts, setExpertsWithAssignedCounts] = useState([]);
//   const [showSummaryTable, setShowSummaryTable] = useState(false);
  
//   const departmentRefs = useRef({});
//   const subjectRefs = useRef({});

//   useEffect(() => {
//     fetchData();
//     fetchExperts();
//     fetchSummaryData();
//   }, [selectedDepartment, selectedSubject, stage]);

//   const fetchData = async () => {
//     try {
//       let url = `http://localhost:3000/get-student-count-expert?${stage === 'stage1' ? 'stage_1' : 'stage_3'}=true`;
//       if (selectedDepartment) {
//         // console.log(selectedDepartment);
//         url += `&department=${selectedDepartment.toString()}`;
//         if (selectedSubject) {
//           url += `&subject=${selectedSubject}`;
//         }
//       }
  
//       const response = await axios.get(url);
      
//       setData(prevData => ({
//         departments: selectedDepartment ? prevData.departments : response.data.results,
//         subjects: selectedDepartment && !selectedSubject ? response.data.results : prevData.subjects,
//         qsets: selectedSubject ? response.data.results : prevData.qsets
//       }));
  
//       setError('');
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setError('Error fetching data. Please try again later.');
//       setData({ departments: [], subjects: [], qsets: [] });
//     }
//   };

//   const fetchExperts = async () => {
//     try {
//       const response = await axios.get('http://localhost:3000/get-experts');
//       setExperts(response.data.results || []);
      
//     } catch (error) {
//       console.error("Error fetching experts:", error);
//       setError('Error fetching experts. Please try again later.');
//     }
//   };

//   const fetchSummaryData = async () => {
//     try {
//       const response = await axios.get(`http://localhost:3000/get-student-summary-expert?${stage === 'stage1' ? 'stage_1' : 'stage_3'}=true`);
//       setSummaryData(response.data.departments);
      
//     } catch (error) {
//       console.error('Error fetching summary data:', error);
//       setError('Error fetching summary data. Please try again later.');
//     }
//   };

//   const handleDepartmentClick = (departmentId) => {
//     // console.log(departmentId)
//     setSelectedDepartment(departmentId);
//     setSelectedSubject('');
//     setTimeout(() => departmentRefs.current[departmentId]?.focus(), 0);
//   };

//   const handleSubjectClick = (subjectId) => {
//     setSelectedSubject(subjectId);
//     setTimeout(() => subjectRefs.current[subjectId]?.focus(), 0);
//   };

//   const handleQsetClick = (qset) => {
//     setSelectedQset(qset);
//     setShowModal(true);
//     setModalStep('expertList');
//     fetchExpertsWithAssignedCounts(qset);
//   };

//   const fetchExpertsWithAssignedCounts = (qset) => {
  
//     const expertsWithCounts = experts.map(expert => {
  
//       const departmentSummary = summaryData
//         .find(dept => dept.departmentId === parseInt(selectedDepartment));
      
//       let assignedCount = 0;
  
//       if (departmentSummary) {
//         const expertSummary = departmentSummary.experts
//           .find(e => e.expertId === expert.expertId);
  
//         if (expertSummary) {
//           const subjectData = expertSummary.subjects
//             .find(subject => subject.subjectId === selectedSubject);
  
//           if (subjectData) {
//             const qsetData = subjectData.qsets
//               .find(q => q.qset === qset.qset);
            
//             console.log("Qset Data:", qsetData);
  
//             assignedCount = qsetData ? qsetData.expert_assigned_count : 0;
//           }
//         }
//       }
  
//       return { ...expert, assignedCount };
//     });
  
//     setExpertsWithAssignedCounts(expertsWithCounts);
//   };

//   const handleExpertSelect = (expert) => {
//     setSelectedExpert(expert);
//     setModalStep('studentCount');
//   };

//   const handleSubmit = async () => {
//     if (!selectedExpert || !studentCount || !selectedQset) {
//       setModalError('Please select an expert, enter a student count, and select a question set.');
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:3000/assign-expert', {
//         department: selectedDepartment,
//         subject: selectedSubject,
//         qset: selectedQset.qset,
//         expertId: selectedExpert.expertId,
//         count: parseInt(studentCount),
//         stage_1: stage === 'stage1',
//         stage_3: stage === 'stage3'
//       });
      
//       setShowModal(false);
//       setSelectedExpert(null);
//       setStudentCount('');
//       setModalStep('expertList');
//       setModalError('');
//       fetchData();
//       fetchSummaryData();
//       toast.success('Expert assigned successfully!');
//     } catch (error) {
//       console.error('Error assigning expert:', error);
//       setModalError('Error assigning expert. Please try again later.');
//     }
//   };

//   const handleUnassign = async () => {
//     if (!selectedExpert || !unassignCount || !selectedQset) {
//       setModalError('Please select an expert, enter a student count to unassign, and select a question set.');
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:3000/unassign-expert', {
//         department: selectedDepartment,
//         subject: selectedSubject,
//         qset: selectedQset.qset,
//         expertId: selectedExpert.expertId,
//         count: parseInt(unassignCount),
//         stage_1: stage === 'stage1',
//         stage_3: stage === 'stage3'
//       });
      
//       setShowModal(false);
//       setSelectedExpert(null);
//       setUnassignCount('');
//       setModalStep('expertList');
//       setModalError('');
//       fetchData();
//       fetchSummaryData();
//       toast.success('Expert unassigned successfully!');
//     } catch (error) {
//       console.error('Error unassigning expert:', error);
//       setModalError('Error unassigning expert. Please try again later.');
//     }
//   };

//   const handleStageChange = (newStage) => {
//     setStage(newStage);
//     setSelectedDepartment('');
//     setSelectedSubject('');
//     setSelectedQset(null);
//   };

//   const renderStageSwitch = () => (
//     <div className="ea-stage-switch">
//       <button 
//         className={`ea-stage-button ${stage === 'stage1' ? 'active' : ''}`}
//         onClick={() => handleStageChange('stage1')}
//       >
//         Stage 1
//       </button>
//       <button 
//         className={`ea-stage-button ${stage === 'stage3' ? 'active' : ''}`}
//         onClick={() => handleStageChange('stage3')}
//       >
//         Stage 3
//       </button>
//     </div>
//   );

//   const renderDepartments = () => (
//     <div className="ea-section">
//       <h2 className="ea-section-title">Departments</h2>
//       <div className="ea-card-container">
//         {data.departments.map((dept) => (
//           <div
//             key={dept.departmentId}
//             className={`ea-card ${selectedDepartment === dept.departmentId.toString() ? 'selected' : ''}`}
//             onClick={() => handleDepartmentClick(dept.departmentId.toString())}
//             ref={el => departmentRefs.current[dept.departmentId] = el}
//             tabIndex={0}
//           >
//             <h3>{dept.departmentName}</h3>
//             <p>Students: {dept.unassigned_count}/{dept.total_count}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   const renderSubjects = () => (
//     <div className="ea-section">
//       <h2 className="ea-section-title">Subjects</h2>
//       {data.subjects.length > 0 ? (
//         <div className="ea-card-container">
//           {data.subjects.map((subject) => (
//             <div
//               key={subject.subjectId}
//               className={`ea-card ${selectedSubject === subject.subjectId ? 'selected' : ''}`}
//               onClick={() => handleSubjectClick(subject.subjectId)}
//               ref={el => subjectRefs.current[subject.subjectId] = el}
//               tabIndex={0}
//             >
//               <h3>{subject.subject_name}</h3>
//               <p>Students: {subject.unassigned_count}/{subject.total_count}</p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="ea-no-data">No subjects available for this department</p>
//       )}
//     </div>
//   );

//   const renderQsets = () => (
//     <div className="ea-section">
//       <h2 className="ea-section-title">Question Sets</h2>
//       {data.qsets.length > 0 ? (
//         <div className="ea-card-container">
//           {data.qsets.map((qset) => (
//             <div key={qset.qset} className="ea-card" onClick={() => handleQsetClick(qset)}>
//               <h3>qset {qset.qset}</h3>
//               <p>Students: {qset.unassigned_count}/{qset.total_count}</p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="ea-no-data">No question sets available for this subject</p>
//       )}
//     </div>
//   );

//   const renderModal = () => {
//     return (
//       <div className="ea-modal">
//         <div className="ea-modal-content">
//           <h2>Assign/Unassign Expert</h2>
//           {modalError && <p className="ea-error">{modalError}</p>}
//           {modalStep === 'expertList' && (
//             <>
//               {expertsWithAssignedCounts.length > 0 ? (
//                 <div className="ea-expert-list">
//                   {expertsWithAssignedCounts.map(expert => (
//                     <div 
//                       key={expert.id} 
//                       className="ea-expert-item"
//                       onClick={() => handleExpertSelect(expert)}
//                     >
//                       ID_{expert.expertId} - {expert.expert_name} (Assigned: {expert.assignedCount})
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p>No experts available.</p>
//               )}
//               <div className="ea-modal-actions">
//                 <button onClick={() => setShowModal(false)}>Cancel</button>
//               </div>
//             </>
//           )}
//           {modalStep === 'studentCount' && (
//             <>
//               <p>Selected Expert: {selectedExpert.expert_name} (Assigned: {selectedExpert.assignedCount})</p>
//               <div className="ea-student-count">
//                 <label htmlFor="studentCount">Number of students to assign:</label>
//                 <input 
//                   type="number" 
//                   id="studentCount" 
//                   value={studentCount} 
//                   onChange={(e) => setStudentCount(e.target.value)}
//                   min="1"
//                   max={selectedQset.student_count}
//                 />
//               </div>
//               <div className="ea-student-count">
//                 <label htmlFor="unassignCount">Number of students to unassign:</label>
//                 <input 
//                   type="number" 
//                   id="unassignCount" 
//                   value={unassignCount} 
//                   onChange={(e) => setUnassignCount(e.target.value)}
//                   min="1"
//                   max={selectedExpert.assignedCount}
//                 />
//               </div>
//               <div className="ea-modal-actions">
//                 <button onClick={handleSubmit} disabled={!selectedExpert || !studentCount}>Assign</button>
//                 <button onClick={handleUnassign} disabled={!selectedExpert || !unassignCount}>Unassign</button>
//                 <button onClick={() => setModalStep('expertList')}>Back</button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderSummaryTable = () => {
//     const filteredSummaryData = selectedSummaryDepartment === 'all' 
//       ? summaryData 
//       : summaryData.filter(dept => dept.departmentId === parseInt(selectedSummaryDepartment));

//     const expertSummary = {};

//     filteredSummaryData.forEach(department => {
//       department.experts.forEach(expert => {
//         if (!expertSummary[expert.expertId]) {
//           expertSummary[expert.expertId] = {
//             expertId: expert.expertId,
//             expert_name: expert.expert_name,
//             assignments: []
//           };
//         }

//         expert.subjects.forEach(subject => {
//           const subjectAssignments = [];

//           subject.qsets.forEach(qset => {
//             subjectAssignments.push({
//               subject: subject.subject_name,
//               qset: qset.qset,
//               total: qset.total_students_in_qset,
//               assigned: qset.expert_assigned_count,
//               unassigned: qset.total_students_in_qset - qset.total_assigned_in_qset
//             });
//           });

//           expertSummary[expert.expertId].assignments.push(...subjectAssignments);
//         });
//       });
//     });

//     return (
//       <div className="ea-summary-table">
//         <h2>Assigned Students Summary</h2>
//         <div className="ea-summary-filter">
//           <button 
//             className={`ea-department-button ${selectedSummaryDepartment === 'all' ? 'active' : ''}`}
//             onClick={() => setSelectedSummaryDepartment('all')}
//           >
//             All Departments
//           </button>
//           {summaryData.map(dept => (
//             <button 
//               key={dept.departmentId}
//               className={`ea-department-button ${selectedSummaryDepartment === dept.departmentId.toString() ? 'active' : ''}`}
//               onClick={() => setSelectedSummaryDepartment(dept.departmentId.toString())}
//             >
//               {dept.departmentId}
//             </button>
//           ))}
//         </div>
//         <table>
//           <thead>
//             <tr>
//               <th>Expert ID</th>
//               <th>Name</th>
//               <th>Subject</th>
//               <th>Q Set</th>
//               <th>Total</th>
//               <th>Assigned</th>
//               <th>Unassigned</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Object.values(expertSummary).flatMap(expert => 
//               expert.assignments.map((assignment, index) => {
//                 const isFirstForSubject = 
//                   index === 0 || 
//                   assignment.subject !== expert.assignments[index - 1].subject;

//                 const rowspan = expert.assignments.filter(
//                   a => a.subject === assignment.subject
//                 ).length;

//                 return (
//                   <tr key={`${expert.expertId}-${index}`}>
//                     {index === 0 && (
//                       <>
//                         <td rowSpan={expert.assignments.length}>{expert.expertId}</td>
//                         <td rowSpan={expert.assignments.length}>{expert.expert_name}</td>
//                       </>
//                     )}
//                     {isFirstForSubject && (
//                       <td rowSpan={rowspan}>{assignment.subject}</td>
//                     )}
//                     <td>{assignment.qset}</td>
//                     <td>{assignment.total}</td>
//                     <td>{assignment.assigned}</td>
//                     <td>{assignment.unassigned}</td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   return (
//     <div className="ea-expert-assign">
//       <h1 className="ea-title">Expert Assign</h1>
//       {renderStageSwitch()}
//       {error && <p className="ea-error">{error}</p>}
      
//       {renderDepartments()}
//       {selectedDepartment && renderSubjects()}
//       {selectedDepartment && selectedSubject && renderQsets()}
//       {showModal && renderModal()}
      
//       <button 
//         className="ea-toggle-summary-button"
//         onClick={() => setShowSummaryTable(!showSummaryTable)}
//       >
//         {showSummaryTable ? 'Hide' : 'Show'} Assigned Students Summary
//       </button>
      
//       {showSummaryTable && renderSummaryTable()}
//     </div>
//   );
// };

// export default ExpertAssign;

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  Paper,
  useTheme,
  alpha,
  Fade,
  Stack,
  Button,
  TextField,
  IconButton,
  Tabs,
  Tab,
  Badge,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Collapse,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip
} from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import {
  Assignment as AssignIcon,
  Person as ExpertIcon,
  School as SubjectIcon,
  Business as DepartmentIcon,
  Quiz as QsetIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  AccountTree as StageIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as SummaryIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import CountUp from 'react-countup';
import { toast } from 'react-toastify';

// Full-width container
const StyledContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
  minHeight: '100vh',
  padding: theme.spacing(3),
  width: '100%',
}));

const AnalyticsCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  width: '100%',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)',
  }
}));

const SelectionCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
  backdropFilter: 'blur(15px)',
  borderRadius: '16px',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-6px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
  },
  '&.selected': {
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
    border: `2px solid ${theme.palette.primary.main}`,
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
  }
}));

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  borderRadius: '0',
  backgroundColor: 'transparent',
  fontFamily: theme.typography.fontFamily,
  width: '100%',
  height: '100%',
  '& .MuiDataGrid-main': {
    borderRadius: '0',
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    fontWeight: 700,
    fontSize: '0.95rem',
    color: theme.palette.primary.main,
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 700,
    }
  },
  '& .MuiDataGrid-cell': {
    borderColor: alpha(theme.palette.divider, 0.2),
    fontSize: '0.9rem',
    padding: theme.spacing(1),
  },
  '& .MuiDataGrid-row': {
    minHeight: '60px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
    }
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  minHeight: '48px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
  }
}));

// Enhanced Dialog
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '20px',
    maxWidth: '600px',
    width: '90vw',
    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
    backdropFilter: 'blur(20px)',
  }
}));

// Fixed Enhanced Metric Card Component
const EnhancedMetricCard = ({ 
  title, 
  unassignedCount, 
  totalCount, 
  icon, 
  color, 
  subtitle, 
  onClick, 
  selected = false 
}) => {
  const theme = useTheme();
  
  return (
    <SelectionCard 
      onClick={onClick}
      className={selected ? 'selected' : ''}
    >
      <CardContent sx={{ 
        p: 3, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Background decorative element */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '80px',
            height: '80px',
            background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
            borderRadius: '50%',
            transform: 'translate(25px, -25px)',
          }}
        />
        
        {/* Header with icon */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2, zIndex: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                mb: 0.5,
                fontSize: '1.1rem',
                color: 'text.primary'
              }}
            >
              {title}
            </Typography>
          </Box>
          
          <Box sx={{ 
            p: 1.5, 
            borderRadius: '16px', 
            bgcolor: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '48px',
            minHeight: '48px'
          }}>
            {React.cloneElement(icon, { sx: { fontSize: 28, color } })}
          </Box>
        </Stack>
        
        {/* Value display with separate counts */}
        <Box sx={{ zIndex: 1, mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 800, 
                color: theme.palette.warning.main, 
                fontSize: '1.8rem',
                lineHeight: 1.1,
              }}
            >
              <CountUp end={unassignedCount || 0} duration={1.5} separator="," />
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
              /
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 800, 
                color, 
                fontSize: '1.8rem',
                lineHeight: 1.1,
              }}
            >
              <CountUp end={totalCount || 0} duration={1.5} separator="," />
            </Typography>
          </Stack>
          
          {subtitle && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                fontSize: '0.875rem',
                lineHeight: 1.4,
                fontWeight: 500
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {/* Progress bar */}
        <Box sx={{ zIndex: 1, mt: 'auto' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
              Assignment Progress
            </Typography>
            <Typography variant="caption" sx={{ 
              fontWeight: 700, 
              color: theme.palette.success.main,
              fontSize: '0.8rem'
            }}>
              {totalCount > 0 ? (((totalCount - unassignedCount) / totalCount) * 100).toFixed(1) : 0}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={totalCount > 0 ? ((totalCount - unassignedCount) / totalCount) * 100 : 0}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: alpha(theme.palette.warning.main, 0.15),
              '& .MuiLinearProgress-bar': {
                backgroundColor: theme.palette.success.main,
                borderRadius: 4,
              }
            }}
          />
        </Box>
        
        {/* Selection indicator */}
        {selected && (
          <Box sx={{ 
            position: 'absolute', 
            top: 12, 
            right: 12,
            bgcolor: 'primary.main',
            color: 'white',
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2
          }}>
            <CheckCircleIcon sx={{ fontSize: 16 }} />
          </Box>
        )}
      </CardContent>
    </SelectionCard>
  );
};

// Custom Toolbar
const CustomToolbar = ({ title, count }) => (
  <GridToolbarContainer sx={{ 
    p: 3, 
    justifyContent: 'space-between',
    borderBottom: '1px solid',
    borderColor: 'divider'
  }}>
    <Stack direction="row" alignItems="center" spacing={2}>
      <SummaryIcon color="primary" sx={{ fontSize: 32 }} />
      <Box>
        <Typography variant="h6" sx={{ 
          fontWeight: 700, 
          color: 'primary.main',
          fontSize: '1.2rem'
        }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          {count} assignments found
        </Typography>
      </Box>
    </Stack>
    <Stack direction="row" spacing={1}>
      <GridToolbarFilterButton sx={{ borderRadius: 2 }} />
      <GridToolbarExport sx={{ borderRadius: 2 }} />
    </Stack>
  </GridToolbarContainer>
);

const ExpertAssign = () => {
  const theme = useTheme();
  
  // State management (same as before)
  const [data, setData] = useState({ departments: [], subjects: [], qsets: [] });
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [error, setError] = useState('');
  const [modalError, setModalError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [studentCount, setStudentCount] = useState('');
  const [selectedQset, setSelectedQset] = useState(null);
  const [experts, setExperts] = useState([]);
  const [modalStep, setModalStep] = useState(0);
  const [stage, setStage] = useState('stage1');
  const [summaryData, setSummaryData] = useState([]);
  const [unassignCount, setUnassignCount] = useState('');
  const [selectedSummaryDepartment, setSelectedSummaryDepartment] = useState('all');
  const [expertsWithAssignedCounts, setExpertsWithAssignedCounts] = useState([]);
  const [showSummaryTable, setShowSummaryTable] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(false);
  
  const departmentRefs = useRef({});
  const subjectRefs = useRef({});

  // All the useEffect and handler functions remain the same
  useEffect(() => {
    fetchData();
    fetchExperts();
    fetchSummaryData();
  }, [selectedDepartment, selectedSubject, stage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:3000/get-student-count-expert?${stage === 'stage1' ? 'stage_1' : 'stage_3'}=true`;
      if (selectedDepartment) {
        url += `&department=${selectedDepartment.toString()}`;
        if (selectedSubject) {
          url += `&subject=${selectedSubject}`;
        }
      }
      const response = await axios.get(url);
      
      setData(prevData => ({
        departments: selectedDepartment ? prevData.departments : response.data.results,
        subjects: selectedDepartment && !selectedSubject ? response.data.results : prevData.subjects,
        qsets: selectedSubject ? response.data.results : prevData.qsets
      }));
      setError('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again later.');
      setData({ departments: [], subjects: [], qsets: [] });
    } finally {
      setLoading(false);
    }
  };

  const fetchExperts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/get-experts');
      setExperts(response.data.results || []);
    } catch (error) {
      console.error("Error fetching experts:", error);
      setError('Error fetching experts. Please try again later.');
    }
  };

  const fetchSummaryData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/get-student-summary-expert?${stage === 'stage1' ? 'stage_1' : 'stage_3'}=true`);
      setSummaryData(response.data.departments);
    } catch (error) {
      console.error('Error fetching summary data:', error);
      setError('Error fetching summary data. Please try again later.');
    }
  };

  const handleDepartmentClick = (departmentId) => {
    setSelectedDepartment(departmentId);
    setSelectedSubject('');
    setTimeout(() => departmentRefs.current[departmentId]?.focus(), 0);
  };

  const handleSubjectClick = (subjectId) => {
    setSelectedSubject(subjectId);
    setTimeout(() => subjectRefs.current[subjectId]?.focus(), 0);
  };

  const handleQsetClick = (qset) => {
    setSelectedQset(qset);
    setShowModal(true);
    setModalStep(0);
    fetchExpertsWithAssignedCounts(qset);
  };

  const fetchExpertsWithAssignedCounts = (qset) => {
    const expertsWithCounts = experts.map(expert => {
      const departmentSummary = summaryData
        .find(dept => dept.departmentId === parseInt(selectedDepartment));
      
      let assignedCount = 0;
      if (departmentSummary) {
        const expertSummary = departmentSummary.experts
          .find(e => e.expertId === expert.expertId);
        if (expertSummary) {
          const subjectData = expertSummary.subjects
            .find(subject => subject.subjectId === selectedSubject);
          if (subjectData) {
            const qsetData = subjectData.qsets
              .find(q => q.qset === qset.qset);
            assignedCount = qsetData ? qsetData.expert_assigned_count : 0;
          }
        }
      }
      return { ...expert, assignedCount };
    });
    setExpertsWithAssignedCounts(expertsWithCounts);
  };

  const handleExpertSelect = (expert) => {
    setSelectedExpert(expert);
    setModalStep(1);
  };

  const handleSubmit = async () => {
    if (!selectedExpert || !studentCount || !selectedQset) {
      setModalError('Please select an expert, enter a student count, and select a question set.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/assign-expert', {
        department: selectedDepartment,
        subject: selectedSubject,
        qset: selectedQset.qset,
        expertId: selectedExpert.expertId,
        count: parseInt(studentCount),
        stage_1: stage === 'stage1',
        stage_3: stage === 'stage3'
      });
      
      handleCloseModal();
      fetchData();
      fetchSummaryData();
      showSnackbar('Expert assigned successfully!', 'success');
    } catch (error) {
      console.error('Error assigning expert:', error);
      setModalError('Error assigning expert. Please try again later.');
    }
  };

  const handleUnassign = async () => {
    if (!selectedExpert || !unassignCount || !selectedQset) {
      setModalError('Please select an expert, enter a student count to unassign, and select a question set.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/unassign-expert', {
        department: selectedDepartment,
        subject: selectedSubject,
        qset: selectedQset.qset,
        expertId: selectedExpert.expertId,
        count: parseInt(unassignCount),
        stage_1: stage === 'stage1',
        stage_3: stage === 'stage3'
      });
      
      handleCloseModal();
      fetchData();
      fetchSummaryData();
      showSnackbar('Expert unassigned successfully!', 'success');
    } catch (error) {
      console.error('Error unassigning expert:', error);
      setModalError('Error unassigning expert. Please try again later.');
    }
  };

  const handleStageChange = (event, newStage) => {
    if (newStage !== null) {
      setStage(newStage);
      setSelectedDepartment('');
      setSelectedSubject('');
      setSelectedQset(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedExpert(null);
    setStudentCount('');
    setUnassignCount('');
    setModalStep(0);
    setModalError('');
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Process summary data for DataGrid (same as before)
  const processSummaryData = () => {
    const filteredSummaryData = selectedSummaryDepartment === 'all' 
      ? summaryData 
      : summaryData.filter(dept => dept.departmentId === parseInt(selectedSummaryDepartment));

    const result = [];
    let idCounter = 0;

    filteredSummaryData.forEach(department => {
      department.experts.forEach(expert => {
        expert.subjects.forEach(subject => {
          subject.qsets.forEach(qset => {
            result.push({
              id: idCounter++,
              expertId: expert.expertId,
              expert_name: expert.expert_name,
              subject: subject.subject_name,
              qset: qset.qset,
              total: qset.total_students_in_qset,
              assigned: qset.expert_assigned_count,
              unassigned: qset.total_students_in_qset - qset.total_assigned_in_qset
            });
          });
        });
      });
    });

    return result;
  };

  // DataGrid columns (same as before)
  const summaryColumns = [
    {
      field: 'expertId',
      headerName: 'Expert ID',
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Chip label={`ID_${params.value}`} size="small" color="primary" variant="outlined" />
      )
    },
    {
      field: 'expert_name',
      headerName: 'Expert Name',
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <ExpertIcon fontSize="small" color="action" />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {params.value}
          </Typography>
        </Stack>
      )
    },
    { field: 'subject', headerName: 'Subject', flex: 1.2, minWidth: 150 },
    { field: 'qset', headerName: 'Q Set', flex: 0.8, minWidth: 80, align: 'center', headerAlign: 'center' },
    { field: 'total', headerName: 'Total', flex: 0.8, minWidth: 80, align: 'center', headerAlign: 'center' },
    { 
      field: 'assigned', 
      headerName: 'Assigned', 
      flex: 0.8, 
      minWidth: 90, 
      align: 'center', 
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip label={params.value} size="small" color="success" />
      )
    },
    { 
      field: 'unassigned', 
      headerName: 'Unassigned', 
      flex: 0.8, 
      minWidth: 100, 
      align: 'center', 
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip label={params.value} size="small" color="warning" />
      )
    }
  ];

  const summaryGridData = processSummaryData();

  return (
    <StyledContainer>
      <Fade in={true} timeout={800}>
        <Box sx={{ width: '100%' }}>
          {/* Header */}
          <Paper 
            elevation={0}
            sx={{ 
              mb: 4, 
              p: 4, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(66, 165, 245, 0.05) 100%)',
              borderRadius: '20px',
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.1)
            }}
          >
            <Stack alignItems="center" spacing={3}>
              <Box sx={{ 
                p: 3, 
                borderRadius: '50%', 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DashboardIcon sx={{ fontSize: '4rem', color: 'primary.main' }} />
              </Box>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                  }}
                >
                  Expert Assignment System
                </Typography>
                <Typography 
                  variant="h6" 
                  color="text.secondary" 
                  sx={{ 
                    fontSize: { xs: '1rem', sm: '1.2rem' },
                    fontWeight: 400,
                    maxWidth: '700px',
                    mx: 'auto',
                    lineHeight: 1.6
                  }}
                >
                  Efficiently assign and manage expert evaluations across departments and subjects
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Stage Selection */}
          <AnalyticsCard sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: '8px', 
                  bgcolor: alpha(theme.palette.primary.main, 0.1) 
                }}>
                  <StageIcon color="primary" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Stage Selection
                </Typography>
              </Stack>
              
              <ToggleButtonGroup
                value={stage}
                exclusive
                onChange={handleStageChange}
                aria-label="stage selection"
                sx={{ width: '100%', justifyContent: 'center' }}
              >
                <ToggleButton 
                  value="stage1" 
                  aria-label="stage 1"
                  sx={{ 
                    px: 4, 
                    py: 2, 
                    borderRadius: '12px 0 0 12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem'
                  }}
                >
                  <StageIcon sx={{ mr: 1 }} />
                  Stage 1
                </ToggleButton>
                <ToggleButton 
                  value="stage3" 
                  aria-label="stage 3"
                  sx={{ 
                    px: 4, 
                    py: 2, 
                    borderRadius: '0 12px 12px 0',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem'
                  }}
                >
                  <StageIcon sx={{ mr: 1 }} />
                  Stage 3
                </ToggleButton>
              </ToggleButtonGroup>
            </CardContent>
          </AnalyticsCard>

          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Loading Indicator */}
          {loading && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress sx={{ borderRadius: '4px' }} />
            </Box>
          )}

          {/* Departments Section - UPDATED */}
          <AnalyticsCard sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: '8px', 
                  bgcolor: alpha(theme.palette.secondary.main, 0.1) 
                }}>
                  <DepartmentIcon color="secondary" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                  Departments
                </Typography>
                <Badge badgeContent={data.departments.length} color="secondary" />
              </Stack>
              
              <Grid container spacing={3}>
                {data.departments.map((dept) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={dept.departmentId}>
                    <EnhancedMetricCard
                      title={dept.departmentName}
                      unassignedCount={dept.unassigned_count}
                      totalCount={dept.total_count}
                      icon={<DepartmentIcon />}
                      color="#7b1fa2"
                      subtitle="Unassigned/Total Students"
                      onClick={() => handleDepartmentClick(dept.departmentId.toString())}
                      selected={selectedDepartment === dept.departmentId.toString()}
                    />
                  </Grid>
                ))}
              </Grid>
              
              {data.departments.length === 0 && !loading && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <InfoIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No departments available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </AnalyticsCard>

          {/* Subjects Section - UPDATED */}
          {selectedDepartment && (
            <AnalyticsCard sx={{ mb: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: '8px', 
                    bgcolor: alpha(theme.palette.success.main, 0.1) 
                  }}>
                    <SubjectIcon color="success" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                    Subjects
                  </Typography>
                  <Badge badgeContent={data.subjects.length} color="success" />
                </Stack>
                
                <Grid container spacing={3}>
                  {data.subjects.map((subject) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={subject.subjectId}>
                      <EnhancedMetricCard
                        title={subject.subject_name}
                        unassignedCount={subject.unassigned_count}
                        totalCount={subject.total_count}
                        icon={<SubjectIcon />}
                        color="#2e7d32"
                        subtitle="Unassigned/Total Students"
                        onClick={() => handleSubjectClick(subject.subjectId)}
                        selected={selectedSubject === subject.subjectId}
                      />
                    </Grid>
                  ))}
                </Grid>
                
                {data.subjects.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <InfoIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No subjects available for this department
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </AnalyticsCard>
          )}

          {/* Question Sets Section - UPDATED */}
          {selectedDepartment && selectedSubject && (
            <AnalyticsCard sx={{ mb: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: '8px', 
                    bgcolor: alpha(theme.palette.warning.main, 0.1) 
                  }}>
                    <QsetIcon color="warning" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main' }}>
                    Question Sets
                  </Typography>
                  <Badge badgeContent={data.qsets.length} color="warning" />
                </Stack>
                
                <Grid container spacing={3}>
                  {data.qsets.map((qset) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={qset.qset}>
                      <EnhancedMetricCard
                        title={`Q Set ${qset.qset}`}
                        unassignedCount={qset.unassigned_count}
                        totalCount={qset.total_count}
                        icon={<QsetIcon />}
                        color="#ed6c02"
                        subtitle="Unassigned/Total Students"
                        onClick={() => handleQsetClick(qset)}
                      />
                    </Grid>
                  ))}
                </Grid>
                
                {data.qsets.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <InfoIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No question sets available for this subject
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </AnalyticsCard>
          )}

          {/* Summary Table - Rest remains same */}
          <AnalyticsCard>
            <CardContent sx={{ p: 0 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3, pb: 0 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: '8px', 
                    bgcolor: alpha(theme.palette.info.main, 0.1) 
                  }}>
                    <SummaryIcon color="info" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'info.main' }}>
                    Assignment Summary
                  </Typography>
                </Stack>
                
                <StyledButton
                  variant={showSummaryTable ? 'outlined' : 'contained'}
                  onClick={() => setShowSummaryTable(!showSummaryTable)}
                  startIcon={showSummaryTable ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                  {showSummaryTable ? 'Hide' : 'Show'} Summary
                </StyledButton>
              </Stack>

              <Collapse in={showSummaryTable}>
                <Box sx={{ p: 3, pt: 2 }}>
                  {/* Department Filter */}
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                    <Chip
                      label="All Departments"
                      onClick={() => setSelectedSummaryDepartment('all')}
                      color={selectedSummaryDepartment === 'all' ? 'primary' : 'default'}
                      variant={selectedSummaryDepartment === 'all' ? 'filled' : 'outlined'}
                    />
                    {summaryData.map(dept => (
                      <Chip
                        key={dept.departmentId}
                        label={`Department ${dept.departmentId}`}
                        onClick={() => setSelectedSummaryDepartment(dept.departmentId.toString())}
                        color={selectedSummaryDepartment === dept.departmentId.toString() ? 'secondary' : 'default'}
                        variant={selectedSummaryDepartment === dept.departmentId.toString() ? 'filled' : 'outlined'}
                      />
                    ))}
                  </Stack>

                  {/* Data Table */}
                  <Box sx={{ height: '500px', width: '100%' }}>
                    <StyledDataGrid
                      rows={summaryGridData}
                      columns={summaryColumns}
                      pageSizeOptions={[10, 25, 50]}
                      disableRowSelectionOnClick
                      hideFooterSelectedRowCount
                      checkboxSelection={false}
                      rowSelection={false}
                      slots={{
                        toolbar: () => (
                          <CustomToolbar 
                            title="Expert Assignments Overview"
                            count={summaryGridData.length}
                          />
                        )
                      }}
                    />
                  </Box>
                </Box>
              </Collapse>
            </CardContent>
          </AnalyticsCard>

          {/* Modal and other components remain the same */}
          {/* Assignment Modal */}
          <StyledDialog open={showModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
            <DialogTitle>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Expert Assignment
                </Typography>
                <IconButton onClick={handleCloseModal} size="small">
                  <CloseIcon />
                </IconButton>
              </Stack>
            </DialogTitle>
            
            <DialogContent>
              {modalError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                  {modalError}
                </Alert>
              )}

              <Stepper activeStep={modalStep} orientation="vertical">
                <Step>
                  <StepLabel>Select Expert</StepLabel>
                  <StepContent>
                    <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                      {expertsWithAssignedCounts.map(expert => (
                        <ListItem key={expert.id} disablePadding>
                          <ListItemButton 
                            onClick={() => handleExpertSelect(expert)}
                            selected={selectedExpert?.expertId === expert.expertId}
                            sx={{ borderRadius: '8px', mb: 1 }}
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                <ExpertIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={`ID_${expert.expertId} - ${expert.expert_name}`}
                              secondary={`Currently assigned: ${expert.assignedCount} students`}
                            />
                            {expert.assignedCount > 0 && (
                              <Chip 
                                label={expert.assignedCount} 
                                size="small" 
                                color="primary" 
                                variant="outlined" 
                              />
                            )}
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </StepContent>
                </Step>

                <Step>
                  <StepLabel>Assign/Unassign Students</StepLabel>
                  <StepContent>
                    {selectedExpert && (
                      <Box sx={{ mt: 2 }}>
                        <Alert severity="info" sx={{ mb: 3, borderRadius: '8px' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Selected Expert: {selectedExpert.expert_name}
                          </Typography>
                          <Typography variant="body2">
                            Currently assigned: {selectedExpert.assignedCount} students
                          </Typography>
                        </Alert>

                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Students to Assign"
                              value={studentCount}
                              onChange={(e) => setStudentCount(e.target.value)}
                              inputProps={{ min: 1, max: selectedQset?.student_count }}
                              helperText={`Max available: ${selectedQset?.student_count || 0}`}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Students to Unassign"
                              value={unassignCount}
                              onChange={(e) => setUnassignCount(e.target.value)}
                              inputProps={{ min: 1, max: selectedExpert?.assignedCount }}
                              helperText={`Max unassignable: ${selectedExpert?.assignedCount || 0}`}
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </StepContent>
                </Step>
              </Stepper>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleCloseModal} variant="outlined">
                Cancel
              </Button>
              {modalStep === 1 && (
                <Stack direction="row" spacing={2}>
                  <Button 
                    onClick={() => setModalStep(0)} 
                    variant="outlined"
                    startIcon={<ExpandLessIcon />}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedExpert || !studentCount}
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ 
                      background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                      color: 'white'
                    }}
                  >
                    Assign
                  </Button>
                  <Button
                    onClick={handleUnassign}
                    disabled={!selectedExpert || !unassignCount}
                    variant="contained"
                    startIcon={<RemoveIcon />}
                    color="error"
                  >
                    Unassign
                  </Button>
                </Stack>
              )}
            </DialogActions>
          </StyledDialog>

          {/* Success/Error Snackbar */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert 
              onClose={() => setSnackbarOpen(false)} 
              severity={snackbarSeverity}
              sx={{ width: '100%' }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Fade>
    </StyledContainer>
  );
};

export default ExpertAssign;
