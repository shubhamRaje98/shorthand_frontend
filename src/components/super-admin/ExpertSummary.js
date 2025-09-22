// // // // ExpertSummary.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './ExpertSummary.css';

// const ExpertSummary = () => {
//   const [summaryData, setSummaryData] = useState([]);
//   const [selectedSummaryDepartment, setSelectedSummaryDepartment] = useState('all');
//   const [selectedSubjectDepartment, setSelectedSubjectDepartment] = useState('all');
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [stage, setStage] = useState('stage_1');
//   const [showAssignedSummary, setShowAssignedSummary] = useState(false);
//   const [showSubjectWiseSummary, setShowSubjectWiseSummary] = useState(false);
//   const [showDepartmentWiseSummary, setShowDepartmentWiseSummary] = useState(false);
//   const [showDepartmentDetails, setShowDepartmentDetails] = useState(false);

//   useEffect(() => {
//     fetchData();
//     fetchSummaryData();

//     // Set up interval for refreshing data every minute
//     const intervalId = setInterval(() => {
//       fetchData();
//       fetchSummaryData();
//     }, 60000); 

//     return () => clearInterval(intervalId);
//   }, [stage]);

//   const fetchSummaryData = async () => {
//     try {
//       const response = await axios.get(`http://localhost:3000/checked-students?${stage}=true`);
//       setSummaryData(response.data.departments);
//     } catch (error) {
//       console.error('Error fetching summary data:', error);
//       setError('Error fetching summary data. Please try again later.');
//     }
//   };

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`http://localhost:3000/checked-students?${stage}=true`);
//       setData(response.data);
//       setError(null);
//     } catch (err) {
//       setError('Error fetching data. Please try again.');
//       setData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStageChange = (e) => {
//     setStage(e.target.value);
//   };

//   const toggleAssignedSummary = () => {
//     setShowAssignedSummary(!showAssignedSummary);
//   };

//   const toggleSubjectWiseSummary = () => {
//     setShowSubjectWiseSummary(!showSubjectWiseSummary);
//   };

//   const toggleDepartmentWiseSummary = () => {
//     setShowDepartmentWiseSummary(!showDepartmentWiseSummary);
//   };

//   const toggleDepartmentDetails = () => {
//     setShowDepartmentDetails(!showDepartmentDetails);
//   };

//   const renderExpertsTotalAssigned = () => {
//     const filteredSummaryData = selectedSummaryDepartment === 'all' 
//       ? summaryData 
//       : summaryData.filter(dept => dept.departmentId === parseInt(selectedSummaryDepartment));

//     const expertTotals = {};

//     filteredSummaryData.forEach(department => {
//       department.experts.forEach(expert => {
//         if (!expertTotals[expert.expertId]) {
//           expertTotals[expert.expertId] = {
//             expertId: expert.expertId,
//             expert_name: expert.expert_name,
//             total_assigned: 0,
//             total_submitted: 0,
//             total_pending: 0
//           };
//         }

//         expert.subjects.forEach(subject => {
//           subject.qsets.forEach(qset => {
//             expertTotals[expert.expertId].total_assigned += qset.expert_assigned_count;
//             expertTotals[expert.expertId].total_submitted += qset.submitted_students;
//             expertTotals[expert.expertId].total_pending += qset.pending_students;
//           });
//         });
//       });
//     });

//     return (
//       <div className="expert-summary__total-assigned">
//         <h2 className="expert-summary__summary-title">Experts Total Assigned</h2>
//         <div className="expert-summary__table-wrapper">
//           <table className="expert-summary__table">
//             <thead>
//               <tr>
//                 <th>Expert ID</th>
//                 <th>Name</th>
//                 <th>Total Assigned</th>
//                 <th>Total Submitted</th>
//                 <th>Total Pending</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.values(expertTotals).map(expert => (
//                 <tr key={expert.expertId}>
//                   <td>{expert.expertId}</td>
//                   <td>{expert.expert_name}</td>
//                   <td>{expert.total_assigned}</td>
//                   <td>{expert.total_submitted}</td>
//                   <td>{expert.total_pending}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
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
//               expert_assigned_count: qset.expert_assigned_count,
//               pending_students: qset.pending_students,
//               submitted_students: qset.submitted_students
//             });
//           });

//           expertSummary[expert.expertId].assignments.push(...subjectAssignments);
//         });
//       });
//     });

