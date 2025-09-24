// DownloadApps.js
import React from 'react';
import './DownloadApps.css';
import NavBar from './../navBar/navBar';

const DownloadApps = () => {
    const handlePcRegistrationDownload = () => {
        // window.open('https://shorthandexam2024.s3.ap-south-1.amazonaws.com/gen/publish/setup.exe', '_blank');
        const fileUrl = "https://shorthandexam2024.s3.ap-south-1.amazonaws.com/Dec24/setup/GCC-SH-JUNE25-PC-REGISTRATION.exe";
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "pc_registration.exe"; // Optional: specify the downloaded file name
        link.click();
    
    };

    const handleExamAppDownload = () => {
        // window.open('https://shorthandexam2024.s3.ap-south-1.amazonaws.com/publish/setup.exe', '_blank');
        const fileUrl = "https://shorthandexam2024.s3.ap-south-1.amazonaws.com/Dec24/setup/GCC-SH-JUNE25-EXAM-CLIENT.exe";
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "software.exe"; // Optional: specify the downloaded file name
        link.click();


    };
    
    const handleRuskDeskDownload = () => {
        
        const fileUrl = "https://github.com/rustdesk/rustdesk/releases/download/1.3.5/rustdesk-1.3.5-x86_64.exe";
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "software.exe"; // Optional: specify the downloaded file name
        link.click();
        // window.open('https://github.com/rustdesk/rustdesk/releases/download/1.3.5/rustdesk-1.3.5-x86_64.exe', '_blank');
    };

    const handleIsmDownload = () => {
        const fileUrl = "https://drive.google.com/file/d/17KkbCZQZE_mvR51VBBXVVfYOoQmOtoii/view?usp=drive_link";
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "ISM_v6.2.zip"; // Optional: specify the downloaded file name
        link.click();
    };
    return (
       <>
      <NavBar/>
      
        <div className="da-container">
            <h1 className="da-title">Download Software</h1>
            <div className="da-button-container">
                <button className="da-button da-pc-reg" onClick={handlePcRegistrationDownload}>
                    Download PC Registration Software
                </button>
                <button className="da-button da-exam-app" onClick={handleExamAppDownload}>
                    Download Exam Software
                </button>
                <button className="da-button da-rusk-app" onClick={handleRuskDeskDownload}>
                    Download Rust Desk
                </button>
                <button className="da-button da-ism-app" onClick={handleIsmDownload}>
                    Download ISM v6.2
                </button>
                
            </div>
        </div>
        </>
    );
};

export default DownloadApps;


// import React from 'react';
// import {
//   Box,
//   Container,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Grid,
//   Paper,
//   Fade,
//   useTheme,
//   alpha,
//   createTheme,
//   ThemeProvider,
//   Avatar
// } from '@mui/material';
// import {
//   Computer as ComputerIcon,
//   School as SchoolIcon,
//   ScreenShare as ScreenShareIcon, // ← Changed to ScreenShareIcon (valid icon)
//   Storage as StorageIcon,
//   Download as DownloadIcon,
//   GetApp as GetAppIcon
// } from '@mui/icons-material';

// import NavBar from '../navBar/navBar';

// // Same light theme with softer colors
// const lightTheme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: {
//       main: '#90caf9', // Softer blue
//       light: '#bbdefb',
//       dark: '#64b5f6',
//       contrastText: '#1976d2',
//     },
//     secondary: {
//       main: '#ce93d8', // Softer purple
//       light: '#e1bee7',
//       dark: '#ba68c8',
//       contrastText: '#7b1fa2',
//     },
//     success: {
//       main: '#a5d6a7', // Softer green
//       light: '#c8e6c9',
//       dark: '#81c784',
//       contrastText: '#388e3c',
//     },
//     warning: {
//       main: '#ffcc02', // Softer orange/yellow
//       light: '#fff3c4',
//       dark: '#ffb300',
//       contrastText: '#f57c00',
//     },
//     info: {
//       main: '#81d4fa', // Softer cyan
//       light: '#b3e5fc',
//       dark: '#4fc3f7',
//       contrastText: '#0277bd',
//     },
//     error: {
//       main: '#ffab91', // Softer red
//       light: '#ffccbc',
//       dark: '#ff8a65',
//       contrastText: '#d84315',
//     },
//     background: {
//       default: '#f5f5f5',
//       paper: '#ffffff',
//     },
//     text: {
//       primary: '#212121',
//       secondary: '#757575',
//     }
//   },
//   shape: {
//     borderRadius: 12,
//   },
//   typography: {
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//     h3: {
//       fontWeight: 700,
//     },
//     h4: {
//       fontWeight: 600,
//     },
//     h5: {
//       fontWeight: 600,
//     },
//     h6: {
//       fontWeight: 500,
//     }
//   }
// });

