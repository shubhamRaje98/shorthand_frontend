// // // // src/components/super-admin/AddController.js
// // // import React, { useState } from 'react';
// // // import axios from 'axios';
// // // import './AddController.css';

// // // const AddController = () => {
// // //   const [loading, setLoading] = useState(false);
// // //   const [controllers, setControllers] = useState([]);
// // //   const [message, setMessage] = useState('');
// // //   const [messageType, setMessageType] = useState(''); // 'success' or 'error'
// // //   const [showTable, setShowTable] = useState(false);
// // //   const [isApproving, setIsApproving] = useState(false);

// // //   // Generate controllers (preview only)
// // //   const handleGenerateControllers = async () => {
// // //     setLoading(true);
// // //     setMessage('');
// // //     setMessageType('');
// // //     setShowTable(false);
    
// // //     try {
// // //       const response = await axios.post('https://www.shorthandonlineexam.in/api/new-department/generate-controllers');
      
// // //       if (response.data.success) {
// // //         setControllers(response.data.data);
// // //         setShowTable(true);
// // //         setMessage(`Generated ${response.data.count} controller records. Review and click "Approve" to save.`);
// // //         setMessageType('info');
// // //       }
// // //     } catch (error) {
// // //       setMessage(`Error: ${error.response?.data?.message || error.message}`);
// // //       setMessageType('error');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // Approve and save controllers to database
// // //   const handleApproveControllers = async () => {
// // //     setIsApproving(true);
// // //     setMessage('');
// // //     setMessageType('');
    
// // //     try {
// // //       const response = await axios.post('https://www.shorthandonlineexam.in/api/new-department/generate-save-controllers');
      
// // //       if (response.data.success) {
// // //         setMessage(`✅ Successfully saved ${response.data.count} controllers to database!`);
// // //         setMessageType('success');
// // //         setShowTable(false);
// // //         setControllers([]);
// // //       }
// // //     } catch (error) {
// // //       setMessage(`Error: ${error.response?.data?.message || error.message}`);
// // //       setMessageType('error');
// // //     } finally {
// // //       setIsApproving(false);
// // //     }
// // //   };

// // //   // Cancel and clear the table
// // //   const handleCancel = () => {
// // //     setControllers([]);
// // //     setShowTable(false);
// // //     setMessage('');
// // //     setMessageType('');
// // //   };

// // //   return (
// // //     <div className="add-controller-container">
// // //       <div className="add-controller-header">
// // //         <h2>Add Controller</h2>
// // //         <p className="subtitle">Generate controller accounts for department-batch-center combinations</p>
// // //       </div>

// // //       {/* Action Buttons */}
// // //       <div className="button-group">
// // //         <button 
// // //           onClick={handleGenerateControllers} 
// // //           disabled={loading || showTable}
// // //           className="btn btn-generate"
// // //         >
// // //           {loading ? (
// // //             <>
// // //               <span className="spinner"></span>
// // //               Generating...
// // //             </>
// // //           ) : (
// // //             'Generate Controllers'
// // //           )}
// // //         </button>

// // //         {showTable && (
// // //           <>
// // //             <button 
// // //               onClick={handleApproveControllers} 
// // //               disabled={isApproving}
// // //               className="btn btn-approve"
// // //             >
// // //               {isApproving ? (
// // //                 <>
// // //                   <span className="spinner"></span>
// // //                   Approving...
// // //                 </>
// // //               ) : (
// // //                 '✓ Approve & Save to Database'
// // //               )}
// // //             </button>

// // //             <button 
// // //               onClick={handleCancel} 
// // //               disabled={isApproving}
// // //               className="btn btn-cancel"
// // //             >
// // //               Cancel
// // //             </button>
// // //           </>
// // //         )}
// // //       </div>

// // //       {/* Message Display */}
// // //       {message && (
// // //         <div className={`message message-${messageType}`}>
// // //           {message}
// // //         </div>
// // //       )}

// // //       {/* Controllers Table */}
// // //       {showTable && controllers.length > 0 && (
// // //         <div className="table-container">
// // //           <h3>Preview: {controllers.length} Controller Records</h3>
// // //           <div className="table-wrapper">
// // //             <table className="controllers-table">
// // //               <thead>
// // //                 <tr>
// // //                   <th>Sr. No.</th>
// // //                   <th>Department ID</th>
// // //                   <th>Batch No</th>
// // //                   <th>Center</th>
// // //                   <th>Controller Code</th>
// // //                   <th>Controller Contact</th>
// // //                   <th>Controller Email</th>
// // //                   <th>Controller Name</th>
// // //                   <th>Controller Password</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {controllers.map((ctrl, index) => (
// // //                   <tr key={index}>
// // //                     <td>{index + 1}</td>
// // //                     <td>{ctrl.departmentId}</td>
// // //                     <td>{ctrl.batchNo}</td>
// // //                     <td>{ctrl.center}</td>
// // //                     <td className="empty-field">{ctrl.controller_code || '—'}</td>
// // //                     <td className="empty-field">{ctrl.controller_contact || '—'}</td>
// // //                     <td className="empty-field">{ctrl.controller_email || '—'}</td>
// // //                     <td className="empty-field">{ctrl.controller_name || '—'}</td>
// // //                     <td className="password-field">{ctrl.controller_pass}</td>
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //           </div>
          
// // //           <div className="table-footer">
// // //             <p className="footer-note">
// // //               <strong>Note:</strong> Empty fields (—) will be stored as empty strings in the database.
// // //               Passwords are auto-generated based on batch number and center.
// // //             </p>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default AddController;


// // // src/components/super-admin/AddController.js
// // import React, { useState, useMemo } from 'react';
// // import axios from 'axios';
// // import { 
// //   Sparkles, 
// //   CheckCircle, 
// //   XCircle, 
// //   Loader2, 
// //   AlertCircle,
// //   Database,
// //   Eye,
// //   FileText,
// //   Search,
// //   ListFilter,
// //   X
// // } from 'lucide-react';
// // import './AddController.css';

// // const AddController = () => {
// //   const [loading, setLoading] = useState(false);
// //   const [controllers, setControllers] = useState([]);
// //   const [message, setMessage] = useState('');
// //   const [messageType, setMessageType] = useState('');
// //   const [showTable, setShowTable] = useState(false);
// //   const [isApproving, setIsApproving] = useState(false);
  
// //   // Search and Filter States
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [filterDepartment, setFilterDepartment] = useState('all');
// //   const [filterBatch, setFilterBatch] = useState('all');
// //   const [filterCenter, setFilterCenter] = useState('all');

// //   // Get unique values for filters
// //   const uniqueDepartments = useMemo(() => {
// //     return ['all', ...new Set(controllers.map(ctrl => ctrl.departmentId))];
// //   }, [controllers]);

// //   const uniqueBatches = useMemo(() => {
// //     return ['all', ...new Set(controllers.map(ctrl => ctrl.batchNo))];
// //   }, [controllers]);

// //   const uniqueCenters = useMemo(() => {
// //     return ['all', ...new Set(controllers.map(ctrl => ctrl.center))];
// //   }, [controllers]);

