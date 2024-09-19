import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { redirect } from 'react-router-dom';

const tableOptions = [
  'students', 'admindb', 'audiologs', 'batchdb', 'controllerdb',
  'examcenterdb', 'feedbackdb', 'finalpassagesubmit', 'loginlogs',
  'pcregistration', 'studentlogs', 'subjectdb', 'textlogs'
];

const sensitiveFields = ['password'];

const FetchUpdateTable = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [selectedTable, setSelectedTable] = useState(tableOptions[0]);
  const [centerFilter, setCenterFilter] = useState('');
  const [batchNoFilter, setBatchNoFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentIdFilter, setStudentIdFilter] = useState('');
  const [subjectIdFilter, setSubjectIdFilter] = useState('');
  const [newEntryData, setNewEntryData] = useState({});

  const itemsPerPage = 700;

  useEffect(() => {
    fetchData();
  }, [selectedTable, centerFilter, batchNoFilter, studentIdFilter]);

  const fetchData = async () => {
    try {
      let fetchParams = {
        tableName: selectedTable
      };

      if (selectedTable === 'students') {
        fetchParams = {
          ...fetchParams,
          center: centerFilter,
          batchNo: batchNoFilter
        };
      }
      if (selectedTable === 'audiologs') {
        fetchParams = {
          ...fetchParams,
          student_id: studentIdFilter
        };
      }
      if (selectedTable === 'studentlogs') {
        fetchParams = {
          ...fetchParams,
          student_id: studentIdFilter,
          center: centerFilter
        };
      }
      if (selectedTable === 'textlogs') {
        fetchParams = {
          ...fetchParams,
          student_id: studentIdFilter
        };
      }
      if (selectedTable === 'loginlogs') {
        fetchParams = {
          ...fetchParams,
          student_id: studentIdFilter
        };
      }
      if (selectedTable === 'batchdb') {
        fetchParams = {
          ...fetchParams,
          batchNo: batchNoFilter
        };
      }
      if (selectedTable === 'controllerdb') {
        fetchParams = {
          ...fetchParams,
          center: centerFilter,
          batchNo: batchNoFilter
        };
      }
      if (selectedTable === 'examcenterdb') {
        fetchParams = {
          ...fetchParams,
          center: centerFilter,
        };
      }
      if (selectedTable === 'feedbackdb') {
        fetchParams = {
          ...fetchParams,
          student_id: studentIdFilter
        };
      }
      if (selectedTable === 'pcregistration') {
        fetchParams = {
          ...fetchParams,
          center: centerFilter
        };
      }
      if (selectedTable === 'subjectdb') {
        fetchParams = {
          ...fetchParams,
          subjectId: subjectIdFilter
        };
      }
      if (selectedTable === 'finalpassagesubmit') {
        fetchParams = {
          ...fetchParams,
          student_id: studentIdFilter
        };
      }
      
      const response = await axios.post('https://shorthandonlineexam.in/fetch-update-tables', fetchParams);

      const fetchedData = response.data;
      if (fetchedData.length > 0) {
        const filteredHeaders = Object.keys(fetchedData[0]).filter(header => !sensitiveFields.includes(header));
        setHeaders(filteredHeaders);
        setData(fetchedData);
      } else {
        setHeaders([]);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditingData({ ...data[index] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingData({ ...editingData, [name]: value });
  };

  const handleNewEntryChange = (e) => {
    const { name, value } = e.target;
    setNewEntryData({ ...newEntryData, [name]: value });
  };

  const handleSave = async (index) => {
    try {
      await axios.put(`https://shorthandonlineexam.in/update-table/${selectedTable}/${editingData.student_id}`, editingData);
      const updatedData = [...data];
      updatedData[index] = editingData;
      setData(updatedData);
      setEditingIndex(null);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleAddNewEntry = async () => {
    try {
      const response = await axios.post(`https://shorthandonlineexam.in/add-entry/${selectedTable}`, newEntryData);
      setData([...data, response.data]);
      setNewEntryData({});
      alert(response);
      redirect("/fetch-update-table");
    } catch (error) {
      console.error('Error adding new entry:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, selectedTable);
    XLSX.writeFile(workbook, `${selectedTable}_export.xlsx`);
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Super Admin Panel</h1>
      <div className="mb-3">
        <label htmlFor="tableSelect" className="form-label">Select Table</label>
        <select
          id="tableSelect"
          className="form-select"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          {tableOptions.map((table, index) => (
            <option key={index} value={table}>
              {table}
            </option>
          ))}
        </select>
      </div>
      {selectedTable === 'examcenterdb' && (
        <>
          <div className="mb-2">
            <label htmlFor="studentIdFilter" className="form-label">Filter by center:</label>
            <input
              type="text"
              id="centerFilter"
              className="form-control"
              value={centerFilter}
              onChange={(e) => setCenterFilter(e.target.value)}
            />
          </div>
        </>
      )}
      {selectedTable === 'controllerdb' && (
        <>
          <div className="mb-2">
            <label htmlFor="studentIdFilter" className="form-label">Filter center:</label>
            <input
              type="text"
              id="centerFilter"
              className="form-control"
              value={centerFilter}
              onChange={(e) => setCenterFilter(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="centerFilter" className="form-label">Filter by batch number</label>
            <input
              id="batchFilter"
              type="text"
              className="form-control"
              value={batchNoFilter}
              onChange={(e) => setBatchNoFilter(e.target.value)}
            />
          </div>
        </>
      )}
      {selectedTable === 'batchdb' && (
        <>
          <div className="mb-2">
            <label htmlFor="studentIdFilter" className="form-label">Filter by batch number:</label>
            <input
              type="text"
              id="batchNoFilter"
              className="form-control"
              value={batchNoFilter}
              onChange={(e) => setBatchNoFilter(e.target.value)}
            />
          </div>
        </>
      )}
      {selectedTable === 'loginlogs' && (
        <>
          <div className="mb-2">
            <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
            <input
              type="text"
              id="studentIdFilter"
              className="form-control"
              value={studentIdFilter}
              onChange={(e) => setStudentIdFilter(e.target.value)}
            />
          </div>
        </>
      )}
      {selectedTable === 'feedbackdb' && (
        <>
          <div className="mb-2">
            <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
            <input
              type="text"
              id="studentIdFilter"
              className="form-control"
              value={studentIdFilter}
              onChange={(e) => setStudentIdFilter(e.target.value)}
            />
          </div>
        </>
      )}
      {selectedTable === 'finalpassagesubmit' && (
        <>
          <div className="mb-2">
            <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
            <input
              type="text"
              id="studentIdFilter"
              className="form-control"
              value={studentIdFilter}
              onChange={(e) => setStudentIdFilter(e.target.value)}
            />
          </div>
        </>
      )}
      {selectedTable === 'pcregistration' && (
        <>
          <div className="mb-2">
            <label htmlFor="centerFilter" className="form-label">Filter by center:</label>
            <input
              type="text"
              id="centerFilter"
              className="form-control"
              value={centerFilter}
              onChange={(e) => setCenterFilter(e.target.value)}
            />
          </div>
        </>
      )}
      {selectedTable === 'subjectdb' && (
        <>
          <div className="mb-2">
            <label htmlFor="subjectIdFilter" className="form-label">Filter by Subject Id:</label>
            <input
              type="text"
              id="subjectIdFilter"
              className="form-control"
              value={subjectIdFilter}
              onChange={(e) => setSubjectIdFilter(e.target.value)}
            />
          </div>
        </>
      )}
      {selectedTable === 'textlogs' && (
        <>
          <div className="mb-2">
            <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
            <input
              type="text"
              id="studentIdFilter"
              className="form-control"
              value={studentIdFilter}
              onChange={(e) => setStudentIdFilter(e.target.value)}
            />
          </div>
        </>
      )}
      {selectedTable === 'studentlogs' && (
        <>
          <div className="mb-2">
            <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
            <input
              type="text"
              id="studentIdFilter"
              className="form-control"
              value={studentIdFilter}
              onChange={(e) => setStudentIdFilter(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="centerFilter" className="form-label">Filter by Center</label>
            <input
              id="centerFilter"
              type="text"
              className="form-control"
              value={centerFilter}
              onChange={(e) => setCenterFilter(e.target.value)}
            />
          </div>
        </>
      )}
      {selectedTable === 'audiologs' && (
        <>
          <div className="mb-2">
            <label htmlFor="studentIdFilter" className="form-label">Filter by Student ID:</label>
            <input
              type="text"
              id="studentIdFilter"
              className="form-control"
              value={studentIdFilter}
              onChange={(e) => setStudentIdFilter(e.target.value)}
            />
          </div>
        </>
      )}
      {selectedTable === 'students' && (
        <>
          <div className="mb-3">
            <label htmlFor="centerFilter" className="form-label">Filter by Center</label>
            <input
              id="centerFilter"
              type="text"
              className="form-control"
              value={centerFilter}
              onChange={(e) => setCenterFilter(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="batchNoFilter" className="form-label">Filter by Batch No</label>
            <input
              id="batchNoFilter"
              type="text"
              className="form-control"
              value={batchNoFilter}
              onChange={(e) => setBatchNoFilter(e.target.value)}
            />
          </div>
        </>
      )}
      <button className="btn btn-primary mb-3" onClick={exportToExcel}>
        Export to excel
      </button>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>#</th>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        <tr>
            <td>New entry</td>
            {headers.map((key, index) => (
              <td key={index}>
                <input
                  type="text"
                  name={key}
                  value={newEntryData[key] || ''}
                  onChange={handleNewEntryChange}
                  className="form-control"
                />
              </td>
            ))}
            <td>
              <button
                className="btn btn-success"
                onClick={handleAddNewEntry}
              >
                Add
              </button>
            </td>
          </tr>
          {currentData.map((item, index) =>
            editingIndex === index ? (
              <tr key={index}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                {headers.map((key) => (
                  <td key={key}>
                    <input
                      type="text"
                      name={key}
                      value={editingData[key]}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </td>
                ))}
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => handleSave(index)}
                  >
                    Save
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={index}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                {headers.map((key) => (
                  <td key={key}>{item[key]}</td>
                ))}
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            )
          )}
          
        </tbody>
      </table>
      <div className="d-flex justify-content-center mt-3">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`btn btn-primary mx-1 ${currentPage === i + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FetchUpdateTable;