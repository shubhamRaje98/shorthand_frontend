import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const tableOptions = [
  'students',
  'admindb',
  'aduiologs',
  'batchdb',
  'controllerdb',
  'examcenterdb',
  'feedbackdb',
  'finalpassagesubmit',
  'loginlogs',
  'pcregistrations',
  'studentlogs',
  'subjectdb',
  'textlogs'
];

const FetchUpdateTable = () => {
  const [data, setData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [selectedTable, setSelectedTable] = useState(tableOptions[0]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.post('http://localhost:3000/fetch-update-tables');
      setData(response.data);
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

  const handleSave = async (index) => {
    try {
      await axios.put(`http://localhost:3000/update-table/${selectedTable}/${editingData.student_id}`, editingData);
      const updatedData = [...data];
      updatedData[index] = editingData;
      setData(updatedData);
      //console.log("Data after setting: "+editingData);
      setEditingIndex(null);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Admin Panel</h1>
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
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Student ID</th>
            <th>Institute ID</th>
            <th>Batch No</th>
            <th>Batch Date</th>
            <th>Full Name</th>
            <th>Subjects ID</th>
            <th>Course ID</th>
            <th>Batch Year</th>
            <th>Logged In</th>
            <th>Done</th>
            <th>Photo</th>
            <th>Reporting Time</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Day</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) =>
            editingIndex === index ? (
              <tr key={index}>
                {Object.keys(item).map((key) => (
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
                {Object.keys(item).map((key) => (
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
    </div>
  );
};

export default FetchUpdateTable;