//     return (
//       <div className="expert-summary__summary-table">
//         <h2 className="expert-summary__summary-title">Assigned Students Summary</h2>
//         <div className="expert-summary__table-wrapper">
//           <table className="expert-summary__table">
//             <thead>
//               <tr>
//                 <th>Expert ID</th>
//                 <th>Name</th>
//                 <th>Subject</th>
//                 <th>Q Set</th>
//                 <th>Assigned</th>
//                 <th>Submitted</th>
//                 <th>Pending</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.values(expertSummary).flatMap(expert => 
//                 expert.assignments.map((assignment, index) => {
//                   const isFirstForSubject = 
//                     index === 0 || 
//                     assignment.subject !== expert.assignments[index - 1].subject;

//                   const rowspan = expert.assignments.filter(
//                     a => a.subject === assignment.subject
//                   ).length;

//                   return (
//                     <tr key={`${expert.expertId}-${index}`}>
//                       {index === 0 && (
//                         <>
//                           <td rowSpan={expert.assignments.length}>{expert.expertId}</td>
//                           <td rowSpan={expert.assignments.length}>{expert.expert_name}</td>
//                         </>
//                       )}
//                       {isFirstForSubject && (
//                         <td rowSpan={rowspan}>{assignment.subject}</td>
//                       )}
//                       <td>{assignment.qset}</td>
//                       <td>{assignment.expert_assigned_count}</td>
//                       <td>{assignment.submitted_students}</td>
//                       <td>{assignment.pending_students}</td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   const renderSubjectWiseSummary = () => {
//     const subjectSummary = {};

//     const filteredDepartments = selectedSubjectDepartment === 'all'
//       ? data.departments
//       : data.departments.filter(dept => dept.departmentId === parseInt(selectedSubjectDepartment));

//     filteredDepartments.forEach(department => {
//       department.experts.forEach(expert => {
//         expert.subjects.forEach(subject => {
//           if (!subjectSummary[subject.subjectId]) {
//             subjectSummary[subject.subjectId] = {
//               subjectId: subject.subjectId,
//               subject_name: subject.subject_name,
//               submitted: 0,
//               pending: 0,
//               assigned: 0
//             };
//           }

//           subject.qsets.forEach(qset => {
//             subjectSummary[subject.subjectId].submitted += qset.submitted_students;
//             subjectSummary[subject.subjectId].pending += qset.pending_students;
//             subjectSummary[subject.subjectId].assigned += qset.expert_assigned_count;
//           });
//         });
//       });
//     });

//     return (
//       <div className="expert-summary__subject-summary">
//         <h2 className="expert-summary__summary-title">Subject-wise Summary</h2>
//         <div className="expert-summary__table-wrapper">
//           <table className="expert-summary__table">
//             <thead>
//               <tr>
//                 <th>Subject ID</th>
//                 <th>Subject Name</th>
//                 <th>Total Assigned</th>
//                 <th>Total Submitted</th>
//                 <th>Total Pending</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.values(subjectSummary).map((subject) => (
//                 <tr key={subject.subjectId}>
//                   <td>{subject.subjectId}</td>
//                   <td>{subject.subject_name}</td>
//                   <td>{subject.assigned}</td>
//                   <td>{subject.submitted}</td>
//                   <td>{subject.pending}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   const renderDepartmentWiseSummary = () => {
//     const departmentSummary = {};

//     data.departments.forEach(department => {
//       departmentSummary[department.departmentId] = {
//         departmentId: department.departmentId,
//         name: department.department_name,
//         submitted: 0,
//         pending: 0,
//         assigned: 0
//       };

//       department.experts.forEach(expert => {
//         expert.subjects.forEach(subject => {
//           subject.qsets.forEach(qset => {
//             departmentSummary[department.departmentId].submitted += qset.submitted_students;
//             departmentSummary[department.departmentId].pending += qset.pending_students;
//             departmentSummary[department.departmentId].assigned += qset.expert_assigned_count;
//           });
//         });
//       });
//     });

//     return (
//       <div className="expert-summary__department-summary">
//         <h2 className="expert-summary__summary-title">Department-wise Summary</h2>
//         <div className="expert-summary__table-wrapper">
//           <table className="expert-summary__table">
//             <thead>
//               <tr>
//                 <th>Department ID</th>
//                 <th>Total Assigned</th>
//                 <th>Total Submitted</th>
//                 <th>Total Pending</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.values(departmentSummary).map((department) => (
//                 <tr key={department.departmentId}>
//                   <td>{department.departmentId}</td>
//                   <td>{department.assigned}</td>
//                   <td>{department.submitted}</td>
//                   <td>{department.pending}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   if (loading) return <div className="expert-summary__loading">Loading...</div>;
//   if (error) return <div className="expert-summary__error">{error}</div>;
//   if (!data || !data.departments) return <div className="expert-summary__no-data">No data available</div>;

