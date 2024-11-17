import React, { useState, useEffect } from 'react';
import { BASE_API_URL } from '../config';
import './component.css';

const DiseasesTable = () => {
  const [diseases, setDiseases] = useState([]);
  const [editDisease, setEditDisease] = useState(null); // Track the disease being edited
  const [newDisease, setNewDisease] = useState({ disease_code: '', pathogen: '', description: '', id: '' }); // Track new disease inputs

  // Fetch diseases from the backend
  useEffect(() => {
    fetch(`${BASE_API_URL}/api/diseases/`)
      .then(response => response.json())
      .then(data => setDiseases(data))
      .catch(error => {
        console.error('Error fetching diseases:', error);
        alert(`Error: ${error.message}`);
      });
  }, []);

  // Handle adding a new disease
  const handleAddDisease = () => {
    fetch(`${BASE_API_URL}/api/diseases/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDisease),
    })
      .then(response => response.json())
      .then(savedDisease => {
        setDiseases([...diseases, savedDisease]);
        setNewDisease({ disease_code: '', pathogen: '', description: '', id: '' });
      })
      .catch(error => {
        console.error('Error adding disease:', error);
        alert(`Error: ${error.message}`);
      });
  };

  // Handle editing an existing disease
  const handleEditDisease = (updatedDisease) => {
    fetch(`${BASE_API_URL}/api/diseases/${updatedDisease.disease_code}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedDisease),
    })
      .then(response => response.json())
      .then(updated => {
        setDiseases(diseases.map(d => (d.disease_code === updated.disease_code ? updated : d)));
        setEditDisease(null);
      })
      .catch(error => {
        console.error('Error updating disease:', error);
        alert(`Error: ${error.message}`);
      });
  };

  // Handle deleting a disease
  const handleDeleteDisease = (disease) => {
    fetch(`${BASE_API_URL}/api/diseases/${disease.disease_code}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setDiseases(diseases.filter(d => d.disease_code !== disease.disease_code));
        } else {
          console.error('Error deleting disease:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error deleting disease:', error);
        alert(`Error: ${error.message}`);
      });
  };

  return (
    <div>
      <table className="table table-hover table-bordered">
        <caption className="caption-top">Diseases Table</caption>
        <thead className="table-dark">
          <tr>
            <th>Disease Code</th>
            <th>Pathogen</th>
            <th>Description</th>
            <th>ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {diseases.map((disease) => (
            <tr key={disease.disease_code}>
              {editDisease && editDisease.disease_code === disease.disease_code ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={editDisease.disease_code}
                      onChange={(e) => setEditDisease({ ...editDisease, disease_code: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editDisease.pathogen}
                      onChange={(e) => setEditDisease({ ...editDisease, pathogen: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editDisease.description}
                      onChange={(e) => setEditDisease({ ...editDisease, description: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editDisease.id}
                      onChange={(e) => setEditDisease({ ...editDisease, id: e.target.value })}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleEditDisease(editDisease)} className="button-style">
                      ✔️
                    </button>
                    <button onClick={() => setEditDisease(null)} className="button-style">
                      ❌
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{disease.disease_code}</td>
                  <td>{disease.pathogen}</td>
                  <td>{disease.description}</td>
                  <td>{disease.id}</td>
                  <td>
                    <button onClick={() => setEditDisease(disease)} className="button-style">
                      ✏️
                    </button>
                    <button onClick={() => handleDeleteDisease(disease)} className="button-style">
                      🗑️
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {/* New Disease Row */}
          <tr>
            <td>
              <input
                type="text"
                value={newDisease.disease_code}
                onChange={(e) => setNewDisease({ ...newDisease, disease_code: e.target.value })}
                placeholder="Disease Code"
              />
            </td>
            <td>
              <input
                type="text"
                value={newDisease.pathogen}
                onChange={(e) => setNewDisease({ ...newDisease, pathogen: e.target.value })}
                placeholder="Pathogen"
              />
            </td>
            <td>
              <input
                type="text"
                value={newDisease.description}
                onChange={(e) => setNewDisease({ ...newDisease, description: e.target.value })}
                placeholder="Description"
              />
            </td>
            <td>
              <input
                type="text"
                value={newDisease.id}
                onChange={(e) => setNewDisease({ ...newDisease, id: e.target.value })}
                placeholder="ID"
              />
            </td>
            <td>
              <button onClick={handleAddDisease} className="button-style">
                ➕
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DiseasesTable;
