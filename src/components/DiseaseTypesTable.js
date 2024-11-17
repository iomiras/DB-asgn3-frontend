import React, { useState, useEffect } from 'react';
import { BASE_API_URL } from '../config';
import './component.css'; // Import the CSS file

const DiseaseTypesTable = () => {
  const [diseaseTypes, setDiseaseTypes] = useState([]);
  const [editDiseaseType, setEditDiseaseType] = useState(null); // Track the disease type being edited
  const [newDiseaseType, setNewDiseaseType] = useState({ id: '', description: '' }); // Track new disease type inputs

  // Fetch disease types from the backend
  useEffect(() => {
    fetch(`${BASE_API_URL}/api/disease-types/`)
      .then(response => response.json())
      .then(data => setDiseaseTypes(data))
      .catch(error => {
        console.error('Error fetching disease types:', error);
        alert(`Error: ${error.message}`);  // Show pop-up error
      });
  }, []);

  // Handle adding a new disease type
  const handleAddDiseaseType = () => {
    fetch(`${BASE_API_URL}/api/disease-types/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDiseaseType),
    })
      .then(response => response.json())
      .then(savedDiseaseType => {
        setDiseaseTypes([...diseaseTypes, savedDiseaseType]);
        setNewDiseaseType({ id: '', description: '' }); // Reset new disease type input
      })
      .catch(error => {
        console.error('Error adding disease type:', error);
        alert(`Error: ${error.message}`);  // Show pop-up error
      });
  };

  // Handle editing an existing disease type
  const handleEditDiseaseType = (updatedDiseaseType) => {
    fetch(`${BASE_API_URL}/api/disease-types/${updatedDiseaseType.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedDiseaseType),
    })
      .then(response => response.json())
      .then(updated => {
        setDiseaseTypes(diseaseTypes.map(d => (d.id === updated.id ? updated : d)));
        setEditDiseaseType(null); // Exit edit mode
      })
      .catch(error => {
        console.error('Error updating disease type:', error);
        alert(`Error: ${error.message}`);  // Show pop-up error
      });
  };

  // Handle deleting a disease type
  const handleDeleteDiseaseType = (diseaseType) => {
    fetch(`${BASE_API_URL}/api/disease-types/${diseaseType.id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setDiseaseTypes(diseaseTypes.filter(d => d.id !== diseaseType.id));
        } else {
          console.error('Error deleting disease type:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error deleting disease type:', error);
        alert(`Error: ${error.message}`);  // Show pop-up error
      });
  };

  return (
    <div>
      <table className="table table-hover table-bordered">
        <caption className="caption-top">Disease Types Table</caption>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {diseaseTypes.map((diseaseType) => (
            <tr key={diseaseType.id}>
              {editDiseaseType && editDiseaseType.id === diseaseType.id ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={editDiseaseType.id}
                      onChange={(e) => setEditDiseaseType({ ...editDiseaseType, id: e.target.value })}
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editDiseaseType.description}
                      onChange={(e) => setEditDiseaseType({ ...editDiseaseType, description: e.target.value })}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleEditDiseaseType(editDiseaseType)} className="button-style">
                      ✔️
                    </button>
                    <button onClick={() => setEditDiseaseType(null)} className="button-style">
                      ❌
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{diseaseType.id}</td>
                  <td>{diseaseType.description}</td>
                  <td>
                    <button onClick={() => setEditDiseaseType(diseaseType)} className="button-style">
                      ✏️
                    </button>
                    <button onClick={() => handleDeleteDiseaseType(diseaseType)} className="button-style">
                      🗑️
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {/* New Disease Type Row */}
          <tr>
            <td>
              <input
                type="text"
                value={newDiseaseType.id}
                onChange={(e) => setNewDiseaseType({ ...newDiseaseType, id: e.target.value })}
                placeholder="ID"
              />
            </td>
            <td>
              <input
                type="text"
                value={newDiseaseType.description}
                onChange={(e) => setNewDiseaseType({ ...newDiseaseType, description: e.target.value })}
                placeholder="Description"
              />
            </td>
            <td>
              <button onClick={handleAddDiseaseType} className="button-style">
                ➕
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DiseaseTypesTable;
