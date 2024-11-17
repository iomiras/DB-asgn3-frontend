import React, { useState, useEffect } from 'react';
import { BASE_API_URL } from '../config';
import './component.css'; // Import the CSS file

const RecordsTable = () => {
  const [records, setRecords] = useState([]);
  const [editRecord, setEditRecord] = useState(null); // Track the record being edited
  const [newRecord, setNewRecord] = useState({ email: '', cname: '', disease_code: '', total_deaths: '', total_patients: '' }); // Track new record inputs

  // Fetch records from the backend
  useEffect(() => {
    fetch(`${BASE_API_URL}/api/records/`)
      .then(response => response.json())
      .then(data => setRecords(data))
      .catch(error => {
        console.error('Error fetching records:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  }, []);

  // Handle adding a new record
  const handleAddRecord = () => {
    fetch(`${BASE_API_URL}/api/records/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord),
    })
      .then(response => response.json())
      .then(savedRecord => {
        setRecords([...records, savedRecord]);
        setNewRecord({ email: '', cname: '', disease_code: '', total_deaths: '', total_patients: '' }); // Reset new record input
      })
      .catch(error => {
        console.error('Error adding record:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  };

  // Handle editing an existing record
  const handleEditRecord = (updatedRecord) => {
    fetch(`${BASE_API_URL}/api/records/${updatedRecord.email}/${updatedRecord.cname}/${updatedRecord.disease_code}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedRecord),
    })
      .then(response => response.json())
      .then(updated => {
        setRecords(records.map(record => 
          record.email === updated.email && record.cname === updated.cname && record.disease_code === updated.disease_code ? updated : record
        ));
        setEditRecord(null); // Exit edit mode
      })
      .catch(error => {
        console.error('Error updating record:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  };

  // Handle deleting a record
  const handleDeleteRecord = (record) => {
    fetch(`${BASE_API_URL}/api/records/${record.email}/${record.cname}/${record.disease_code}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setRecords(records.filter(r => 
            r.email !== record.email || r.cname !== record.cname || r.disease_code !== record.disease_code
          ));
        } else {
          console.error('Error deleting record:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error deleting record:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  };

  return (
    <div>
      <table className="table table-hover table-bordered">
        <caption className="caption-top">Records Table</caption>
        <thead className="table-dark">
          <tr>
            <th>Email</th>
            <th>Company Name</th>
            <th>Disease Code</th>
            <th>Total Deaths</th>
            <th>Total Patients</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={`${record.email}-${record.cname}-${record.disease_code}`}>
              {editRecord && editRecord.email === record.email && editRecord.cname === record.cname && editRecord.disease_code === record.disease_code ? (
                <>
                  <td>
                    <input
                      type="email"
                      value={editRecord.email}
                      onChange={(e) => setEditRecord({ ...editRecord, email: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editRecord.cname}
                      onChange={(e) => setEditRecord({ ...editRecord, cname: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editRecord.disease_code}
                      onChange={(e) => setEditRecord({ ...editRecord, disease_code: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editRecord.total_deaths}
                      onChange={(e) => setEditRecord({ ...editRecord, total_deaths: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editRecord.total_patients}
                      onChange={(e) => setEditRecord({ ...editRecord, total_patients: e.target.value })}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleEditRecord(editRecord)} className="button-style">
                      ✔️
                    </button>
                    <button onClick={() => setEditRecord(null)} className="button-style">
                      ❌
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{record.email}</td>
                  <td>{record.cname}</td>
                  <td>{record.disease_code}</td>
                  <td>{record.total_deaths}</td>
                  <td>{record.total_patients}</td>
                  <td>
                    <button onClick={() => setEditRecord(record)} className="button-style">
                      ✏️
                    </button>
                    <button onClick={() => handleDeleteRecord(record)} className="button-style">
                      🗑️
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {/* New Record Row */}
          <tr>
            <td>
              <input
                type="email"
                value={newRecord.email}
                onChange={(e) => setNewRecord({ ...newRecord, email: e.target.value })}
                placeholder="Email"
              />
            </td>
            <td>
              <input
                type="text"
                value={newRecord.cname}
                onChange={(e) => setNewRecord({ ...newRecord, cname: e.target.value })}
                placeholder="Company Name"
              />
            </td>
            <td>
              <input
                type="text"
                value={newRecord.disease_code}
                onChange={(e) => setNewRecord({ ...newRecord, disease_code: e.target.value })}
                placeholder="Disease Code"
              />
            </td>
            <td>
              <input
                type="number"
                value={newRecord.total_deaths}
                onChange={(e) => setNewRecord({ ...newRecord, total_deaths: e.target.value })}
                placeholder="Total Deaths"
              />
            </td>
            <td>
              <input
                type="number"
                value={newRecord.total_patients}
                onChange={(e) => setNewRecord({ ...newRecord, total_patients: e.target.value })}
                placeholder="Total Patients"
              />
            </td>
            <td>
              <button onClick={handleAddRecord} className="button-style">
                ➕
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RecordsTable;
