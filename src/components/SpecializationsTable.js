import React, { useState, useEffect } from 'react';
import { BASE_API_URL } from '../config';
import './component.css'; // Import the CSS file

const SpecializationsTable = () => {
  const [specializations, setSpecializations] = useState([]);
  const [editSpecialization, setEditSpecialization] = useState(null); // Track the specialization being edited
  const [newSpecialization, setNewSpecialization] = useState({ id: '', email: '' }); // Track new specialization inputs

  // Fetch specializations from the backend
  useEffect(() => {
    fetch(`${BASE_API_URL}/api/specializations/`)
      .then(response => response.json())
      .then(data => setSpecializations(data))
      .catch(error => {
        console.error('Error fetching specializations:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  }, []);

  // Handle adding a new specialization
  const handleAddSpecialization = () => {
    fetch(`${BASE_API_URL}/api/specializations/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSpecialization),
    })
      .then(response => response.json())
      .then(savedSpecialization => {
        setSpecializations([...specializations, savedSpecialization]);
        setNewSpecialization({ id: '', email: '' }); // Reset new specialization input
      })
      .catch(error => {
        console.error('Error adding specialization:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  };

  // Handle editing an existing specialization
  const handleEditSpecialization = (updatedSpecialization) => {
    fetch(`${BASE_API_URL}/api/specializations/${updatedSpecialization.id}/${updatedSpecialization.email}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSpecialization),
    })
      .then(response => response.json())
      .then(updated => {
        setSpecializations(specializations.map(s => 
          s.id === updated.id && s.email === updated.email ? updated : s
        ));
        setEditSpecialization(null); // Exit edit mode
      })
      .catch(error => {
        console.error('Error updating specialization:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  };

  // Handle deleting a specialization
  const handleDeleteSpecialization = (specialization) => {
    fetch(`${BASE_API_URL}/api/specializations/${specialization.id}/${specialization.email}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setSpecializations(specializations.filter(s => s.id !== specialization.id || s.email !== specialization.email));
        } else {
          console.error('Error deleting specialization:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error deleting specialization:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  };

  return (
    <div>
      <table className="table table-hover table-bordered">
        <caption className="caption-top">Specializations Table</caption>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {specializations.map((specialization) => (
            <tr key={`${specialization.id}-${specialization.email}`}>
              {editSpecialization && editSpecialization.id === specialization.id && editSpecialization.email === specialization.email ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={editSpecialization.id}
                      onChange={(e) => setEditSpecialization({ ...editSpecialization, id: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      value={editSpecialization.email}
                      onChange={(e) => setEditSpecialization({ ...editSpecialization, email: e.target.value })}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleEditSpecialization(editSpecialization)} className="button-style">
                      ✔️
                    </button>
                    <button onClick={() => setEditSpecialization(null)} className="button-style">
                      ❌
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{specialization.id}</td>
                  <td>{specialization.email}</td>
                  <td>
                    <button onClick={() => setEditSpecialization(specialization)} className="button-style">
                      ✏️
                    </button>
                    <button onClick={() => handleDeleteSpecialization(specialization)} className="button-style">
                      🗑️
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {/* New Specialization Row */}
          <tr>
          <td>
  <input
    type="text"
    value={newSpecialization.id}
    onChange={(e) => {
      console.log('ID before:', newSpecialization.id);
      setNewSpecialization({ ...newSpecialization, id: e.target.value });
      console.log('ID after:', e.target.value);
    }}
    placeholder="ID"
  />
</td>
<td>
  <input
    type="email"
    value={newSpecialization.email}
    onChange={(e) => {
      console.log('Email before:', newSpecialization.email);
      setNewSpecialization({ ...newSpecialization, email: e.target.value });
      console.log('Email after:', e.target.value);
    }}
    placeholder="Email"
  />
</td>

            <td>
              <button onClick={handleAddSpecialization} className="button-style">
                ➕
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SpecializationsTable;