// //   // FIXED: Filtered and searched controllers with null-safe operations
// //   const filteredControllers = useMemo(() => {
// //     return controllers.filter(ctrl => {
// //       // Helper function to safely convert to lowercase string
// //       const safeToLower = (value) => {
// //         if (value === null || value === undefined) return '';
// //         return String(value).toLowerCase();
// //       };

// //       const searchLower = searchTerm.toLowerCase();

// //       // Apply search filter with null-safe string operations
// //       const matchesSearch = searchTerm === '' || 
// //         safeToLower(ctrl.departmentId).includes(searchLower) ||
// //         safeToLower(ctrl.batchNo).includes(searchLower) ||
// //         safeToLower(ctrl.center).includes(searchLower) ||
// //         safeToLower(ctrl.controller_code).includes(searchLower) ||
// //         safeToLower(ctrl.controller_email).includes(searchLower) ||
// //         safeToLower(ctrl.controller_name).includes(searchLower) ||
// //         safeToLower(ctrl.controller_contact).includes(searchLower);

// //       // Apply dropdown filters - convert to string for comparison
// //       const matchesDepartment = filterDepartment === 'all' || 
// //         String(ctrl.departmentId) === String(filterDepartment);
// //       const matchesBatch = filterBatch === 'all' || 
// //         String(ctrl.batchNo) === String(filterBatch);
// //       const matchesCenter = filterCenter === 'all' || 
// //         String(ctrl.center) === String(filterCenter);

// //       return matchesSearch && matchesDepartment && matchesBatch && matchesCenter;
// //     });
// //   }, [controllers, searchTerm, filterDepartment, filterBatch, filterCenter]);

// //   // Clear all filters
// //   const clearFilters = () => {
// //     setSearchTerm('');
// //     setFilterDepartment('all');
// //     setFilterBatch('all');
// //     setFilterCenter('all');
// //   };

// //   // Check if any filter is active
// //   const hasActiveFilters = searchTerm !== '' || filterDepartment !== 'all' || 
// //                           filterBatch !== 'all' || filterCenter !== 'all';

// //   const handleGenerateControllers = async () => {
// //     setLoading(true);
// //     setMessage('');
// //     setMessageType('');
// //     setShowTable(false);
// //     clearFilters();
    
// //     try {
// //       const response = await axios.post('https://www.shorthandonlineexam.in/api/new-department/generate-controllers');
      
// //       if (response.data.success) {
// //         setControllers(response.data.data);
// //         setShowTable(true);
// //         setMessage(`Generated ${response.data.count} controller records. Review and click "Approve" to save.`);
// //         setMessageType('info');
// //       }
// //     } catch (error) {
// //       setMessage(`Error: ${error.response?.data?.message || error.message}`);
// //       setMessageType('error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleApproveControllers = async () => {
// //     setIsApproving(true);
// //     setMessage('');
// //     setMessageType('');
    
// //     try {
// //       const response = await axios.post('https://www.shorthandonlineexam.in/api/new-department/generate-save-controllers');
      
// //       if (response.data.success) {
// //         setMessage(`Successfully saved ${response.data.count} controllers to database!`);
// //         setMessageType('success');
// //         setShowTable(false);
// //         setControllers([]);
// //         clearFilters();
// //       }
// //     } catch (error) {
// //       setMessage(`Error: ${error.response?.data?.message || error.message}`);
// //       setMessageType('error');
// //     } finally {
// //       setIsApproving(false);
// //     }
// //   };

// //   const handleCancel = () => {
// //     setControllers([]);
// //     setShowTable(false);
// //     setMessage('');
// //     setMessageType('');
// //     clearFilters();
// //   };

// //   return (
// //     <div className="container-fluid py-4">
// //       <div className="row justify-content-center">
// //         <div className="col-12 col-xl-11">
// //           {/* Header Card */}
// //           <div className="card border-0 shadow-sm mb-4">
// //             <div className="card-body p-4">
// //               <div className="d-flex align-items-center mb-2">
// //                 <div className="icon-wrapper me-3">
// //                   <Database size={32} className="text-primary" />
// //                 </div>
// //                 <div>
// //                   <h2 className="mb-1 fw-bold">Controller Management</h2>
// //                   <p className="text-muted mb-0">
// //                     Generate controller accounts for department-batch-center combinations
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Action Buttons Card */}
// //           <div className="card border-0 shadow-sm mb-4">
// //             <div className="card-body p-4">
// //               <div className="d-flex flex-wrap gap-3">
// //                 <button 
// //                   onClick={handleGenerateControllers} 
// //                   disabled={loading || showTable}
// //                   className="btn btn-primary btn-lg d-flex align-items-center px-4"
// //                 >
// //                   {loading ? (
// //                     <>
// //                       <Loader2 size={20} className="me-2 spinner-icon" />
// //                       Generating...
// //                     </>
// //                   ) : (
// //                     <>
// //                       <Sparkles size={20} className="me-2" />
// //                       Generate Controllers
// //                     </>
// //                   )}
// //                 </button>

// //                 {showTable && (
// //                   <>
// //                     <button 
// //                       onClick={handleApproveControllers} 
// //                       disabled={isApproving}
// //                       className="btn btn-success btn-lg d-flex align-items-center px-4"
// //                     >
// //                       {isApproving ? (
// //                         <>
// //                           <Loader2 size={20} className="me-2 spinner-icon" />
// //                           Approving...
// //                         </>
// //                       ) : (
// //                         <>
// //                           <CheckCircle size={20} className="me-2" />
// //                           Approve & Save
// //                         </>
// //                       )}
// //                     </button>

// //                     <button 
// //                       onClick={handleCancel} 
// //                       disabled={isApproving}
// //                       className="btn btn-outline-danger btn-lg d-flex align-items-center px-4"
// //                     >
// //                       <XCircle size={20} className="me-2" />
// //                       Cancel
// //                     </button>
// //                   </>
// //                 )}
// //               </div>
// //             </div>
// //           </div>

// //           {/* Message Alert */}
// //           {message && (
// //             <div className={`alert alert-${messageType === 'success' ? 'success' : messageType === 'error' ? 'danger' : 'info'} alert-dismissible fade show shadow-sm`} role="alert">
// //               <div className="d-flex align-items-start">
// //                 {messageType === 'success' && <CheckCircle size={20} className="me-2 mt-1 flex-shrink-0" />}
// //                 {messageType === 'error' && <XCircle size={20} className="me-2 mt-1 flex-shrink-0" />}
// //                 {messageType === 'info' && <AlertCircle size={20} className="me-2 mt-1 flex-shrink-0" />}
// //                 <div className="flex-grow-1">{message}</div>
// //               </div>
// //               <button type="button" className="btn-close" onClick={() => setMessage('')} aria-label="Close"></button>
// //             </div>
// //           )}