// const SoftwareCard = ({ 
//   title, 
//   description,
//   icon: Icon, 
//   color, 
//   onClick,
//   version
// }) => {
//   const theme = useTheme();
  
//   return (
//     <Card
//       sx={{
//         height: '100%',
//         borderRadius: 3,
//         border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
//         background: alpha(theme.palette[color].main, 0.04),
//         transition: 'all 0.3s ease-in-out',
//         cursor: 'pointer',
//         '&:hover': {
//           transform: 'translateY(-4px)',
//           boxShadow: `0 8px 25px ${alpha(theme.palette[color].main, 0.2)}`,
//           borderColor: alpha(theme.palette[color].main, 0.4),
//         }
//       }}
//     >
//       <CardContent sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
//         <Avatar
//           sx={{
//             bgcolor: alpha(theme.palette[color].main, 0.15),
//             color: theme.palette[color].contrastText,
//             width: 64,
//             height: 64,
//             mx: 'auto',
//             mb: 3,
//           }}
//         >
//           <Icon sx={{ fontSize: 32 }} />
//         </Avatar>
        
//         <Typography 
//           variant="h5" 
//           sx={{ 
//             fontWeight: 600, 
//             mb: 2, 
//             color: 'text.primary',
//             flexGrow: 1,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center'
//           }}
//         >
//           {title}
//         </Typography>
        
//         {description && (
//           <Typography 
//             variant="body2" 
//             sx={{ 
//               color: 'text.secondary', 
//               mb: 3,
//               lineHeight: 1.6
//             }}
//           >
//             {description}
//           </Typography>
//         )}
        
//         {version && (
//           <Typography 
//             variant="caption" 
//             sx={{ 
//               color: theme.palette[color].contrastText,
//               backgroundColor: alpha(theme.palette[color].main, 0.1),
//               px: 2,
//               py: 0.5,
//               borderRadius: 2,
//               mb: 3,
//               display: 'inline-block'
//             }}
//           >
//             {version}
//           </Typography>
//         )}
        
//         <Button
//           variant="contained"
//           onClick={onClick}
//           startIcon={<GetAppIcon />}
//           sx={{
//             mt: 'auto',
//             backgroundColor: theme.palette[color].main,
//             color: theme.palette[color].contrastText,
//             fontWeight: 600,
//             borderRadius: 2,
//             py: 1.5,
//             textTransform: 'none',
//             '&:hover': {
//               backgroundColor: theme.palette[color].light,
//               transform: 'scale(1.02)',
//             }
//           }}
//         >
//           Download
//         </Button>
//       </CardContent>
//     </Card>
//   );
// };

// const DownloadApps = () => {
//   const theme = useTheme();

//   const handlePcRegistrationDownload = () => {
//     const fileUrl = "https://shorthandexam2024.s3.ap-south-1.amazonaws.com/Dec24/setup/GCC-SH-JUNE25-PC-REGISTRATION.exe";
//     const link = document.createElement("a");
//     link.href = fileUrl;
//     link.download = "pc_registration.exe";
//     link.click();
//   };

//   const handleExamAppDownload = () => {
//     const fileUrl = "https://shorthandexam2024.s3.ap-south-1.amazonaws.com/Dec24/setup/GCC-SH-JUNE25-EXAM-CLIENT.exe";
//     const link = document.createElement("a");
//     link.href = fileUrl;
//     link.download = "software.exe";
//     link.click();
//   };
  
