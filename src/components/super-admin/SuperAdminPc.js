// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import SuperAdminNavbar from './SuperAdminNavbar';



// const SuperAdminPc = () => {
//     const [pcData, setPcData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3000/get-center-pcregistration-details');
//                 setPcData(response.data.results);
//                 setLoading(false);
//             } catch (err) {
//                 setError('Error fetching data. Please try again later.');
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     if (loading) return <div className="pcrc-loading">Loading...</div>;
//     if (error) return <div className="pcrc-error">{error}</div>;

//     return (
//         <>
//         <SuperAdminNavbar/>
        
//         <div className="pcrc-container">
//             <h2 className="pcrc-title">PC Registration Counttt</h2>
//             <div className="pcrc-table-container">
//                 <table className="pcrc-table">
//                     <thead>
//                         <tr>
//                             <th className="pcrc-th">Center</th>
//                             <th className="pcrc-th">Center Name</th>
//                             <th className="pcrc-th">Max PCs</th>
//                             <th className="pcrc-th">PC Count</th>
//                             <th className="pcrc-th">Registered PC Count</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {pcData.map((row, index) => (
//                             <tr key={index} className="pcrc-tr">
//                                 <td className="pcrc-td">{row.center}</td>
//                                 <td className="pcrc-td">{row.center_name}</td>
//                                 <td className="pcrc-td">{row.max_pc}</td>
//                                 <td className="pcrc-td">{row.pc_count}</td>
//                                 <td className="pcrc-td">{row.registered_pc_count}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//         </>
//     );
// };

// export default SuperAdminPc;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
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
  Fab,
  Paper,
  useTheme,
  alpha,
  Fade,
  Zoom,
  Stack,
  Divider,
  TextField,
  InputAdornment
} from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import {
  Computer as ComputerIcon,
  Business as CenterIcon,
  Assessment as AnalyticsIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Dashboard as DashboardIcon,
  DevicesOther as DevicesIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Speed as SpeedIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import CountUp from 'react-countup';
import SuperAdminNavbar from './SuperAdminNavbar';

// Enhanced styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}));

const AnalyticsCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
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

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  borderRadius: '0',
  backgroundColor: 'transparent',
  fontFamily: theme.typography.fontFamily,
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

const FloatingActionButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: 24,
  right: 24,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
  '&:hover': {
    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    transform: 'scale(1.1)',
    boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
  }
}));

const SearchCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
  marginBottom: theme.spacing(3),
}));

// Enhanced Metric Card Component
const EnhancedMetricCard = ({ title, value, icon, color, percentage, subtitle, trend, maxValue }) => {
  const theme = useTheme();
  const progressValue = maxValue ? (value / maxValue) * 100 : percentage || 0;
  
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
        {(percentage || maxValue) && (
          <Box sx={{ mt: 'auto', zIndex: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: '0.75rem', fontWeight: 600 }}
              >
                {maxValue ? 'Utilization' : 'Progress'}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontWeight: 700, 
                  color,
                  fontSize: '0.8rem'
                }}
              >
                {progressValue.toFixed(1)}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progressValue}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: `${color}20`,
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