//   return (
//     <div className="expert-summary">
//       <h1 className="expert-summary__title">Expert Summary</h1>
//       <div className="expert-summary__stage-selector">
//         <button
//           className={`expert-summary__stage-button ${stage === 'stage_1' ? 'active' : ''}`}
//           onClick={() => setStage('stage_1')}
//         >
//           Stage 1
//         </button>
//         <button
//           className={`expert-summary__stage-button ${stage === 'stage_3' ? 'active' : ''}`}
//           onClick={() => setStage('stage_3')}
//         >
//           Stage 3
//         </button>
//       </div>
//       <div className="expert-summary__summary-filter">
//         <button
//           className={`expert-summary__department-button ${selectedSummaryDepartment === 'all' ? 'active' : ''}`}
//           onClick={() => setSelectedSummaryDepartment('all')}
//         >
//           All Departments
//         </button>
//         {summaryData.map(dept => (
//           <button
//             key={dept.departmentId}
//             className={`expert-summary__department-button ${selectedSummaryDepartment === dept.departmentId.toString() ? 'active' : ''}`}
//             onClick={() => setSelectedSummaryDepartment(dept.departmentId.toString())}
//           >
//             Department {dept.departmentId}
//           </button>
//         ))}
//       </div>
//       {renderExpertsTotalAssigned()}

//       <div className="expert-summary__toggle-buttons">
//         <button 
//           className="expert-summary__toggle-button" 
//           onClick={toggleAssignedSummary}
//         >
//           {showAssignedSummary ? 'Hide' : 'Show'} Assigned Students Summary
//         </button>
//         <button 
//           className="expert-summary__toggle-button" 
//           onClick={toggleSubjectWiseSummary}
//         >
//           {showSubjectWiseSummary ? 'Hide' : 'Show'} Subject-wise Summary
//         </button>
//         <button 
//           className="expert-summary__toggle-button" 
//           onClick={toggleDepartmentWiseSummary}
//         >
//           {showDepartmentWiseSummary ? 'Hide' : 'Show'} Department-wise Summary
//         </button>
//         <button 
//           className="expert-summary__toggle-button" 
//           onClick={toggleDepartmentDetails}
//         >
//           {showDepartmentDetails ? 'Hide' : 'Show'} Department Details
//         </button>
//       </div>

//       <div className="expert-summary__content">
//         {showAssignedSummary && renderSummaryTable()}
//         {showSubjectWiseSummary && (
//           <>
//             <div className="expert-summary__summary-filter">
//               <button
//                 className={`expert-summary__department-button ${selectedSubjectDepartment === 'all' ? 'active' : ''}`}
//                 onClick={() => setSelectedSubjectDepartment('all')}
//               >
//                 All Departments
//               </button>
//               {data.departments.map(dept => (
//                 <button
//                   key={dept.departmentId}
//                   className={`expert-summary__department-button ${selectedSubjectDepartment === dept.departmentId.toString() ? 'active' : ''}`}
//                   onClick={() => setSelectedSubjectDepartment(dept.departmentId.toString())}
//                 >
//                   Department {dept.departmentId}
//                 </button>
//               ))}
//             </div>
//             {renderSubjectWiseSummary()}
//           </>
//         )}
//         {showDepartmentWiseSummary && renderDepartmentWiseSummary()}
//         {showDepartmentDetails && data.departments.map((department) => (
//           <div key={department.departmentId} className="expert-summary__department">
//             <h2 className="expert-summary__department-title">Department ID: {department.departmentId}</h2>
//             {department.experts.map((expert) => (
//               <div key={expert.expertId} className="expert-summary__expert">
//                 <h3 className="expert-summary__expert-title">Expert: {expert.expert_name} (ID: {expert.expertId})</h3>
//                 <div className="expert-summary__table-wrapper">
//                   <table className="expert-summary__table">
//                     <thead>
//                       <tr>
//                         <th>Subject</th>
//                         <th>Question Set</th>
//                         <th>Assigned</th>
//                         <th>Submitted</th>
//                         <th>Pending</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {expert.subjects.flatMap((subject) =>
//                         subject.qsets.map((qset, index) => (
//                           <tr key={`${subject.subjectId}-${qset.qset}`}>
//                             {index === 0 && (
//                               <td rowSpan={subject.qsets.length} className="expert-summary__subject-name">
//                                 {subject.subject_name}
//                               </td>
//                             )}
//                             <td>{qset.qset}</td>
//                             <td>{qset.expert_assigned_count}</td>
//                             <td>{qset.submitted_students}</td>
//                             <td>{qset.pending_students}</td>
//                           </tr>
//                         ))
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ExpertSummary;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  LinearProgress,
  Tooltip,
  IconButton,
  Paper,
  useTheme,
  alpha,
  Fade,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tabs,
  Tab,
  Badge,
  Typography
} from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import {
  Assessment as AnalyticsIcon,
  Person as ExpertIcon,
  School as SubjectIcon,
  Business as DepartmentIcon,
  Assignment as AssignmentIcon,
  CheckCircle as SubmittedIcon,
  Schedule as PendingIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Dashboard as DashboardIcon,
  FilterList as FilterIcon,
  AccountTree as StageIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import CountUp from 'react-countup';

// Full-width container without maxWidth restriction
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

const MetricCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
  backdropFilter: 'blur(15px)',
  borderRadius: '20px',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-6px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
  }
}));