//   const handleRuskDeskDownload = () => {
//     const fileUrl = "https://github.com/rustdesk/rustdesk/releases/download/1.3.5/rustdesk-1.3.5-x86_64.exe";
//     const link = document.createElement("a");
//     link.href = fileUrl;
//     link.download = "rustdesk.exe";
//     link.click();
//   };

//   const handleIsmDownload = () => {
//     const fileUrl = "https://drive.google.com/file/d/17KkbCZQZE_mvR51VBBXVVfYOoQmOtoii/view?usp=drive_link";
//     const link = document.createElement("a");
//     link.href = fileUrl;
//     link.download = "ISM_v6.2.zip";
//     link.click();
//   };

//   const softwareList = [
//     {
//       title: "PC Registration Software",
//       description: "Register and configure examination center computers for secure testing environment",
//       icon: ComputerIcon,
//       color: "primary",
//       onClick: handlePcRegistrationDownload,
//       version: "June 2025"
//     },
//     {
//       title: "Exam Software",
//       description: "Official examination client application for conducting secure online tests",
//       icon: SchoolIcon,
//       color: "success",
//       onClick: handleExamAppDownload,
//       version: "June 2025"
//     },
//     {
//       title: "RustDesk Remote Access",
//       description: "Secure remote desktop application for technical support and maintenance",
//       icon: ScreenShareIcon, // ← Changed to ScreenShareIcon (valid icon)
//       color: "info",
//       onClick: handleRuskDeskDownload,
//       version: "v1.3.5"
//     },
//     {
//       title: "ISM Management Tool",
//       description: "Integrated System Management tool for comprehensive center administration",
//       icon: StorageIcon,
//       color: "secondary",
//       onClick: handleIsmDownload,
//       version: "v6.2"
//     }
//   ];

//   return (
//     <ThemeProvider theme={lightTheme}>
//       <Box sx={{ 
//         flexGrow: 1, 
//         backgroundColor: 'background.default', 
//         minHeight: '100vh' 
//       }}>
//         <NavBar />
        
//         <Container maxWidth="xl" sx={{ py: 4 }}>
//           <Fade in timeout={800}>
//             <Box>
//               {/* Header Section - Centered */}
//               <Box 
//                 sx={{ 
//                   display: 'flex',
//                   flexDirection: 'column',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   textAlign: 'center',
//                   mb: 6
//                 }}
//               >
//                 <Typography 
//                   variant="h3" 
//                   sx={{ 
//                     fontWeight: 700, 
//                     color: 'text.primary',
//                     mb: 2,
//                     textAlign: 'center'
//                   }}
//                 >
//                   Download Software
//                 </Typography>
                

//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
//                   <DownloadIcon sx={{ color: 'primary.main' }} />
//                   <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
//                     Click on any software card to download instantly
//                   </Typography>
//                 </Box>
//               </Box>

//               {/* Software Cards Grid */}
//               <Paper sx={{ 
//                 p: 4, 
//                 borderRadius: 3, 
//                 boxShadow: 1,
//                 border: `1px solid ${theme.palette.grey[200]}`
//               }}>
//                 <Box sx={{ textAlign: 'center', mb: 4 }}>
        
//                   <Typography 
//                     variant="body1" 
//                     sx={{ 
//                       color: 'text.secondary', 
//                       maxWidth: '600px', 
//                       mx: 'auto',
//                       fontSize: '1.1rem',
//                       lineHeight: 1.6
//                     }}
//                   >
//                     Professional tools for examination center administration and operations
//                   </Typography>
//                 </Box>
                
//                 <Grid container spacing={4}justifyContent={"center"}>
//                   {softwareList.map((software, index) => (
//                     <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
//                       <SoftwareCard
//                         title={software.title}
//                         description={software.description}
//                         icon={software.icon}
//                         color={software.color}
//                         onClick={software.onClick}
//                         version={software.version}
//                       />
//                     </Grid>
//                   ))}
//                 </Grid>
//               </Paper>

              
//             </Box>
//           </Fade>
//         </Container>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default DownloadApps;
