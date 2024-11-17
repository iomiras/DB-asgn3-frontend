import React, { useState, useEffect } from 'react';
import { BASE_API_URL } from '../config';
import './component.css'; // Import the CSS file

const DiscoveriesTable = () => {
  const [discoveries, setDiscoveries] = useState([]);
  const [editDiscovery, setEditDiscovery] = useState(null); // Track the discovery being edited
  const [newDiscovery, setNewDiscovery] = useState({ cname: '', disease_code: '', first_enc_date: '' }); // Track new discovery inputs

  // Fetch discoveries from the backend
  useEffect(() => {
    fetch(`${BASE_API_URL}/api/discoveries/`)
      .then(response => response.json())
      .then(data => setDiscoveries(data))
      .catch(error => {
        console.error('Error fetching discoveries:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  }, []);

  // Handle adding a new discovery
  const handleAddDiscovery = () => {
    fetch(`${BASE_API_URL}/api/discoveries/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDiscovery),
    })
      .then(response => response.json())
      .then(savedDiscovery => {
        setDiscoveries([...discoveries, savedDiscovery]);
        setNewDiscovery({ cname: '', disease_code: '', first_enc_date: '' }); // Reset new discovery input
      })
      .catch(error => {
        console.error('Error adding discovery:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  };

  // Handle editing an existing discovery
  const handleEditDiscovery = (updatedDiscovery) => {
    fetch(`${BASE_API_URL}/api/discoveries/${updatedDiscovery.disease_code}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedDiscovery),
    })
      .then(response => response.json())
      .then(updated => {
        setDiscoveries(discoveries.map(d => (d.disease_code === updated.disease_code ? updated : d)));
        setEditDiscovery(null); // Exit edit mode
      })
      .catch(error => {
        console.error('Error updating discovery:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  };

  // Handle deleting a discovery
  const handleDeleteDiscovery = (discovery) => {
    fetch(`${BASE_API_URL}/api/discoveries/${discovery.disease_code}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setDiscoveries(discoveries.filter(d => d.disease_code !== discovery.disease_code));
        } else {
          console.error('Error deleting discovery:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error deleting discovery:', error);
        alert(`Error: ${error.message}`); // Show pop-up error
      });
  };

  return (
    <div>
      <table className="table table-hover table-bordered">
        <caption className="caption-top">Discoveries Table</caption>
        <thead className="table-dark">
          <tr>
            <th>Country Name</th>
            <th>Disease Code</th>
            <th>First Encounter Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {discoveries.map((discovery) => (
            <tr key={discovery.disease_code}>
              {editDiscovery && editDiscovery.disease_code === discovery.disease_code ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={editDiscovery.cname}
                      onChange={(e) => setEditDiscovery({ ...editDiscovery, cname: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editDiscovery.disease_code}
                      onChange={(e) => setEditDiscovery({ ...editDiscovery, disease_code: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={editDiscovery.first_enc_date}
                      onChange={(e) => setEditDiscovery({ ...editDiscovery, first_enc_date: e.target.value })}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleEditDiscovery(editDiscovery)} className="button-style">
                      ✔️
                    </button>
                    <button onClick={() => setEditDiscovery(null)} className="button-style">
                      ❌
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{discovery.cname}</td>
                  <td>{discovery.disease_code}</td>
                  <td>{discovery.first_enc_date}</td>
                  <td>
                    <button onClick={() => setEditDiscovery(discovery)} className="button-style">
                      ✏️
                    </button>
                    <button onClick={() => handleDeleteDiscovery(discovery)} className="button-style">
                      🗑️
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {/* New Discovery Row */}
          <tr>
            <td>
              <input
                type="text"
                value={newDiscovery.cname}
                onChange={(e) => setNewDiscovery({ ...newDiscovery, cname: e.target.value })}
                placeholder="Country Name"
              />
            </td>
            <td>
              <input
                type="text"
                value={newDiscovery.disease_code}
                onChange={(e) => setNewDiscovery({ ...newDiscovery, disease_code: e.target.value })}
                placeholder="Disease Code"
              />
            </td>
            <td>
              <input
                type="date"
                value={newDiscovery.first_enc_date}
                onChange={(e) => setNewDiscovery({ ...newDiscovery, first_enc_date: e.target.value })}
              />
            </td>
            <td>
              <button onClick={handleAddDiscovery} className="button-style">
                ➕
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DiscoveriesTable;
