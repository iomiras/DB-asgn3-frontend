import React, { useState, useEffect } from 'react';
import { BASE_API_URL } from '../config';
import './component.css';

const PatientsTable = () => {
  const [patients, setPatients] = useState([]);
  const [editPatient, setEditPatient] = useState(null); // Track the patient being edited
  const [newPatient, setNewPatient] = useState({ email: '' }); // Track new patient inputs

  // Fetch patients from the backend
  useEffect(() => {
    fetch(`${BASE_API_URL}/api/patients/`)
      .then(response => response.json())
      .then(data => setPatients(data))
      .catch(error => {
        console.error('Error fetching patients:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  }, []);

  // Handle adding a new patient
  const handleAddPatient = () => {
    fetch(`${BASE_API_URL}/api/patients/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPatient),
    })
      .then(response => response.json())
      .then(savedPatient => {
        setPatients([...patients, savedPatient]);
        setNewPatient({ email: '' }); // Reset new patient input
      })
      .catch(error => {
        console.error('Error adding patient:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  };

  // Handle editing an existing patient
  const handleEditPatient = (updatedPatient) => {
    fetch(`${BASE_API_URL}/api/patients/${updatedPatient.email}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPatient),
    })
      .then(response => response.json())
      .then(updated => {
        setPatients(patients.map(p => (p.email === updated.email ? updated : p)));
        setEditPatient(null); // Exit edit mode
      })
      .catch(error => {
        console.error('Error updating patient:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  };

  // Handle deleting a patient
  const handleDeletePatient = (patient) => {
    fetch(`${BASE_API_URL}/api/patients/${patient.email}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setPatients(patients.filter(p => p.email !== patient.email));
        } else {
          console.error('Error deleting patient:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error deleting patient:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  };

  return (
    <div>
      <table className="table table-hover table-bordered">
        <caption className="caption-top">Patients Table</caption>
        <thead className="table-dark">
          <tr>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.email}>
              {editPatient && editPatient.email === patient.email ? (
                <>
                  <td>
                    <input
                      type="email"
                      value={editPatient.email}
                      onChange={(e) => setEditPatient({ ...editPatient, email: e.target.value })}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleEditPatient(editPatient)} className="button-style">
                      ✔️
                    </button>
                    <button onClick={() => setEditPatient(null)} className="button-style">
                      ❌
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{patient.email}</td>
                  <td>
                    <button onClick={() => setEditPatient(patient)} className="button-style">
                      ✏️
                    </button>
                    <button onClick={() => handleDeletePatient(patient)} className="button-style">
                      🗑️
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {/* New Patient Row */}
          <tr>
            <td>
              <input
                type="email"
                value={newPatient.email}
                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                placeholder="Patient Email"
              />
            </td>
            <td>
              <button onClick={handleAddPatient} className="button-style">
                ➕
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PatientsTable;
