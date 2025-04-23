import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
    const [tableNames, setTableNames] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [editedValues, setEditedValues] = useState({});
    const [changedRows, setChangedRows] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({});
    const pageSize = 10;

    useEffect(() => {
        fetchTableNames();
    }, []);

    useEffect(() => {
        if (selectedTable) {
            applyFilters();
        }
    }, [filters, tableData]);

    const fetchTableNames = async () => {
        try {
            const response = await axios.get('http://localhost:3000/fetch-table-names', {
                withCredentials: true
            });
            setTableNames(response.data);
        } catch (error) {
            console.error('Error fetching table names:', error);
        }
    };

    const fetchTableData = async (tableName) => {
        try {
            const response = await axios.post('http://localhost:3000/fetch-table-data', {
                tableName
            }, {
                withCredentials: true
            });
            const dataWithKeys = response.data.map((item, index) => ({ ...item, key: index.toString() }));
            setTableData(dataWithKeys);
            setFilteredData(dataWithKeys);
            if (dataWithKeys.length > 0) {
                const tableColumns = Object.keys(dataWithKeys[0])
                    .map(key => ({
                        title: key,  
                        dataIndex: key,
                        key: key,
                    }));
                setColumns(tableColumns);
                initializeFilters(dataWithKeys, tableColumns);
            }
        } catch (error) {
            console.error('Error fetching table data:', error);
        }
    };

    const initializeFilters = (data, columns) => {
        const newFilters = {};
        columns.forEach(column => {
            const uniqueValues = [...new Set(data.map(item => item[column.dataIndex]))];
            if (uniqueValues.length <= 20) {
                newFilters[column.dataIndex] = {
                    type: 'dropdown',
                    values: uniqueValues,
                    selected: ''
                };
            } else {
                newFilters[column.dataIndex] = {
                    type: 'search',
                    value: ''
                };
            }
        });
        setFilters(newFilters);
    };

    const handleTableSelect = (event) => {
        const value = event.target.value;
        setSelectedTable(value);
        fetchTableData(value);
    };

    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, `${selectedTable}.xlsx`);
        alert('Excel file downloaded successfully!');
    };

    const handleEdit = (key) => {
        setEditingKey(key);
        const row = tableData.find(item => item.key === key);
        setEditedValues(row);
    };

    const handleSave = (key) => {
        setChangedRows(prev => ({...prev, [key]: editedValues}));
        setTableData(prevData => prevData.map(item => item.key === key ? editedValues : item));
        setFilteredData(prevData => prevData.map(item => item.key === key ? editedValues : item));
        setEditingKey('');
        setEditedValues({});
        alert('Row updated locally. Click Submit Changes to save to the backend.');
    };

    const handleCancel = () => {
        setEditingKey('');
        setEditedValues({});
    };

    const handleChange = (dataIndex, value) => {
        setEditedValues(prev => ({...prev, [dataIndex]: value}));
    };

    const handleImageChange = (dataIndex, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                handleChange(dataIndex, base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const submitChanges = async () => {
        try {
            const response = await axios.post('http://localhost:3000/update-table-data', {
                tableName: selectedTable,
                updatedRows: Object.values(changedRows)
            }, {
                withCredentials: true
            });
            if (response.data.success) {
                alert('Changes submitted successfully to the backend');
                setChangedRows({});
                fetchTableData(selectedTable);
            } else {
                alert('Failed to submit changes to the backend');
            }
        } catch (error) {
            console.error('Error submitting changes:', error);
            alert('Error submitting changes to the backend');
        }
    };

    const isImageColumn = (columnName) => {
        const imageColumns = ['base64', 'sign_base64', 'photo', 'image1', 'image2', 'image3', 'image4','logo'];
        return imageColumns.includes(columnName.toLowerCase());
    };

    const handleFilterChange = (columnName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [columnName]: {
                ...prevFilters[columnName],
                selected: value
            }
        }));
    };

    const handleSearchChange = (columnName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [columnName]: {
                ...prevFilters[columnName],
                value: value
            }
        }));
    };

    const applyFilters = () => {
        let newFilteredData = [...tableData];
        
        Object.keys(filters).forEach(columnName => {
            const filter = filters[columnName];
            if (filter.type === 'dropdown' && filter.selected) {
                newFilteredData = newFilteredData.filter(row => 
                    row[columnName] && row[columnName].toString() === filter.selected
                );
            } else if (filter.type === 'search' && filter.value) {
                newFilteredData = newFilteredData.filter(row =>
                    row[columnName] && row[columnName].toString().toLowerCase().includes(filter.value.toLowerCase())
                );
            }
        });

        setFilteredData(newFilteredData);
        setCurrentPage(1);
    };

    const renderTableHeader = () => {
        return (
            <tr>
                {columns.map(column => (
                    <th key={column.key} className="sa-table-header-cell">
                        {column.title}
                        {filters[column.dataIndex]?.type === 'dropdown' ? (
                            <select 
                                className="sa-filter-dropdown"
                                value={filters[column.dataIndex].selected} 
                                onChange={(e) => handleFilterChange(column.dataIndex, e.target.value)}
                            >
                                <option value="">All</option>
                                {filters[column.dataIndex].values.map(value => (
                                    <option key={value} value={value}>{value}</option>
                                ))}
                            </select>
                        ) : (
                            <input 
                                className="sa-filter-search"
                                type="text" 
                                placeholder="Search..." 
                                value={filters[column.dataIndex]?.value || ''}
                                onChange={(e) => handleSearchChange(column.dataIndex, e.target.value)}
                            />
                        )}
                    </th>
                ))}
                <th className="sa-table-header-cell">Action</th>
            </tr>
        );
    };

    const renderTableBody = () => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredData.slice(startIndex, endIndex).map(row => (
            <tr key={row.key} className="sa-table-row">
                {columns.map(column => (
                    <td key={column.key} className="sa-table-cell">
                        {editingKey === row.key ? (
                            isImageColumn(column.dataIndex) ? (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(column.dataIndex, e)}
                                    className="sa-file-input"
                                />
                            ) : (
                                <input
                                    value={editedValues[column.dataIndex] || ''}
                                    onChange={(e) => handleChange(column.dataIndex, e.target.value)}
                                    className="sa-text-input"
                                />
                            )
                        ) : (
                            isImageColumn(column.dataIndex) ? (
                                <img 
                                    src={`data:image/jpeg;base64,${row[column.dataIndex]}`} 
                                    alt={`${column.dataIndex}`}
                                    className="sa-table-image"
                                />
                            ) : (
                                <div className="sa-cell-content">
                                    {typeof row[column.dataIndex] === 'string' && row[column.dataIndex].length > 100
                                        ? `${row[column.dataIndex].substring(0, 100)}...`
                                        : row[column.dataIndex]}
                                </div>
                            )
                        )}
                    </td>
                ))}
                <td className="sa-table-cell">
                    {editingKey === row.key ? (
                        <div className="sa-action-buttons">
                            <button className="sa-save-button" onClick={() => handleSave(row.key)}>Save</button>
                            <button className="sa-cancel-button" onClick={handleCancel}>Cancel</button>
                        </div>
                    ) : (
                        <button className="sa-edit-button" onClick={() => handleEdit(row.key)}>Edit</button>
                    )}
                </td>
            </tr>
        ));
    };

    const renderPagination = () => {
        const totalPages = Math.ceil(filteredData.length / pageSize);
        return (
            <div className="sa-pagination">
                <button 
                    className="sa-pagination-button"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="sa-pagination-info">{currentPage} / {totalPages}</span>
                <button 
                    className="sa-pagination-button"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <div className="sa-dashboard">
            <h1 className="sa-dashboard-title">Super Admin Dashboard</h1>
            <div className="sa-controls">
                <select className="sa-table-select" onChange={handleTableSelect} value={selectedTable || ""}>
                    <option value="">Select a table</option>
                    {tableNames.map(name => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
                {selectedTable && (
                    <>
                        <button className="sa-download-button" onClick={handleDownloadExcel}>Download Excel</button>
                        <button 
                            className="sa-submit-button" 
                            onClick={submitChanges} 
                            disabled={Object.keys(changedRows).length === 0}
                        >
                            Submit Changes
                        </button>
                    </>
                )}
            </div>
            {selectedTable && (
                <div className="sa-table-container">
                    <table className="sa-table">
                        <thead>{renderTableHeader()}</thead>
                        <tbody>{renderTableBody()}</tbody>
                    </table>
                    {renderPagination()}
                </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;