// Full-width DataGrid with auto column sizing
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
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1.5),
  },
  '& .MuiDataGrid-row': {
    minHeight: '60px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
      transform: 'scale(1.001)',
    }
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
  }
}));

const FilterCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
  marginBottom: theme.spacing(3),
  width: '100%',
}));

// Enhanced Metric Card Component
const EnhancedMetricCard = ({ title, value, icon, color, percentage, subtitle, trend }) => {
  const theme = useTheme();
  
  return (
    <MetricCard>
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
            width: '100px',
            height: '100px',
            background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
            borderRadius: '50%',
            transform: 'translate(35px, -35px)',
          }}
        />
        
        {/* Header with icon */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2, zIndex: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="subtitle2" 
              color="text.secondary" 
              sx={{ 
                fontWeight: 600, 
                mb: 1,
                fontSize: '0.8rem',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
            >
              {title}
            </Typography>
          </Box>
          
          <Box sx={{ 
            p: 1.5, 
            borderRadius: '16px', 
            bgcolor: `${color}12`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '56px',
            minHeight: '56px'
          }}>
            {React.cloneElement(icon, { sx: { fontSize: 32, color } })}
          </Box>
        </Stack>
        
        {/* Value and subtitle */}
        <Box sx={{ mb: 2, zIndex: 1 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              color, 
              mb: 0.5,
              fontSize: { xs: '1.8rem', sm: '2.2rem' },
              lineHeight: 1.1,
              fontFamily: 'inherit'
            }}
          >
            <CountUp end={value} duration={2.5} separator="," />
          </Typography>
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
        
        {/* Progress section */}
        {percentage && (
          <Box sx={{ mt: 'auto', zIndex: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: '0.75rem', fontWeight: 600 }}
              >
                Completion Rate
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontWeight: 700, 
                  color,
                  fontSize: '0.8rem'
                }}
              >
                {percentage.toFixed(1)}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha(color, 0.15),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: color,
                  borderRadius: 4,
                }
              }}
            />
          </Box>
        )}
        
        {/* Trend indicator */}
        {trend && (
          <Box sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: 'success.main',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            zIndex: 2
          }}>
            <TrendingUpIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
              {trend}
            </Typography>
          </Box>
        )}
      </CardContent>
    </MetricCard>
  );
};

