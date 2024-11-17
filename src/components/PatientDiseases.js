import React, { useState, useEffect } from 'react';
import { BASE_API_URL } from '../config';
import './component.css'; // Import the CSS file

const PatientDiseasesTable = () => {
  const [patientDiseases, setPatientDiseases] = useState([]);
  const [editPatientDisease, setEditPatientDisease] = useState(null); // Track the patient-disease relationship being edited
  const [newPatientDisease, setNewPatientDisease] = useState({ email: '', disease_code: '' }); // Track new patient-disease inputs

  // Fetch patient-disease relationships from the backend
  useEffect(() => {
    fetch(`${BASE_API_URL}/api/patient-diseases/`)
      .then(response => response.json())
      .then(data => setPatientDiseases(data))
      .catch(error => {
        console.error('Error fetching patient diseases:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  }, []);

  // Handle adding a new patient-disease relationship
  const handleAddPatientDisease = () => {
    fetch(`${BASE_API_URL}/api/patient-diseases/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPatientDisease),
    })
      .then(response => response.json())
      .then(savedPatientDisease => {
        setPatientDiseases([...patientDiseases, savedPatientDisease]);
        setNewPatientDisease({ email: '', disease_code: '' }); // Reset new patient-disease input
      })
      .catch(error => {
        console.error('Error adding patient-disease relationship:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  };

  // Handle editing an existing patient-disease relationship
  const handleEditPatientDisease = (updatedPatientDisease) => {
    fetch(`${BASE_API_URL}/api/patient-diseases/${updatedPatientDisease.email}/${updatedPatientDisease.disease_code}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPatientDisease),
    })
      .then(response => response.json())
      .then(updated => {
        setPatientDiseases(patientDiseases.map(pd => 
          pd.email === updated.email && pd.disease_code === updated.disease_code ? updated : pd
        ));
        setEditPatientDisease(null); // Exit edit mode
      })
      .catch(error => {
        console.error('Error updating patient-disease relationship:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  };

  // Handle deleting a patient-disease relationship
  const handleDeletePatientDisease = (patientDisease) => {
    fetch(`${BASE_API_URL}/api/patient-diseases/${patientDisease.email}/${patientDisease.disease_code}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setPatientDiseases(patientDiseases.filter(pd => 
            pd.email !== patientDisease.email || pd.disease_code !== patientDisease.disease_code
          ));
        } else {
          console.error('Error deleting patient-disease relationship:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error deleting patient-disease relationship:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  };

  return (
    <div>
      <table className="table table-hover table-bordered">
        <caption className="caption-top">Patient-Disease Relationships Table</caption>
        <thead className="table-dark">
          <tr>
            <th>Email</th>
            <th>Disease Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patientDiseases.map((patientDisease) => (
            <tr key={`${patientDisease.email}-${patientDisease.disease_code}`}>
              {editPatientDisease && editPatientDisease.email === patientDisease.email && editPatientDisease.disease_code === patientDisease.disease_code ? (
                <>
                  <td>
                    <input
                      type="email"
                      value={editPatientDisease.email}
                      onChange={(e) => setEditPatientDisease({ ...editPatientDisease, email: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editPatientDisease.disease_code}
                      onChange={(e) => setEditPatientDisease({ ...editPatientDisease, disease_code: e.target.value })}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleEditPatientDisease(editPatientDisease)} className="button-style">
                      ✔️
                    </button>
                    <button onClick={() => setEditPatientDisease(null)} className="button-style">
                      ❌
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{patientDisease.email}</td>
                  <td>{patientDisease.disease_code}</td>
                  <td>
                    <button onClick={() => setEditPatientDisease(patientDisease)} className="button-style">
                      ✏️
                    </button>
                    <button onClick={() => handleDeletePatientDisease(patientDisease)} className="button-style">
                      🗑️
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {/* New Patient Disease Row */}
          <tr>
            <td>
              <input
                type="email"
                value={newPatientDisease.email}
                onChange={(e) => setNewPatientDisease({ ...newPatientDisease, email: e.target.value })}
                placeholder="Email"
              />
            </td>
            <td>
              <input
                type="text"
                value={newPatientDisease.disease_code}
                onChange={(e) => setNewPatientDisease({ ...newPatientDisease, disease_code: e.target.value })}
                placeholder="Disease Code"
              />
            </td>
            <td>
              <button onClick={handleAddPatientDisease} className="button-style">
                ➕
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PatientDiseasesTable;