// //           {/* Search and Filter Card */}
// //           {showTable && controllers.length > 0 && (
// //             <div className="card border-0 shadow-sm mb-4">
// //               <div className="card-body p-4">
// //                 <div className="d-flex align-items-center mb-3">
// //                   <ListFilter size={24} className="text-primary me-2" />
// //                   <h5 className="mb-0 fw-semibold">Search & Filter</h5>
// //                   {hasActiveFilters && (
// //                     <button 
// //                       onClick={clearFilters}
// //                       className="btn btn-sm btn-outline-secondary ms-auto d-flex align-items-center"
// //                     >
// //                       <X size={16} className="me-1" />
// //                       Clear All
// //                     </button>
// //                   )}
// //                 </div>

// //                 <div className="row g-3">
// //                   {/* Search Input */}
// //                   <div className="col-12 col-md-6 col-lg-3">
// //                     <div className="input-group">
// //                       <span className="input-group-text bg-light border-end-0">
// //                         <Search size={18} className="text-muted" />
// //                       </span>
// //                       <input
// //                         type="text"
// //                         className="form-control border-start-0 ps-0"
// //                         placeholder="Search controllers..."
// //                         value={searchTerm}
// //                         onChange={(e) => setSearchTerm(e.target.value)}
// //                       />
// //                       {searchTerm && (
// //                         <button 
// //                           className="btn btn-outline-secondary border-start-0"
// //                           onClick={() => setSearchTerm('')}
// //                         >
// //                           <X size={16} />
// //                         </button>
// //                       )}
// //                     </div>
// //                   </div>

// //                   {/* Department Filter */}
// //                   <div className="col-12 col-md-6 col-lg-3">
// //                     <select 
// //                       className="form-select"
// //                       value={filterDepartment}
// //                       onChange={(e) => setFilterDepartment(e.target.value)}
// //                     >
// //                       <option value="all">All Departments</option>
// //                       {uniqueDepartments.slice(1).map(dept => (
// //                         <option key={dept} value={dept}>Department {dept}</option>
// //                       ))}
// //                     </select>
// //                   </div>

// //                   {/* Batch Filter */}
// //                   <div className="col-12 col-md-6 col-lg-3">
// //                     <select 
// //                       className="form-select"
// //                       value={filterBatch}
// //                       onChange={(e) => setFilterBatch(e.target.value)}
// //                     >
// //                       <option value="all">All Batches</option>
// //                       {uniqueBatches.slice(1).map(batch => (
// //                         <option key={batch} value={batch}>Batch {batch}</option>
// //                       ))}
// //                     </select>
// //                   </div>

// //                   {/* Center Filter */}
// //                   <div className="col-12 col-md-6 col-lg-3">
// //                     <select 
// //                       className="form-select"
// //                       value={filterCenter}
// //                       onChange={(e) => setFilterCenter(e.target.value)}
// //                     >
// //                       <option value="all">All Centers</option>
// //                       {uniqueCenters.slice(1).map(center => (
// //                         <option key={center} value={center}>{center}</option>
// //                       ))}
// //                     </select>
// //                   </div>
// //                 </div>

// //                 {/* Results Count */}
// //                 <div className="mt-3">
// //                   <small className="text-muted">
// //                     Showing <strong>{filteredControllers.length}</strong> of <strong>{controllers.length}</strong> controllers
// //                     {hasActiveFilters && (
// //                       <span className="ms-2 badge bg-primary">{filteredControllers.length} filtered</span>
// //                     )}
// //                   </small>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* Controllers Table */}
// //           {showTable && controllers.length > 0 && (
// //             <div className="card border-0 shadow-sm">
// //               <div className="card-header bg-white border-bottom py-3">
// //                 <div className="d-flex align-items-center justify-content-between">
// //                   <div className="d-flex align-items-center">
// //                     <Eye size={24} className="text-primary me-2" />
// //                     <h4 className="mb-0 fw-semibold">Preview Controller Records</h4>
// //                   </div>
// //                   <span className="badge bg-primary rounded-pill px-3 py-2">
// //                     {filteredControllers.length} Records
// //                   </span>
// //                 </div>
// //               </div>
              
// //               <div className="card-body p-0">
// //                 {filteredControllers.length > 0 ? (
// //                   <div className="table-responsive">
// //                     <table className="table table-hover table-striped mb-0">
// //                       <thead className="table-dark">
// //                         <tr>
// //                           <th className="text-center" style={{width: '80px'}}>Sr. No.</th>
// //                           <th>Department ID</th>
// //                           <th>Batch No</th>
// //                           <th>Center</th>
// //                           <th>Controller Code</th>
// //                           <th>Contact</th>
// //                           <th>Email</th>
// //                           <th>Name</th>
// //                           <th>Password</th>
// //                         </tr>
// //                       </thead>
// //                       <tbody>
// //                         {filteredControllers.map((ctrl, index) => (
// //                           <tr key={index}>
// //                             <td className="text-center fw-semibold">{index + 1}</td>
// //                             <td>
// //                               <span className="badge bg-secondary">{ctrl.departmentId}</span>
// //                             </td>
// //                             <td>
// //                               <span className="badge bg-info text-dark">{ctrl.batchNo}</span>
// //                             </td>
// //                             <td className="fw-medium">{ctrl.center}</td>
// //                             <td className="text-muted fst-italic">
// //                               {ctrl.controller_code || '—'}
// //                             </td>
// //                             <td className="text-muted fst-italic">
// //                               {ctrl.controller_contact || '—'}
// //                             </td>
// //                             <td className="text-muted fst-italic">
// //                               {ctrl.controller_email || '—'}
// //                             </td>
// //                             <td className="text-muted fst-italic">
// //                               {ctrl.controller_name || '—'}
// //                             </td>
// //                             <td>
// //                               <code className="text-danger fw-semibold">{ctrl.controller_pass}</code>
// //                             </td>
// //                           </tr>
// //                         ))}
// //                       </tbody>
// //                     </table>
// //                   </div>
// //                 ) : (
// //                   <div className="text-center py-5">
// //                     <Search size={48} className="text-muted mb-3" />
// //                     <h5 className="text-muted">No controllers found</h5>
// //                     <p className="text-muted mb-0">Try adjusting your search or filter criteria</p>
// //                   </div>
// //                 )}
// //               </div>
              
// //               <div className="card-footer bg-light border-top">
// //                 <div className="d-flex align-items-start">
// //                   <FileText size={20} className="text-primary me-2 mt-1 flex-shrink-0" />
// //                   <div>
// //                     <p className="mb-1 fw-semibold text-dark">Important Note:</p>
// //                     <p className="mb-0 text-muted small">
// //                       Empty fields (—) will be stored as empty strings in the database. 
// //                       Passwords are auto-generated based on batch number and center.
// //                     </p>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AddController;


// src/components/super-admin/AddController.js
import React, { useState, useMemo } from 'react';
import { Card, Container, Row, Col, Button, Form, Alert, Spinner, Modal } from 'react-bootstrap';
import { FaDatabase, FaCheckCircle, FaTimes, FaExclamationTriangle, FaEye, FaFileAlt, FaSearch, FaFilter, FaMagic } from 'react-icons/fa';
import axios from 'axios';

