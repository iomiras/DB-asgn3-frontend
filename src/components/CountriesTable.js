import React, { useState, useEffect } from 'react';
import { BASE_API_URL } from '../config';
import './component.css'; // Import the CSS file

const CountriesTable = () => {
  const [countries, setCountries] = useState([]);
  const [editCountry, setEditCountry] = useState(null); // Track the country being edited
  const [newCountry, setNewCountry] = useState({ cname: '', population: '' }); // Track new country inputs

  // Fetch countries from the backend
  useEffect(() => {
    fetch(`${BASE_API_URL}/api/countries/`)
      .then(response => response.json())
      .then(data => setCountries(data))
      .catch(error => {
        console.error('Error fetching countries:', error);
        alert(`Error: ${error.message}`);  // Show pop-up error
      });
  }, []);

  // Handle adding a new country
  const handleAddCountry = () => {
    fetch(`${BASE_API_URL}/api/countries/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCountry),
    })
      .then(response => response.json())
      .then(savedCountry => {
        setCountries([...countries, savedCountry]);
        setNewCountry({ cname: '', population: '' }); // Reset new country input
      })
      .catch(error => {
        console.error('Error adding country:', error)
        alert(`Error: ${error.message}`);  // Show pop-up error
      });
  };

  // Handle editing an existing country
  const handleEditCountry = (updatedCountry) => {
    fetch(`${BASE_API_URL}/api/countries/${updatedCountry.cname}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCountry),
    })
      .then(response => response.json())
      .then(updated => {
        setCountries(countries.map(c => (c.cname === updated.cname ? updated : c)));
        setEditCountry(null); // Exit edit mode
      })
      .catch(error => {
        console.error('Error updating country:', error);
        alert(`Error: ${error.message}`);  // Show pop-up error
      });
  };

  // Handle deleting a country
  const handleDeleteCountry = (country) => {
    fetch(`${BASE_API_URL}/api/countries/${country.cname}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setCountries(countries.filter(c => c.cname !== country.cname));
        } else {
          console.error('Error deleting country:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error deleting user:', error);
        alert(`Error: ${error.message}`);  // Show pop-up error
      });
  };

  return (
    <div>
      <table className="table table-hover table-bordered">
        <caption className="caption-top">Countries table</caption>
        <thead className="table-dark">
          <tr>
            <th>Country Name</th>
            <th>Population</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country) => (
            <tr key={country.cname}>
              {editCountry && editCountry.cname === country.cname ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={editCountry.cname}
                      onChange={(e) => setEditCountry({ ...editCountry, cname: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editCountry.population}
                      onChange={(e) => setEditCountry({ ...editCountry, population: parseInt(e.target.value) })}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleEditCountry(editCountry)} className="button-style">
                      ✔️
                    </button>
                    <button onClick={() => setEditCountry(null)} className="button-style">
                      ❌
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{country.cname}</td>
                  <td>{country.population.toLocaleString()}</td>
                  <td>
                    <button onClick={() => setEditCountry(country)} className="button-style">
                      ✏️
                    </button>
                    <button onClick={() => handleDeleteCountry(country)} className="button-style">
                      🗑️
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {/* New Country Row */}
          <tr>
            <td>
              <input
                type="text"
                value={newCountry.cname}
                onChange={(e) => setNewCountry({ ...newCountry, cname: e.target.value })}
                placeholder="Country Name"
              />
            </td>
            <td>
              <input
                type="number"
                value={newCountry.population}
                onChange={(e) => setNewCountry({ ...newCountry, population: parseInt(e.target.value) || '' })}
                placeholder="Population"
              />
            </td>
            <td>
              <button onClick={handleAddCountry} className="button-style">
                ➕
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CountriesTable;