// Custom Toolbar with enhanced search display
const CustomToolbar = ({ title, count, onRefresh, searchTerm }) => (
  <GridToolbarContainer sx={{ 
    p: 3, 
    justifyContent: 'space-between',
    borderBottom: '1px solid',
    borderColor: 'divider'
  }}>
    <Stack direction="row" alignItems="center" spacing={2}>
      <ComputerIcon color="primary" sx={{ fontSize: 32 }} />
      <Box>
        <Typography variant="h6" sx={{ 
          fontWeight: 700, 
          color: 'primary.main',
          fontSize: '1.2rem'
        }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          {count} centers {searchTerm ? `(filtered by "${searchTerm}")` : 'found'}
        </Typography>
      </Box>
    </Stack>
    <Stack direction="row" spacing={1}>
      <GridToolbarFilterButton sx={{ borderRadius: 2 }} />
      <GridToolbarExport sx={{ borderRadius: 2 }} />
      <Tooltip title="Refresh Data">
        <IconButton onClick={onRefresh} sx={{ borderRadius: 2 }}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  </GridToolbarContainer>
);

// Utilization Status Component - Fixed calculation
const UtilizationStatus = ({ registered, total }) => {
  // Ensure we're working with valid numbers
  const registeredCount = parseInt(registered) || 0;
  const totalCount = parseInt(total) || 0;
  
  // Calculate percentage - prevent division by zero and ensure valid calculation
  const percentage = totalCount > 0 ? Math.min((registeredCount / totalCount) * 100, 100) : 0;
  
  let color = 'success.main';
  let status = 'Optimal';
  let icon = <CheckCircleIcon fontSize="small" />;

  if (percentage < 50) {
    color = 'error.main';
    status = 'Low';
    icon = <WarningIcon fontSize="small" />;
  } else if (percentage < 80) {
    color = 'warning.main';
    status = 'Medium';
    icon = <InfoIcon fontSize="small" />;
  }

  return (
    <Tooltip title={`${percentage.toFixed(1)}% utilization - ${status} (${registeredCount}/${totalCount})`}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box sx={{ color }}>
          {icon}
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 600, color }}>
          {percentage.toFixed(1)}%
        </Typography>
      </Stack>
    </Tooltip>
  );
};