function AddController() {
  const [loading, setLoading] = useState(false);
  const [controllers, setControllers] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterBatch, setFilterBatch] = useState('all');
  const [filterCenter, setFilterCenter] = useState('all');

  // Get unique values for filters
  const uniqueDepartments = useMemo(() => {
    return ['all', ...new Set(controllers.map(ctrl => ctrl.departmentId))];
  }, [controllers]);

  const uniqueBatches = useMemo(() => {
    return ['all', ...new Set(controllers.map(ctrl => ctrl.batchNo))];
  }, [controllers]);

  const uniqueCenters = useMemo(() => {
    return ['all', ...new Set(controllers.map(ctrl => ctrl.center))];
  }, [controllers]);

  // Filtered and searched controllers
  const filteredControllers = useMemo(() => {
    return controllers.filter(ctrl => {
      const safeToLower = (value) => {
        if (value === null || value === undefined) return '';
        return String(value).toLowerCase();
      };

      const searchLower = searchTerm.toLowerCase();

      const matchesSearch = searchTerm === '' || 
        safeToLower(ctrl.departmentId).includes(searchLower) ||
        safeToLower(ctrl.batchNo).includes(searchLower) ||
        safeToLower(ctrl.center).includes(searchLower) ||
        safeToLower(ctrl.controller_code).includes(searchLower) ||
        safeToLower(ctrl.controller_email).includes(searchLower) ||
        safeToLower(ctrl.controller_name).includes(searchLower) ||
        safeToLower(ctrl.controller_contact).includes(searchLower);

      const matchesDepartment = filterDepartment === 'all' || 
        String(ctrl.departmentId) === String(filterDepartment);
      const matchesBatch = filterBatch === 'all' || 
        String(ctrl.batchNo) === String(filterBatch);
      const matchesCenter = filterCenter === 'all' || 
        String(ctrl.center) === String(filterCenter);

      return matchesSearch && matchesDepartment && matchesBatch && matchesCenter;
    });
  }, [controllers, searchTerm, filterDepartment, filterBatch, filterCenter]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterDepartment('all');
    setFilterBatch('all');
    setFilterCenter('all');
  };

  // Check if any filter is active
  const hasActiveFilters = searchTerm !== '' || filterDepartment !== 'all' || 
                          filterBatch !== 'all' || filterCenter !== 'all';

  const handleGenerateControllers = async () => {
    setLoading(true);
    setMessage('');
    setMessageType('');
    setShowTable(false);
    clearFilters();
    
    try {
      const response = await axios.post('https://www.shorthandonlineexam.in/api/new-department/generate-controllers');
      
      if (response.data.success) {
        setControllers(response.data.data);
        setShowTable(true);
        setMessage(`Generated ${response.data.count} controller records. Review and click "Approve" to save.`);
        setMessageType('info');
      }
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveControllers = async () => {
    setIsApproving(true);
    setMessage('');
    setMessageType('');
    
    try {
      const response = await axios.post('https://www.shorthandonlineexam.in/api/new-department/generate-save-controllers');
      
      if (response.data.success) {
        setMessage(`Successfully saved ${response.data.count} controllers to database!`);
        setMessageType('success');
        setShowTable(false);
        setControllers([]);
        clearFilters();
      }
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
      setMessageType('error');
    } finally {
      setIsApproving(false);
    }
  };

  const handleCancel = () => {
    setControllers([]);
    setShowTable(false);
    setMessage('');
    setMessageType('');
    clearFilters();
  };

  if (loading) {
    return (
      <Container fluid className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status" className="me-2" />
          <span>Generating controllers...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <h2 className="mb-4 text-center">Controller Management</h2>

      <Row className="justify-content-center">
        <Col md={10}>
          {/* Main Card */}
          <Card className="text-center">
            <Card.Header>
              <h4 className="mb-0">
                <FaDatabase className="me-2" />
                Generate Controller Accounts
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              <p className="text-muted mb-4">
                Generate controller accounts for department-batch-center combinations
              </p>

              {/* Message Alert */}
              {message && (
                <Alert 
                  variant={messageType === 'success' ? 'success' : messageType === 'error' ? 'danger' : 'info'} 
                  dismissible 
                  onClose={() => setMessage('')}
                  className="mb-4"
                >
                  <div className="d-flex align-items-start">
                    {messageType === 'success' && <FaCheckCircle className="me-2 mt-1" />}
                    {messageType === 'error' && <FaTimes className="me-2 mt-1" />}
                    {messageType === 'info' && <FaExclamationTriangle className="me-2 mt-1" />}
                    <div>{message}</div>
                  </div>
                </Alert>
              )}

              {/* Action Buttons */}
              <Row className="g-4 mb-4">
                <Col md={12}>
                  <Card className="shadow-sm">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">
                        <FaMagic className="me-2" />
                        Actions
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={handleGenerateControllers}
                          disabled={loading || showTable}
                          className="px-4 py-3"
                        >
                          {loading ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <FaMagic className="me-2" />
                              Generate Controllers
                            </>
                          )}
                        </Button>

                        {showTable && (
                          <>
                            <Button
                              variant="success"
                              size="lg"
                              onClick={handleApproveControllers}
                              disabled={isApproving}
                              className="px-4 py-3"
                            >
                              {isApproving ? (
                                <>
                                  <Spinner animation="border" size="sm" className="me-2" />
                                  Approving...
                                </>
                              ) : (
                                <>
                                  <FaCheckCircle className="me-2" />
                                  Approve & Save
                                </>
                              )}
                            </Button>

                            <Button
                              variant="danger"
                              size="lg"
                              onClick={handleCancel}
                              disabled={isApproving}
                              className="px-4 py-3"
                            >
                              <FaTimes className="me-2" />
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Search and Filter Section */}
              {showTable && controllers.length > 0 && (
                <Row className="g-4 mb-4">
                  <Col md={12}>
                    <Card className="shadow-sm">
                      <Card.Header className="bg-light">
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="mb-0">
                            <FaFilter className="me-2" />
                            Search & Filter
                          </h5>
                          {hasActiveFilters && (
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={clearFilters}
                            >
                              <FaTimes className="me-1" />
                              Clear All
                            </Button>
                          )}
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-3">
                          {/* Search Input */}
                          <Col md={6} lg={3}>
                            <Form.Group>
                              <Form.Label>
                                <FaSearch className="me-1" />
                                Search
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Search controllers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                            </Form.Group>
                          </Col>

                          {/* Department Filter */}
                          <Col md={6} lg={3}>
                            <Form.Group>
                              <Form.Label>Department</Form.Label>
                              <Form.Select
                                value={filterDepartment}
                                onChange={(e) => setFilterDepartment(e.target.value)}
                              >
                                <option value="all">All Departments</option>
                                {uniqueDepartments.slice(1).map(dept => (
                                  <option key={dept} value={dept}>Department {dept}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Col>

                          {/* Batch Filter */}
                          <Col md={6} lg={3}>
                            <Form.Group>
                              <Form.Label>Batch</Form.Label>
                              <Form.Select
                                value={filterBatch}
                                onChange={(e) => setFilterBatch(e.target.value)}
                              >
                                <option value="all">All Batches</option>
                                {uniqueBatches.slice(1).map(batch => (
                                  <option key={batch} value={batch}>Batch {batch}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Col>

                          {/* Center Filter */}
                          <Col md={6} lg={3}>
                            <Form.Group>
                              <Form.Label>Center</Form.Label>
                              <Form.Select
                                value={filterCenter}
                                onChange={(e) => setFilterCenter(e.target.value)}
                              >
                                <option value="all">All Centers</option>
                                {uniqueCenters.slice(1).map(center => (
                                  <option key={center} value={center}>{center}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Text className="text-muted mt-2">
                          Showing <strong>{filteredControllers.length}</strong> of <strong>{controllers.length}</strong> controllers
                          {hasActiveFilters && (
                            <span className="ms-2 badge bg-primary">{filteredControllers.length} filtered</span>
                          )}
                        </Form.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}

              {/* Controllers Table */}
              {showTable && controllers.length > 0 && (
                <Row className="g-4">
                  <Col md={12}>
                    <Card className="shadow-sm border-success">
                      <Card.Header className="bg-light">
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="mb-0 text-success">
                            <FaEye className="me-2" />
                            Preview Controller Records
                          </h5>
                          <span className="badge bg-success rounded-pill px-3 py-2">
                            {filteredControllers.length} Records
                          </span>
                        </div>
                      </Card.Header>
                      <Card.Body className="p-0">
                        {filteredControllers.length > 0 ? (
                          <div className="table-responsive">
                            <table className="table table-hover table-striped mb-0">
                              <thead className="table-dark">
                                <tr>
                                  <th className="text-center" style={{width: '80px', color: 'black'}}>Sr. No.</th>
                                  <th className="text-center" style={{width: '80px', color: 'black'}}>Department ID</th>
                                  <th className="text-center" style={{width: '80px', color: 'black'}}>Batch No</th>
                                  <th className="text-center" style={{width: '80px', color: 'black'}}>Center</th>
                                  <th className="text-center" style={{width: '80px', color: 'black'}}>Controller Code</th>
                                  <th className="text-center" style={{width: '80px', color: 'black'}}>Contact</th>
                                  <th className="text-center" style={{width: '80px', color: 'black'}}>Email</th>
                                  <th className="text-center" style={{width: '80px', color: 'black'}}>Name</th>
                                  <th className="text-center" style={{width: '80px', color: 'black'}}>Password</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredControllers.map((ctrl, index) => (
                                  <tr key={index}>
                                    <td className="text-center fw-semibold">{index + 1}</td>
                                    <td>
                                      <span className="badge bg-secondary">{ctrl.departmentId}</span>
                                    </td>
                                    <td>
                                      <span className="badge bg-info text-dark">{ctrl.batchNo}</span>
                                    </td>
                                    <td className="fw-medium">{ctrl.center}</td>
                                    <td className="text-muted fst-italic">
                                      {ctrl.controller_code || '—'}
                                    </td>
                                    <td className="text-muted fst-italic">
                                      {ctrl.controller_contact || '—'}
                                    </td>
                                    <td className="text-muted fst-italic">
                                      {ctrl.controller_email || '—'}
                                    </td>
                                    <td className="text-muted fst-italic">
                                      {ctrl.controller_name || '—'}
                                    </td>
                                    <td>
                                      <code className="text-danger fw-semibold">{ctrl.controller_pass}</code>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-5">
                            <FaSearch size={48} className="text-muted mb-3" />
                            <h5 className="text-muted">No controllers found</h5>
                            <p className="text-muted mb-0">Try adjusting your search or filter criteria</p>
                          </div>
                        )}
                      </Card.Body>
                      <Card.Footer className="bg-light">
                        <div className="d-flex align-items-start">
                          <FaFileAlt className="me-2 mt-1 text-primary" />
                          <div>
                            <p className="mb-1 fw-semibold text-dark">Important Note:</p>
                            <p className="mb-0 text-muted small">
                              Empty fields (—) will be stored as empty strings in the database. 
                              Passwords are auto-generated based on batch number and center.
                            </p>
                          </div>
                        </div>
                      </Card.Footer>
                    </Card>
                  </Col>
                </Row>
              )}

              {/* Information Card */}
              <Row className="mt-4">
                <Col md={12}>
                  <Card className="bg-light">
                    <Card.Body>
                      <h6 className="mb-2">
                        <FaDatabase className="me-2" />
                        How It Works
                      </h6>
                      <ul className="text-muted mb-0 text-start">
                        <li>Click "Generate Controllers" to create controller accounts</li>
                        <li>Review the generated controller records in the table</li>
                        <li>Use search and filters to find specific controllers</li>
                        <li>Click "Approve & Save" to store controllers in the database</li>
                        <li>Passwords are automatically generated for each controller</li>
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AddController;


// // src/components/super-admin/AddController.js
// import React, { useState, useMemo } from 'react';
// import { Card, Container, Row, Col, Button, Form, Alert, Spinner, Modal } from 'react-bootstrap';
// import { FaDatabase, FaCheckCircle, FaTimes, FaExclamationTriangle, FaEye, FaFileAlt, FaSearch, FaFilter, FaMagic, FaTrash, FaInfoCircle } from 'react-icons/fa';
// import axios from 'axios';

// function AddController() {
//   const [loading, setLoading] = useState(false);
//   const [controllers, setControllers] = useState([]);
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState('');
//   const [showTable, setShowTable] = useState(false);
//   const [isApproving, setIsApproving] = useState(false);
  
//   // Modal States
//   const [showFlushModal, setShowFlushModal] = useState(false);
//   const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
//   const [showSuccessPreviewModal, setShowSuccessPreviewModal] = useState(false);
  
//   // Data States
//   const [insertedData, setInsertedData] = useState([]);
//   const [isFlushing, setIsFlushing] = useState(false);
  
//   // Search and Filter States
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterDepartment, setFilterDepartment] = useState('all');
//   const [filterBatch, setFilterBatch] = useState('all');
//   const [filterCenter, setFilterCenter] = useState('all');

//   // Static flag for simulation (set to true to show modals, false to skip)
//   const SIMULATE_EXISTING_DATA = true; // Change this to false to skip confirmation modals

//   // Get unique values for filters
//   const uniqueDepartments = useMemo(() => {
//     return ['all', ...new Set(controllers.map(ctrl => ctrl.departmentId))];
//   }, [controllers]);

//   const uniqueBatches = useMemo(() => {
//     return ['all', ...new Set(controllers.map(ctrl => ctrl.batchNo))];
//   }, [controllers]);

//   const uniqueCenters = useMemo(() => {
//     return ['all', ...new Set(controllers.map(ctrl => ctrl.center))];
//   }, [controllers]);

//   // Filtered and searched controllers
//   const filteredControllers = useMemo(() => {
//     return controllers.filter(ctrl => {
//       const safeToLower = (value) => {
//         if (value === null || value === undefined) return '';
//         return String(value).toLowerCase();
//       };

//       const searchLower = searchTerm.toLowerCase();

//       const matchesSearch = searchTerm === '' || 
//         safeToLower(ctrl.departmentId).includes(searchLower) ||
//         safeToLower(ctrl.batchNo).includes(searchLower) ||
//         safeToLower(ctrl.center).includes(searchLower) ||
//         safeToLower(ctrl.controller_code).includes(searchLower) ||
//         safeToLower(ctrl.controller_email).includes(searchLower) ||
//         safeToLower(ctrl.controller_name).includes(searchLower) ||
//         safeToLower(ctrl.controller_contact).includes(searchLower);

//       const matchesDepartment = filterDepartment === 'all' || 
//         String(ctrl.departmentId) === String(filterDepartment);
//       const matchesBatch = filterBatch === 'all' || 
//         String(ctrl.batchNo) === String(filterBatch);
//       const matchesCenter = filterCenter === 'all' || 
//         String(ctrl.center) === String(filterCenter);

//       return matchesSearch && matchesDepartment && matchesBatch && matchesCenter;
//     });
//   }, [controllers, searchTerm, filterDepartment, filterBatch, filterCenter]);

//   // Clear all filters
//   const clearFilters = () => {
//     setSearchTerm('');
//     setFilterDepartment('all');
//     setFilterBatch('all');
//     setFilterCenter('all');
//   };

//   // Check if any filter is active
//   const hasActiveFilters = searchTerm !== '' || filterDepartment !== 'all' || 
//                           filterBatch !== 'all' || filterCenter !== 'all';

//   // Generate Controllers
//   const handleGenerateControllers = async () => {
//     setLoading(true);
//     setMessage('');
//     setMessageType('');
//     setShowTable(false);
//     clearFilters();
    
//     try {
//       const response = await axios.post('https://www.shorthandonlineexam.in/api/new-department/generate-controllers');
      
//       if (response.data.success) {
//         setControllers(response.data.data);
//         setShowTable(true);
//         setMessage(`Generated ${response.data.count} controller records. Review and click "Approve & Save" to save.`);
//         setMessageType('info');
//       }
//     } catch (error) {
//       setMessage(`Error: ${error.response?.data?.message || error.message}`);
//       setMessageType('error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Approve Controllers (Main Entry Point) - WITH STATIC CONFIRMATION
//   const handleApproveControllers = () => {
//     setIsApproving(true);
//     setMessage('');
//     setMessageType('');
    
//     // STATIC CHECK: If flag is true, show confirmation modals
//     if (SIMULATE_EXISTING_DATA) {
//       // Simulate existing data detected
//       setShowFlushModal(true);
//       setIsApproving(false);
//     } else {
//       // No existing data - Directly save (original flow)
//       handleFinalSave();
//     }
//   };

//   // Handle Flush Modal - Yes Button
//   const handleFlushYes = () => {
//     setShowFlushModal(false);
//     setShowDeleteConfirmModal(true);
//   };

//   // Handle Flush Modal - No Button
//   const handleFlushNo = () => {
//     setShowFlushModal(false);
//     setIsApproving(false);
//     setMessage('Operation cancelled. Existing data was not modified.');
//     setMessageType('info');
//   };

//   // Handle Delete Confirmation - Yes Button
//   const handleDeleteConfirmYes = async () => {
//     setShowDeleteConfirmModal(false);
//     setIsFlushing(true);
    
//     // Simulate flushing delay
//     setTimeout(async () => {
//       await handleFinalSave();
//       setIsFlushing(false);
//     }, 1000);
//   };

//   // Handle Delete Confirmation - Cancel Button
//   const handleDeleteConfirmCancel = () => {
//     setShowDeleteConfirmModal(false);
//     setIsApproving(false);
//     setMessage('Operation cancelled. No data was deleted or inserted.');
//     setMessageType('info');
//   };

//   // Final Save (Insert Data to Database) - ORIGINAL BACKEND CALL
//   const handleFinalSave = async () => {
//     try {
//       const response = await axios.post('https://www.shorthandonlineexam.in/api/new-department/generate-save-controllers');
      
//       if (response.data.success) {
//         // Store inserted data for preview
//         setInsertedData(response.data.data || controllers);
        
//         // Show success message
//         setMessage(`Successfully saved ${response.data.count} controllers to database!`);
//         setMessageType('success');
        
//         // Show success preview modal
//         setShowSuccessPreviewModal(true);
        
//         // Clear form
//         setShowTable(false);
//         setControllers([]);
//         clearFilters();
//       }
//     } catch (error) {
//       setMessage(`Error saving data: ${error.response?.data?.message || error.message}`);
//       setMessageType('error');
//     } finally {
//       setIsApproving(false);
//     }
//   };

//   // Close Success Preview Modal
//   const handleCloseSuccessPreview = () => {
//     setShowSuccessPreviewModal(false);
//     setInsertedData([]);
//   };

//   // Cancel Operation
//   const handleCancel = () => {
//     setControllers([]);
//     setShowTable(false);
//     setMessage('');
//     setMessageType('');
//     clearFilters();
//   };

//   if (loading) {
//     return (
//       <Container fluid className="mt-4">
//         <div className="text-center">
//           <Spinner animation="border" role="status" className="me-2" />
//           <span>Generating controllers...</span>
//         </div>
//       </Container>
//     );
//   }

//   return (
//     <Container fluid className="mt-4">
//       <h2 className="mb-4 text-center">Controller Management</h2>

//       <Row className="justify-content-center">
//         <Col md={10}>
//           {/* Main Card */}
//           <Card className="text-center">
//             <Card.Header>
//               <h4 className="mb-0">
//                 <FaDatabase className="me-2" />
//                 Generate Controller Accounts
//               </h4>
//             </Card.Header>
//             <Card.Body className="p-4">
//               <p className="text-muted mb-4">
//                 Generate controller accounts for department-batch-center combinations
//               </p>

//               {/* Message Alert */}
//               {message && (
//                 <Alert 
//                   variant={messageType === 'success' ? 'success' : messageType === 'error' ? 'danger' : 'info'} 
//                   dismissible 
//                   onClose={() => setMessage('')}
//                   className="mb-4"
//                 >
//                   <div className="d-flex align-items-start">
//                     {messageType === 'success' && <FaCheckCircle className="me-2 mt-1" />}
//                     {messageType === 'error' && <FaTimes className="me-2 mt-1" />}
//                     {messageType === 'info' && <FaExclamationTriangle className="me-2 mt-1" />}
//                     <div>{message}</div>
//                   </div>
//                 </Alert>
//               )}

//               {/* Action Buttons */}
//               <Row className="g-4 mb-4">
//                 <Col md={12}>
//                   <Card className="shadow-sm">
//                     <Card.Header className="bg-light">
//                       <h5 className="mb-0">
//                         <FaMagic className="me-2" />
//                         Actions
//                       </h5>
//                     </Card.Header>
//                     <Card.Body>
//                       <div className="d-flex justify-content-center gap-3 flex-wrap">
//                         <Button
//                           variant="primary"
//                           size="lg"
//                           onClick={handleGenerateControllers}
//                           disabled={loading || showTable}
//                           className="px-4 py-3"
//                         >
//                           {loading ? (
//                             <>
//                               <Spinner animation="border" size="sm" className="me-2" />
//                               Generating...
//                             </>
//                           ) : (
//                             <>
//                               <FaMagic className="me-2" />
//                               Generate Controllers
//                             </>
//                           )}
//                         </Button>

//                         {showTable && (
//                           <>
//                             <Button
//                               variant="success"
//                               size="lg"
//                               onClick={handleApproveControllers}
//                               disabled={isApproving || isFlushing}
//                               className="px-4 py-3"
//                             >
//                               {isApproving || isFlushing ? (
//                                 <>
//                                   <Spinner animation="border" size="sm" className="me-2" />
//                                   {isFlushing ? 'Flushing...' : 'Processing...'}
//                                 </>
//                               ) : (
//                                 <>
//                                   <FaCheckCircle className="me-2" />
//                                   Approve & Save
//                                 </>
//                               )}
//                             </Button>

//                             <Button
//                               variant="danger"
//                               size="lg"
//                               onClick={handleCancel}
//                               disabled={isApproving || isFlushing}
//                               className="px-4 py-3"
//                             >
//                               <FaTimes className="me-2" />
//                               Cancel
//                             </Button>
//                           </>
//                         )}
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               </Row>

//               {/* Search and Filter Section */}
//               {showTable && controllers.length > 0 && (
//                 <Row className="g-4 mb-4">
//                   <Col md={12}>
//                     <Card className="shadow-sm">
//                       <Card.Header className="bg-light">
//                         <div className="d-flex justify-content-between align-items-center">
//                           <h5 className="mb-0">
//                             <FaFilter className="me-2" />
//                             Search & Filter
//                           </h5>
//                           {hasActiveFilters && (
//                             <Button
//                               variant="outline-secondary"
//                               size="sm"
//                               onClick={clearFilters}
//                             >
//                               <FaTimes className="me-1" />
//                               Clear All
//                             </Button>
//                           )}
//                         </div>
//                       </Card.Header>
//                       <Card.Body>
//                         <Row className="g-3">
//                           {/* Search Input */}
//                           <Col md={6} lg={3}>
//                             <Form.Group>
//                               <Form.Label>
//                                 <FaSearch className="me-1" />
//                                 Search
//                               </Form.Label>
//                               <Form.Control
//                                 type="text"
//                                 placeholder="Search controllers..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                               />
//                             </Form.Group>
//                           </Col>

//                           {/* Department Filter */}
//                           <Col md={6} lg={3}>
//                             <Form.Group>
//                               <Form.Label>Department</Form.Label>
//                               <Form.Select
//                                 value={filterDepartment}
//                                 onChange={(e) => setFilterDepartment(e.target.value)}
//                               >
//                                 <option value="all">All Departments</option>
//                                 {uniqueDepartments.slice(1).map(dept => (
//                                   <option key={dept} value={dept}>Department {dept}</option>
//                                 ))}
//                               </Form.Select>
//                             </Form.Group>
//                           </Col>

//                           {/* Batch Filter */}
//                           <Col md={6} lg={3}>
//                             <Form.Group>
//                               <Form.Label>Batch</Form.Label>
//                               <Form.Select
//                                 value={filterBatch}
//                                 onChange={(e) => setFilterBatch(e.target.value)}
//                               >
//                                 <option value="all">All Batches</option>
//                                 {uniqueBatches.slice(1).map(batch => (
//                                   <option key={batch} value={batch}>Batch {batch}</option>
//                                 ))}
//                               </Form.Select>
//                             </Form.Group>
//                           </Col>

//                           {/* Center Filter */}
//                           <Col md={6} lg={3}>
//                             <Form.Group>
//                               <Form.Label>Center</Form.Label>
//                               <Form.Select
//                                 value={filterCenter}
//                                 onChange={(e) => setFilterCenter(e.target.value)}
//                               >
//                                 <option value="all">All Centers</option>
//                                 {uniqueCenters.slice(1).map(center => (
//                                   <option key={center} value={center}>{center}</option>
//                                 ))}
//                               </Form.Select>
//                             </Form.Group>
//                           </Col>
//                         </Row>

//                         <Form.Text className="text-muted mt-2">
//                           Showing <strong>{filteredControllers.length}</strong> of <strong>{controllers.length}</strong> controllers
//                           {hasActiveFilters && (
//                             <span className="ms-2 badge bg-primary">{filteredControllers.length} filtered</span>
//                           )}
//                         </Form.Text>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                 </Row>
//               )}

//               {/* Controllers Table */}
//               {showTable && controllers.length > 0 && (
//                 <Row className="g-4">
//                   <Col md={12}>
//                     <Card className="shadow-sm border-success">
//                       <Card.Header className="bg-light">
//                         <div className="d-flex justify-content-between align-items-center">
//                           <h5 className="mb-0 text-success">
//                             <FaEye className="me-2" />
//                             Preview Controller Records
//                           </h5>
//                           <span className="badge bg-success rounded-pill px-3 py-2">
//                             {filteredControllers.length} Records
//                           </span>
//                         </div>
//                       </Card.Header>
//                       <Card.Body className="p-0">
//                         {filteredControllers.length > 0 ? (
//                           <div className="table-responsive">
//                             <table className="table table-hover table-striped mb-0">
//                               <thead className="table-dark">
//                                 <tr>
//                                   <th className="text-center" style={{width: '80px'}}>Sr. No.</th>
//                                   <th className="text-center">Department ID</th>
//                                   <th className="text-center">Batch No</th>
//                                   <th className="text-center">Center</th>
//                                   <th className="text-center">Controller Code</th>
//                                   <th className="text-center">Contact</th>
//                                   <th className="text-center">Email</th>
//                                   <th className="text-center">Name</th>
//                                   <th className="text-center">Password</th>
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 {filteredControllers.map((ctrl, index) => (
//                                   <tr key={index}>
//                                     <td className="text-center fw-semibold">{index + 1}</td>
//                                     <td className="text-center">
//                                       <span className="badge bg-secondary">{ctrl.departmentId}</span>
//                                     </td>
//                                     <td className="text-center">
//                                       <span className="badge bg-info text-dark">{ctrl.batchNo}</span>
//                                     </td>
//                                     <td className="text-center fw-medium">{ctrl.center}</td>
//                                     <td className="text-center text-muted fst-italic">
//                                       {ctrl.controller_code || '—'}
//                                     </td>
//                                     <td className="text-center text-muted fst-italic">
//                                       {ctrl.controller_contact || '—'}
//                                     </td>
//                                     <td className="text-center text-muted fst-italic">
//                                       {ctrl.controller_email || '—'}
//                                     </td>
//                                     <td className="text-center text-muted fst-italic">
//                                       {ctrl.controller_name || '—'}
//                                     </td>
//                                     <td className="text-center">
//                                       <code className="text-danger fw-semibold">{ctrl.controller_pass}</code>
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                         ) : (
//                           <div className="text-center py-5">
//                             <FaSearch size={48} className="text-muted mb-3" />
//                             <h5 className="text-muted">No controllers found</h5>
//                             <p className="text-muted mb-0">Try adjusting your search or filter criteria</p>
//                           </div>
//                         )}
//                       </Card.Body>
//                       <Card.Footer className="bg-light">
//                         <div className="d-flex align-items-start">
//                           <FaFileAlt className="me-2 mt-1 text-primary" />
//                           <div>
//                             <p className="mb-1 fw-semibold text-dark">Important Note:</p>
//                             <p className="mb-0 text-muted small">
//                               Empty fields (—) will be stored as empty strings in the database. 
//                               Passwords are auto-generated based on batch number and center.
//                             </p>
//                           </div>
//                         </div>
//                       </Card.Footer>
//                     </Card>
//                   </Col>
//                 </Row>
//               )}

//               {/* Information Card */}
//               <Row className="mt-4">
//                 <Col md={12}>
//                   <Card className="bg-light">
//                     <Card.Body>
//                       <h6 className="mb-2">
//                         <FaDatabase className="me-2" />
//                         How It Works
//                       </h6>
//                       <ul className="text-muted mb-0 text-start">
//                         <li>Click "Generate Controllers" to create controller accounts</li>
//                         <li>Review the generated controller records in the table</li>
//                         <li>Use search and filters to find specific controllers</li>
//                         <li>Click "Approve & Save" to store controllers in the database</li>
//                         <li>If data exists, you'll be asked to confirm deletion before inserting</li>
//                         <li>Passwords are automatically generated for each controller</li>
//                       </ul>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Modal 1: Flush Confirmation (First Warning) */}
//       <Modal 
//         show={showFlushModal} 
//         onHide={handleFlushNo}
//         backdrop="static"
//         keyboard={false}
//         centered
//       >
//         <Modal.Header closeButton className="bg-warning text-dark">
//           <Modal.Title>
//             <FaExclamationTriangle className="me-2" />
//             Data Already Exists
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="text-center py-3">
//             <FaDatabase size={64} className="text-warning mb-3" />
//             <h5 className="mb-3">Existing Data Detected</h5>
//             <p className="text-muted mb-4">
//               There are <strong className="text-danger">controller records</strong> already in the database.
//             </p>
//             <Alert variant="warning" className="text-start">
//               <FaInfoCircle className="me-2" />
//               <strong>Do you want to flush (delete) the existing data?</strong>
//               <br />
//               <small>This will remove all current controller records before inserting new ones.</small>
//             </Alert>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleFlushNo} size="lg">
//             <FaTimes className="me-2" />
//             No, Cancel
//           </Button>
//           <Button variant="warning" onClick={handleFlushYes} size="lg">
//             <FaTrash className="me-2" />
//             Yes, Flush Data
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Modal 2: Delete Confirmation (Second Warning) */}
//       <Modal 
//         show={showDeleteConfirmModal} 
//         onHide={handleDeleteConfirmCancel}
//         backdrop="static"
//         keyboard={false}
//         centered
//       >
//         <Modal.Header closeButton className="bg-danger text-white">
//           <Modal.Title>
//             <FaExclamationTriangle className="me-2" />
//             Final Confirmation
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="text-center py-3">
//             <FaTrash size={64} className="text-danger mb-3" />
//             <h5 className="mb-3 text-danger">Are You Absolutely Sure?</h5>
//             <p className="text-muted mb-4">
//               This action will <strong className="text-danger">permanently delete</strong> all existing controller data from the database.
//             </p>
//             <Alert variant="danger" className="text-start">
//               <FaExclamationTriangle className="me-2" />
//               <strong>Warning: This action cannot be undone!</strong>
//               <ul className="mt-2 mb-0">
//                 <li>All existing records will be deleted</li>
//                 <li>New controller data will be inserted</li>
//                 <li>This operation is irreversible</li>
//               </ul>
//             </Alert>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleDeleteConfirmCancel} size="lg">
//             <FaTimes className="me-2" />
//             Cancel
//           </Button>
//           <Button 
//             variant="danger" 
//             onClick={handleDeleteConfirmYes} 
//             size="lg"
//             disabled={isFlushing}
//           >
//             {isFlushing ? (
//               <>
//                 <Spinner animation="border" size="sm" className="me-2" />
//                 Deleting...
//               </>
//             ) : (
//               <>
//                 <FaCheckCircle className="me-2" />
//                 Yes, Delete & Insert
//               </>
//             )}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Modal 3: Success Preview Modal */}
//       <Modal 
//         show={showSuccessPreviewModal} 
//         onHide={handleCloseSuccessPreview}
//         size="xl"
//         centered
//       >
//         <Modal.Header closeButton className="bg-success text-white">
//           <Modal.Title>
//             <FaCheckCircle className="me-2" />
//             Data Successfully Inserted
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Alert variant="success" className="mb-4">
//             <FaCheckCircle className="me-2" />
//             <strong>Success!</strong> {insertedData.length} controller records have been successfully saved to the database.
//           </Alert>

//           {insertedData.length > 0 && (
//             <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
//               <table className="table table-hover table-striped table-bordered mb-0">
//                 <thead className="table-success sticky-top">
//                   <tr>
//                     <th className="text-center">Sr. No.</th>
//                     <th className="text-center">Department ID</th>
//                     <th className="text-center">Batch No</th>
//                     <th className="text-center">Center</th>
//                     <th className="text-center">Controller Code</th>
//                     <th className="text-center">Contact</th>
//                     <th className="text-center">Email</th>
//                     <th className="text-center">Name</th>
//                     <th className="text-center">Password</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {insertedData.map((ctrl, index) => (
//                     <tr key={index}>
//                       <td className="text-center fw-semibold">{index + 1}</td>
//                       <td className="text-center">
//                         <span className="badge bg-secondary">{ctrl.departmentId}</span>
//                       </td>
//                       <td className="text-center">
//                         <span className="badge bg-info text-dark">{ctrl.batchNo}</span>
//                       </td>
//                       <td className="text-center fw-medium">{ctrl.center}</td>
//                       <td className="text-center text-muted fst-italic">
//                         {ctrl.controller_code || '—'}
//                       </td>
//                       <td className="text-center text-muted fst-italic">
//                         {ctrl.controller_contact || '—'}
//                       </td>
//                       <td className="text-center text-muted fst-italic">
//                         {ctrl.controller_email || '—'}
//                       </td>
//                       <td className="text-center text-muted fst-italic">
//                         {ctrl.controller_name || '—'}
//                       </td>
//                       <td className="text-center">
//                         <code className="text-danger fw-semibold">{ctrl.controller_pass}</code>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="success" onClick={handleCloseSuccessPreview} size="lg">
//             <FaCheckCircle className="me-2" />
//             Done
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// }

// export default AddController;