// Custom Toolbar
const CustomToolbar = ({ title, count, onRefresh }) => (
  <GridToolbarContainer sx={{ 
    p: 3, 
    justifyContent: 'space-between',
    borderBottom: '1px solid',
    borderColor: 'divider'
  }}>
    <Stack direction="row" alignItems="center" spacing={2}>
      <AnalyticsIcon color="primary" sx={{ fontSize: 32 }} />
      <Box>
        <Typography variant="h6" sx={{ 
          fontWeight: 700, 
          color: 'primary.main',
          fontSize: '1.2rem'
        }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          {count} records found
        </Typography>
      </Box>
    </Stack>
    <Stack direction="row" spacing={1}>
      <GridToolbarFilterButton sx={{ borderRadius: 2 }} />
      <GridToolbarExport sx={{ borderRadius: 2 }} />
      <Tooltip title="Refresh Data">
        <IconButton onClick={onRefresh} size="small" sx={{ borderRadius: 2 }}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  </GridToolbarContainer>
);

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ExpertSummary = () => {
  const theme = useTheme();
  const [summaryData, setSummaryData] = useState([]);
  const [selectedSummaryDepartment, setSelectedSummaryDepartment] = useState('all');
  const [selectedSubjectDepartment, setSelectedSubjectDepartment] = useState('all');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stage, setStage] = useState('stage_1');
  const [tabValue, setTabValue] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  useEffect(() => {
    fetchData();
    fetchSummaryData();
    // Set up interval for refreshing data every minute
    const intervalId = setInterval(() => {
      fetchData();
      fetchSummaryData();
    }, 60000); 
    return () => clearInterval(intervalId);
  }, [stage]);

  const fetchSummaryData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/checked-students?${stage}=true`);
      setSummaryData(response.data.departments);
    } catch (error) {
      console.error('Error fetching summary data:', error);
      setError('Error fetching summary data. Please try again later.');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/checked-students?${stage}=true`);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching data. Please try again.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Calculate overall metrics
  const overallMetrics = React.useMemo(() => {
    if (!data || !data.departments) return null;
    
    let totalExperts = 0;
    let totalAssigned = 0;
    let totalSubmitted = 0;
    let totalPending = 0;
    let totalSubjects = new Set();
    let totalDepartments = data.departments.length;

    data.departments.forEach(department => {
      totalExperts += department.experts.length;
      department.experts.forEach(expert => {
        expert.subjects.forEach(subject => {
          totalSubjects.add(subject.subjectId);
          subject.qsets.forEach(qset => {
            totalAssigned += qset.expert_assigned_count;
            totalSubmitted += qset.submitted_students;
            totalPending += qset.pending_students;
          });
        });
      });
    });

    const completionRate = totalAssigned > 0 ? (totalSubmitted / totalAssigned) * 100 : 0;

    return {
      totalExperts,
      totalAssigned,
      totalSubmitted,
      totalPending,
      totalSubjects: totalSubjects.size,
      totalDepartments,
      completionRate
    };
  }, [data]);

  // Process data for Expert Totals DataGrid
  const expertTotalsData = React.useMemo(() => {
    if (!summaryData) return [];
    
    const filteredSummaryData = selectedSummaryDepartment === 'all' 
      ? summaryData 
      : summaryData.filter(dept => dept.departmentId === parseInt(selectedSummaryDepartment));

    const expertTotals = {};
    filteredSummaryData.forEach(department => {
      department.experts.forEach(expert => {
        if (!expertTotals[expert.expertId]) {
          expertTotals[expert.expertId] = {
            id: expert.expertId,
            expertId: expert.expertId,
            expert_name: expert.expert_name,
            total_assigned: 0,
            total_submitted: 0,
            total_pending: 0,
            completion_rate: 0
          };
        }
        expert.subjects.forEach(subject => {
          subject.qsets.forEach(qset => {
            expertTotals[expert.expertId].total_assigned += qset.expert_assigned_count;
            expertTotals[expert.expertId].total_submitted += qset.submitted_students;
            expertTotals[expert.expertId].total_pending += qset.pending_students;
          });
        });
        // Calculate completion rate
        if (expertTotals[expert.expertId].total_assigned > 0) {
          expertTotals[expert.expertId].completion_rate = 
            (expertTotals[expert.expertId].total_submitted / expertTotals[expert.expertId].total_assigned) * 100;
        }
      });
    });

    return Object.values(expertTotals);
  }, [summaryData, selectedSummaryDepartment]);

  // Process data for Assigned Students DataGrid
  const assignedStudentsData = React.useMemo(() => {
    if (!summaryData) return [];
    
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
              expert_assigned_count: qset.expert_assigned_count,
              submitted_students: qset.submitted_students,
              pending_students: qset.pending_students,
              completion_rate: qset.expert_assigned_count > 0 ? (qset.submitted_students / qset.expert_assigned_count) * 100 : 0
            });
          });
        });
      });
    });

    return result;
  }, [summaryData, selectedSummaryDepartment]);

  // Process data for Subject-wise Summary
  const subjectWiseData = React.useMemo(() => {
    if (!data || !data.departments) return [];
    
    const filteredDepartments = selectedSubjectDepartment === 'all'
      ? data.departments
      : data.departments.filter(dept => dept.departmentId === parseInt(selectedSubjectDepartment));

    const subjectSummary = {};
    filteredDepartments.forEach(department => {
      department.experts.forEach(expert => {
        expert.subjects.forEach(subject => {
          if (!subjectSummary[subject.subjectId]) {
            subjectSummary[subject.subjectId] = {
              id: subject.subjectId,
              subjectId: subject.subjectId,
              subject_name: subject.subject_name,
              assigned: 0,
              submitted: 0,
              pending: 0,
              completion_rate: 0
            };
          }
          subject.qsets.forEach(qset => {
            subjectSummary[subject.subjectId].assigned += qset.expert_assigned_count;
            subjectSummary[subject.subjectId].submitted += qset.submitted_students;
            subjectSummary[subject.subjectId].pending += qset.pending_students;
          });
          // Calculate completion rate
          if (subjectSummary[subject.subjectId].assigned > 0) {
            subjectSummary[subject.subjectId].completion_rate = 
              (subjectSummary[subject.subjectId].submitted / subjectSummary[subject.subjectId].assigned) * 100;
          }
        });
      });
    });

    return Object.values(subjectSummary);
  }, [data, selectedSubjectDepartment]);

  // Process data for Department-wise Summary
  const departmentWiseData = React.useMemo(() => {
    if (!data || !data.departments) return [];
    
    const result = data.departments.map(department => {
      let assigned = 0;
      let submitted = 0;
      let pending = 0;

      department.experts.forEach(expert => {
        expert.subjects.forEach(subject => {
          subject.qsets.forEach(qset => {
            assigned += qset.expert_assigned_count;
            submitted += qset.submitted_students;
            pending += qset.pending_students;
          });
        });
      });

      return {
        id: department.departmentId,
        departmentId: department.departmentId,
        department_name: department.department_name || `Department ${department.departmentId}`,
        assigned,
        submitted,
        pending,
        completion_rate: assigned > 0 ? (submitted / assigned) * 100 : 0,
        expert_count: department.experts.length
      };
    });

    return result;
  }, [data]);

  // Auto-sizing columns for full width
  const expertTotalsColumns = [
    {
      field: 'expertId',
      headerName: 'Expert ID',
      flex: 0.8,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip label={params.value} size="small" color="primary" variant="outlined" />
      )
    },
    {
      field: 'expert_name',
      headerName: 'Expert Name',
      flex: 1.5,
      minWidth: 200,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <ExpertIcon fontSize="small" color="action" />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {params.value}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'total_assigned',
      headerName: 'Total Assigned',
      flex: 1,
      minWidth: 130,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'total_submitted',
      headerName: 'Submitted',
      flex: 1,
      minWidth: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip label={params.value} size="small" color="success" />
      )
    },
    {
      field: 'total_pending',
      headerName: 'Pending',
      flex: 1,
      minWidth: 110,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip label={params.value} size="small" color="warning" />
      )
    },
    {
      field: 'completion_rate',
      headerName: 'Completion Rate',
      flex: 1,
      minWidth: 140,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {params.value.toFixed(1)}%
          </Typography>
        </Stack>
      )
    }
  ];

  // Auto-sizing columns for Assigned Students
  const assignedStudentsColumns = [
    { field: 'expertId', headerName: 'Expert ID', flex: 0.6, minWidth: 90, align: 'center', headerAlign: 'center' },
    { field: 'expert_name', headerName: 'Expert Name', flex: 1.2, minWidth: 160 },
    { field: 'subject', headerName: 'Subject', flex: 1.5, minWidth: 180 },
    { field: 'qset', headerName: 'Q Set', flex: 0.6, minWidth: 80, align: 'center', headerAlign: 'center' },
    { field: 'expert_assigned_count', headerName: 'Assigned', flex: 0.7, minWidth: 90, align: 'center', headerAlign: 'center' },
    { field: 'submitted_students', headerName: 'Submitted', flex: 0.8, minWidth: 100, align: 'center', headerAlign: 'center' },
    { field: 'pending_students', headerName: 'Pending', flex: 0.7, minWidth: 90, align: 'center', headerAlign: 'center' },
    {
      field: 'completion_rate',
      headerName: 'Completion %',
      flex: 0.9,
      minWidth: 110,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => `${params.value.toFixed(1)}%`
    }
  ];

  // Auto-sizing columns for Subject-wise Summary
  const subjectWiseColumns = [
    { field: 'subjectId', headerName: 'Subject ID', flex: 0.8, minWidth: 100, align: 'center', headerAlign: 'center' },
    { field: 'subject_name', headerName: 'Subject Name', flex: 2, minWidth: 200 },
    { field: 'assigned', headerName: 'Total Assigned', flex: 1, minWidth: 120, align: 'center', headerAlign: 'center' },
    { field: 'submitted', headerName: 'Submitted', flex: 1, minWidth: 110, align: 'center', headerAlign: 'center' },
    { field: 'pending', headerName: 'Pending', flex: 1, minWidth: 100, align: 'center', headerAlign: 'center' },
    {
      field: 'completion_rate',
      headerName: 'Completion Rate',
      flex: 1,
      minWidth: 130,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => `${params.value.toFixed(1)}%`
    }
  ];

  // Auto-sizing columns for Department-wise Summary
  const departmentWiseColumns = [
    { field: 'departmentId', headerName: 'Department ID', flex: 1, minWidth: 120, align: 'center', headerAlign: 'center' },
    { field: 'department_name', headerName: 'Department Name', flex: 1.5, minWidth: 180 },
    { field: 'expert_count', headerName: 'Experts', flex: 0.8, minWidth: 90, align: 'center', headerAlign: 'center' },
    { field: 'assigned', headerName: 'Total Assigned', flex: 1, minWidth: 120, align: 'center', headerAlign: 'center' },
    { field: 'submitted', headerName: 'Submitted', flex: 1, minWidth: 110, align: 'center', headerAlign: 'center' },
    { field: 'pending', headerName: 'Pending', flex: 1, minWidth: 100, align: 'center', headerAlign: 'center' },
    {
      field: 'completion_rate',
      headerName: 'Completion Rate',
      flex: 1,
      minWidth: 130,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => `${params.value.toFixed(1)}%`
    }
  ];

  if (loading) {
    return (
      <StyledContainer>
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: '20px', mx: 'auto', maxWidth: 600 }}>
          <CircularProgress size={80} thickness={4} sx={{ mb: 3 }} />
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Loading Expert Analytics...
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Fetching latest expert assignment and submission data
          </Typography>
        </Paper>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: '16px', 
            fontSize: '1.1rem',
            py: 3,
            mx: 'auto',
            maxWidth: 800
          }}
          action={
            <IconButton onClick={fetchData} color="inherit">
              <RefreshIcon />
            </IconButton>
          }
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            Error Loading Data
          </Typography>
          {error}
        </Alert>
      </StyledContainer>
    );
  }

  if (!data || !data.departments) {
    return (
      <StyledContainer>
        <Alert severity="info" sx={{ borderRadius: '16px', textAlign: 'center', py: 4, mx: 'auto', maxWidth: 600 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            No Data Available
          </Typography>
          <Typography variant="body1">
            No expert data available for the selected stage.
          </Typography>
        </Alert>
      </StyledContainer>
    );
  }

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
                  Expert Analytics Dashboard
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
                  Comprehensive expert performance tracking and assignment analytics
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Stage and Department Filters */}
          <FilterCard>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: '8px', 
                  bgcolor: alpha(theme.palette.primary.main, 0.1) 
                }}>
                  <FilterIcon color="primary" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Analytics Filters
                </Typography>
              </Stack>
              
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Stage Selection
                    </Typography>
                    <ToggleButtonGroup
                      value={stage}
                      exclusive
                      onChange={(e, value) => value && setStage(value)}
                      aria-label="stage selection"
                      fullWidth
                    >
                      <ToggleButton value="stage_1" aria-label="stage 1">
                        <StageIcon sx={{ mr: 1 }} />
                        Stage 1
                      </ToggleButton>
                      <ToggleButton value="stage_3" aria-label="stage 3">
                        <StageIcon sx={{ mr: 1 }} />
                        Stage 3
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Stack>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Department Filter
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip
                        label="All Departments"
                        onClick={() => setSelectedSummaryDepartment('all')}
                        color={selectedSummaryDepartment === 'all' ? 'primary' : 'default'}
                        variant={selectedSummaryDepartment === 'all' ? 'filled' : 'outlined'}
                      />
                      {summaryData.map(dept => (
                        <Chip
                          key={dept.departmentId}
                          label={`Dept ${dept.departmentId}`}
                          onClick={() => setSelectedSummaryDepartment(dept.departmentId.toString())}
                          color={selectedSummaryDepartment === dept.departmentId.toString() ? 'secondary' : 'default'}
                          variant={selectedSummaryDepartment === dept.departmentId.toString() ? 'filled' : 'outlined'}
                        />
                      ))}
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </FilterCard>

          {/* Overall Metrics */}
          {overallMetrics && (
            <Grid container spacing={3} sx={{ mb: 5 }}>
              <Grid item xs={12} sm={6} md={2}>
                <EnhancedMetricCard
                  title="Total Experts"
                  value={overallMetrics.totalExperts}
                  icon={<ExpertIcon />}
                  color="#1976d2"
                  subtitle="Active experts assigned"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <EnhancedMetricCard
                  title="Departments"
                  value={overallMetrics.totalDepartments}
                  icon={<DepartmentIcon />}
                  color="#7b1fa2"
                  subtitle="Academic departments"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <EnhancedMetricCard
                  title="Total Assigned"
                  value={overallMetrics.totalAssigned}
                  icon={<AssignmentIcon />}
                  color="#2e7d32"
                  subtitle="Students assigned"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <EnhancedMetricCard
                  title="Submitted"
                  value={overallMetrics.totalSubmitted}
                  icon={<SubmittedIcon />}
                  color="#1565c0"
                  subtitle="Evaluations completed"
                  percentage={overallMetrics.completionRate}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <EnhancedMetricCard
                  title="Pending"
                  value={overallMetrics.totalPending}
                  icon={<PendingIcon />}
                  color="#ed6c02"
                  subtitle="Awaiting review"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <EnhancedMetricCard
                  title="Subjects"
                  value={overallMetrics.totalSubjects}
                  icon={<SubjectIcon />}
                  color="#d32f2f"
                  subtitle="Active subjects"
                />
              </Grid>
            </Grid>
          )}

          {/* Analytics Tabs */}
          <AnalyticsCard>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={(e, newValue) => setTabValue(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ px: 3, pt: 2 }}
              >
                <Tab 
                  icon={<Badge badgeContent={expertTotalsData.length} color="primary"><ExpertIcon /></Badge>} 
                  label="Expert Totals" 
                  iconPosition="start"
                />
                <Tab 
                  icon={<Badge badgeContent={assignedStudentsData.length} color="secondary"><AssignmentIcon /></Badge>} 
                  label="Assigned Students" 
                  iconPosition="start"
                />
                <Tab 
                  icon={<Badge badgeContent={subjectWiseData.length} color="success"><SubjectIcon /></Badge>} 
                  label="Subject Summary" 
                  iconPosition="start"
                />
                <Tab 
                  icon={<Badge badgeContent={departmentWiseData.length} color="warning"><DepartmentIcon /></Badge>} 
                  label="Department Summary" 
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            {/* Expert Totals Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ height: '70vh', width: '100%' }}>
                <StyledDataGrid
                  rows={expertTotalsData}
                  columns={expertTotalsColumns}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  pageSizeOptions={[10, 25, 50, 100]}
                  disableSelectionOnClick
                  slots={{
                    toolbar: () => (
                      <CustomToolbar 
                        title="Expert Performance Overview" 
                        count={expertTotalsData.length}
                        onRefresh={fetchData}
                      />
                    )
                  }}
                />
              </Box>
            </TabPanel>

            {/* Assigned Students Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ height: '70vh', width: '100%' }}>
                <StyledDataGrid
                  rows={assignedStudentsData}
                  columns={assignedStudentsColumns}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  pageSizeOptions={[10, 25, 50, 100]}
                  disableSelectionOnClick
                  slots={{
                    toolbar: () => (
                      <CustomToolbar 
                        title="Detailed Assignment Tracking" 
                        count={assignedStudentsData.length}
                        onRefresh={fetchData}
                      />
                    )
                  }}
                />
              </Box>
            </TabPanel>

            {/* Subject Summary Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    label="All Departments"
                    onClick={() => setSelectedSubjectDepartment('all')}
                    color={selectedSubjectDepartment === 'all' ? 'primary' : 'default'}
                    variant={selectedSubjectDepartment === 'all' ? 'filled' : 'outlined'}
                  />
                  {data.departments.map(dept => (
                    <Chip
                      key={dept.departmentId}
                      label={`Department ${dept.departmentId}`}
                      onClick={() => setSelectedSubjectDepartment(dept.departmentId.toString())}
                      color={selectedSubjectDepartment === dept.departmentId.toString() ? 'secondary' : 'default'}
                      variant={selectedSubjectDepartment === dept.departmentId.toString() ? 'filled' : 'outlined'}
                    />
                  ))}
                </Stack>
              </Box>
              <Box sx={{ height: '70vh', width: '100%' }}>
                <StyledDataGrid
                  rows={subjectWiseData}
                  columns={subjectWiseColumns}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  pageSizeOptions={[10, 25, 50, 100]}
                  disableSelectionOnClick
                  slots={{
                    toolbar: () => (
                      <CustomToolbar 
                        title="Subject-wise Performance Analysis" 
                        count={subjectWiseData.length}
                        onRefresh={fetchData}
                      />
                    )
                  }}
                />
              </Box>
            </TabPanel>

            {/* Department Summary Tab */}
            <TabPanel value={tabValue} index={3}>
              <Box sx={{ height: '70vh', width: '100%' }}>
                <StyledDataGrid
                  rows={departmentWiseData}
                  columns={departmentWiseColumns}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  pageSizeOptions={[5, 10, 25, 50]}
                  disableSelectionOnClick
                  slots={{
                    toolbar: () => (
                      <CustomToolbar 
                        title="Department Performance Overview" 
                        count={departmentWiseData.length}
                        onRefresh={fetchData}
                      />
                    )
                  }}
                />
              </Box>
            </TabPanel>
          </AnalyticsCard>
        </Box>
      </Fade>
    </StyledContainer>
  );
};

export default ExpertSummary;