const SuperAdminPc = () => {
  const theme = useTheme();
  const [pcData, setPcData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/get-center-pcregistration-details');
      setPcData(response.data.results || []);
      setError(null);
    } catch (err) {
      setError('Error fetching data. Please try again later.');
      setPcData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 5 minutes
    const intervalId = setInterval(fetchData, 300000);
    return () => clearInterval(intervalId);
  }, []);

  // Filter data based on search term
  const filteredData = React.useMemo(() => {
    if (!searchTerm.trim()) return pcData;
    
    return pcData.filter((item) => {
      const centerMatch = item.center?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      const centerNameMatch = item.center_name?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      return centerMatch || centerNameMatch;
    });
  }, [pcData, searchTerm]);

  // Calculate analytics with improved data validation and search filtering
  const analytics = React.useMemo(() => {
    const dataToAnalyze = filteredData;
    
    if (!dataToAnalyze.length) return {
      totalCenters: 0,
      totalMaxPcs: 0,
      totalPcCount: 0,
      totalRegisteredPcs: 0,
      totalAvailablePcs: 0,
      avgUtilization: 0,
      lowUtilizationCenters: 0
    };

    const totalMaxPcs = dataToAnalyze.reduce((sum, item) => sum + (parseInt(item.max_pc) || 0), 0);
    const totalPcCount = dataToAnalyze.reduce((sum, item) => sum + (parseInt(item.pc_count) || 0), 0);
    const totalRegisteredPcs = dataToAnalyze.reduce((sum, item) => sum + (parseInt(item.registered_pc_count) || 0), 0);
    
    // Calculate total available PCs properly - sum of all individual available PCs
    const totalAvailablePcs = dataToAnalyze.reduce((sum, item) => {
      const pcCount = parseInt(item.pc_count) || 0;
      const registeredCount = parseInt(item.registered_pc_count) || 0;
      return sum + Math.max(pcCount - registeredCount, 0);
    }, 0);
    
    // Ensure utilization calculation is correct and capped at 100%
    const avgUtilization = totalPcCount > 0 ? Math.min((totalRegisteredPcs / totalPcCount) * 100, 100) : 0;
    
    const lowUtilizationCenters = dataToAnalyze.filter(item => {
      const pcCount = parseInt(item.pc_count) || 0;
      const registeredCount = parseInt(item.registered_pc_count) || 0;
      const utilization = pcCount > 0 ? Math.min((registeredCount / pcCount) * 100, 100) : 0;
      return utilization < 50;
    }).length;

    return {
      totalCenters: dataToAnalyze.length,
      totalMaxPcs,
      totalPcCount,
      totalRegisteredPcs,
      totalAvailablePcs,
      avgUtilization,
      lowUtilizationCenters
    };
  }, [filteredData]);

  // Process filtered data for DataGrid with proper validation
  const processedData = filteredData.map((item, index) => {
    const maxPc = parseInt(item.max_pc) || 0;
    const pcCount = parseInt(item.pc_count) || 0;
    const registeredCount = parseInt(item.registered_pc_count) || 0;
    
    // Calculate utilization properly - prevent over 100%
    const utilization = pcCount > 0 ? Math.min((registeredCount / pcCount) * 100, 100) : 0;
    
    // Calculate available PCs - ensure no negative values
    const availablePcs = Math.max(pcCount - registeredCount, 0);

    return {
      id: index,
      ...item,
      max_pc: maxPc,
      pc_count: pcCount,
      registered_pc_count: registeredCount,
      utilization,
      availablePcs
    };
  });

  // Clear search function
  const handleClearSearch = () => {
    setSearchTerm('');
    setPaginationModel({ page: 0, pageSize: 10 });
  };

  // DataGrid columns with enhanced styling
  const columns = [
    {
      field: 'center',
      headerName: 'Center ID',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="primary" 
          variant="outlined"
          sx={{ fontWeight: 600, fontSize: '0.85rem' }}
        />
      )
    },
    {
      field: 'center_name',
      headerName: 'Center Name',
      width: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <CenterIcon fontSize="small" color="action" />
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
            {params.value || 'N/A'}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'max_pc',
      headerName: 'Max PCs',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ 
          fontWeight: 700, 
          color: 'info.main',
          fontSize: '0.9rem'
        }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'pc_count',
      headerName: 'Total PCs',
      width: 130,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <DevicesIcon fontSize="small" color="primary" />
          <Typography variant="body2" sx={{ 
            fontWeight: 700, 
            color: 'primary.main',
            fontSize: '0.9rem'
          }}>
            {params.value}
          </Typography>
        </Stack>
      )
    },
    {
      field: 'registered_pc_count',
      headerName: 'Registered',
      width: 130,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <CheckCircleIcon fontSize="small" color="success" />
          <Chip 
            label={params.value} 
            size="small" 
            color="success"
            sx={{ fontWeight: 600, fontSize: '0.85rem' }}
          />
        </Stack>
      )
    },
    {
      field: 'availablePcs',
      headerName: 'Available',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color={params.value > 0 ? 'info' : 'default'}
          sx={{ fontWeight: 600, fontSize: '0.85rem' }}
        />
      )
    },
    {
      field: 'utilization',
      headerName: 'Utilization',
      width: 130,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <UtilizationStatus 
          registered={params.row.registered_pc_count} 
          total={params.row.pc_count} 
        />
      )
    }
  ];

  return (
    <div>
      <SuperAdminNavbar />
      <StyledContainer maxWidth="xl">
        <Fade in={true} timeout={800}>
          <Box>
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
                  <ComputerIcon sx={{ fontSize: '4rem', color: 'primary.main' }} />
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
                    PC Registration Analytics
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
                    Comprehensive PC utilization monitoring and center-wise registration analytics with real-time insights
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Search Section */}
            <SearchCard>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: '8px', 
                    bgcolor: alpha(theme.palette.primary.main, 0.1) 
                  }}>
                    <SearchIcon color="primary" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Search Centers
                  </Typography>
                </Stack>
                
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search by Center ID or Center Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end">
                        <Tooltip title="Clear search">
                          <IconButton
                            onClick={handleClearSearch}
                            edge="end"
                            size="small"
                          >
                            <ClearIcon />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(theme.palette.primary.main, 0.4),
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      }
                    }
                  }}
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontWeight: 500,
                    }
                  }}
                />
                
                {searchTerm && (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Showing results for:
                    </Typography>
                    <Chip 
                      label={`"${searchTerm}"`} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      onDelete={handleClearSearch}
                      sx={{ fontWeight: 500 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      ({filteredData.length} center{filteredData.length !== 1 ? 's' : ''} found)
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </SearchCard>

            {loading ? (
              <Paper sx={{ p: 8, textAlign: 'center', borderRadius: '20px' }}>
                <CircularProgress size={80} thickness={4} sx={{ mb: 3 }} />
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  Loading PC Analytics...
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Fetching latest PC registration data from all centers
                </Typography>
              </Paper>
            ) : error ? (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: '16px', 
                  fontSize: '1.1rem',
                  py: 3,
                  mb: 3
                }}
                action={
                  <IconButton onClick={fetchData} color="inherit">
                    <RefreshIcon />
                  </IconButton>
                }
              >
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Data Loading Error
                </Typography>
                {error}
              </Alert>
            ) : (
              <>
                {/* Analytics Cards with Max PCs Card Added - Now reflecting filtered data */}
                <Grid container spacing={3} sx={{ mb: 5 }}>
                  <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <EnhancedMetricCard
                      title="Total Centers"
                      value={analytics.totalCenters}
                      icon={<CenterIcon />}
                      color="#1976d2"
                      subtitle={searchTerm ? "Found in search" : "Active registration centers"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <EnhancedMetricCard
                      title="Max PCs Capacity"
                      value={analytics.totalMaxPcs}
                      icon={<DevicesIcon />}
                      color="#7b1fa2"
                      subtitle="Maximum theoretical capacity"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <EnhancedMetricCard
                      title="Total PCs Available"
                      value={analytics.totalPcCount}
                      icon={<ComputerIcon />}
                      color="#2e7d32"
                      subtitle={`${analytics.totalMaxPcs > 0 ? ((analytics.totalPcCount / analytics.totalMaxPcs) * 100).toFixed(1) : 0}% of max capacity`}
                      percentage={analytics.totalMaxPcs > 0 ? (analytics.totalPcCount / analytics.totalMaxPcs) * 100 : 0}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={2.4}>
                    <EnhancedMetricCard
                      title="Registered PCs"
                      value={analytics.totalRegisteredPcs}
                      icon={<CheckCircleIcon />}
                      color="#1565c0"
                      subtitle={`${analytics.avgUtilization.toFixed(1)}% utilization rate`}
                      percentage={analytics.avgUtilization}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={2.4}>
                    <EnhancedMetricCard
                      title="Available PCs"
                      value={analytics.totalAvailablePcs}
                      icon={<SpeedIcon />}
                      color="#ed6c02"
                      subtitle="Ready for registration"
                    />
                  </Grid>
                </Grid>

                {/* Main Data Table */}
                <Zoom in={true} timeout={800}>
                  <AnalyticsCard>
                    <Box sx={{ height: 700, width: '100%' }}>
                      <StyledDataGrid
                        rows={processedData}
                        columns={columns}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[5, 10, 25, 50]}
                        disableSelectionOnClick
                        slots={{
                          toolbar: () => (
                            <CustomToolbar 
                              title="PC Registration Overview" 
                              count={filteredData.length}
                              onRefresh={fetchData}
                              searchTerm={searchTerm}
                            />
                          )
                        }}
                        sx={{ 
                          '& .MuiDataGrid-cell': {
                            justifyContent: 'center'
                          }
                        }}
                      />
                    </Box>
                  </AnalyticsCard>
                </Zoom>

                {/* Search Results Status */}
                {searchTerm && filteredData.length === 0 && (
                  <Fade in={true} timeout={600}>
                    <Alert 
                      severity="info" 
                      sx={{ 
                        mt: 3, 
                        borderRadius: '16px',
                        fontSize: '1rem'
                      }}
                      icon={<SearchIcon fontSize="large" />}
                    >
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        No Results Found
                      </Typography>
                      <Typography variant="body1">
                        No centers found matching "{searchTerm}". Try searching with a different Center ID or Center Name.
                      </Typography>
                    </Alert>
                  </Fade>
                )}

                {/* Utilization Summary */}
                {analytics.lowUtilizationCenters > 0 && (
                  <Fade in={true} timeout={1200}>
                    <Alert 
                      severity="warning" 
                      sx={{ 
                        mt: 3, 
                        borderRadius: '16px',
                        fontSize: '1rem'
                      }}
                      icon={<WarningIcon fontSize="large" />}
                    >
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        Low Utilization Alert
                      </Typography>
                      <Typography variant="body1">
                        {analytics.lowUtilizationCenters} center(s) {searchTerm ? 'in search results ' : ''}have PC utilization below 50%. 
                        Consider optimizing PC allocation or increasing registration campaigns.
                      </Typography>
                    </Alert>
                  </Fade>
                )}
              </>
            )}

            {/* Floating Action Button */}
            <FloatingActionButton onClick={fetchData} disabled={loading}>
              <RefreshIcon sx={{ fontSize: 32 }} />
            </FloatingActionButton>
          </Box>
        </Fade>
      </StyledContainer>
    </div>
  );
};

export default SuperAdminPc;
