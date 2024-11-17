import React, { useState, useEffect } from 'react';
import { BASE_API_URL } from '../config';
import './component.css'; // Import the CSS file

const PublicServantsTable = () => {
  const [publicServants, setPublicServants] = useState([]);
  const [editPublicServant, setEditPublicServant] = useState(null); // Track the public servant being edited
  const [newPublicServant, setNewPublicServant] = useState({ email: '', department: '' }); // Track new public servant inputs

  // Fetch public servants from the backend
  useEffect(() => {
    fetch(`${BASE_API_URL}/api/public-servants/`)
      .then(response => response.json())
      .then(data => setPublicServants(data))
      .catch(error => {
        console.error('Error fetching public servants:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  }, []);

  // Handle adding a new public servant
  const handleAddPublicServant = () => {
    fetch(`${BASE_API_URL}/api/public-servants/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPublicServant),
    })
      .then(response => response.json())
      .then(savedPublicServant => {
        setPublicServants([...publicServants, savedPublicServant]);
        setNewPublicServant({ email: '', department: '' }); // Reset new public servant input
      })
      .catch(error => {
        console.error('Error adding public servant:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  };

  // Handle editing an existing public servant
  const handleEditPublicServant = (updatedPublicServant) => {
    fetch(`${BASE_API_URL}/api/public-servants/${updatedPublicServant.email}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPublicServant),
    })
      .then(response => response.json())
      .then(updated => {
        setPublicServants(publicServants.map(s => 
          s.email === updated.email ? updated : s
        ));
        setEditPublicServant(null); // Exit edit mode
      })
      .catch(error => {
        console.error('Error updating public servant:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  };

  // Handle deleting a public servant
  const handleDeletePublicServant = (publicServant) => {
    fetch(`${BASE_API_URL}/api/public-servants/${publicServant.email}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setPublicServants(publicServants.filter(s => s.email !== publicServant.email));
        } else {
          console.error('Error deleting public servant:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error deleting public servant:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  };

  return (
    <div>
      <table className="table table-hover table-bordered">
        <caption className="caption-top">Public Servants Table</caption>
        <thead className="table-dark">
          <tr>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {publicServants.map((publicServant) => (
            <tr key={publicServant.email}>
              {editPublicServant && editPublicServant.email === publicServant.email ? (
                <>
                  <td>
                    <input
                      type="email"
                      value={editPublicServant.email}
                      onChange={(e) => setEditPublicServant({ ...editPublicServant, email: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editPublicServant.department}
                      onChange={(e) => setEditPublicServant({ ...editPublicServant, department: e.target.value })}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleEditPublicServant(editPublicServant)} className="button-style">
                      ✔️
                    </button>
                    <button onClick={() => setEditPublicServant(null)} className="button-style">
                      ❌
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{publicServant.email}</td>
                  <td>{publicServant.department}</td>
                  <td>
                    <button onClick={() => setEditPublicServant(publicServant)} className="button-style">
                      ✏️
                    </button>
                    <button onClick={() => handleDeletePublicServant(publicServant)} className="button-style">
                      🗑️
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {/* New Public Servant Row */}
          <tr>
            <td>
              <input
                type="email"
                value={newPublicServant.email}
                onChange={(e) => setNewPublicServant({ ...newPublicServant, email: e.target.value })}
                placeholder="Email"
              />
            </td>
            <td>
              <input
                type="text"
                value={newPublicServant.department}
                onChange={(e) => setNewPublicServant({ ...newPublicServant, department: e.target.value })}
                placeholder="Department"
              />
            </td>
            <td>
              <button onClick={handleAddPublicServant} className="button-style">
                ➕
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PublicServantsTable;
