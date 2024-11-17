import React, { useState, useEffect } from 'react';
import { BASE_API_URL } from '../config';
import './component.css'; // Import the CSS file

const DoctorsTable = () => {
  const [doctors, setDoctors] = useState([]);
  const [editDoctor, setEditDoctor] = useState(null); // Track the doctor being edited
  const [newDoctor, setNewDoctor] = useState({ email: '', degree: '' }); // Track new doctor inputs

  // Fetch doctors from the backend
  useEffect(() => {
    fetch(`${BASE_API_URL}/api/doctors/`)
      .then(response => response.json())
      .then(data => setDoctors(data))
      .catch(error => {
        console.error('Error fetching doctors:', error);
        alert(`Error: ${error.message}`);  // Show pop-up error
      });
  }, []);

  // Handle adding a new doctor
  const handleAddDoctor = () => {
    fetch(`${BASE_API_URL}/api/doctors/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDoctor),
    })
      .then(response => response.json())
      .then(savedDoctor => {
        setDoctors([...doctors, savedDoctor]);
        setNewDoctor({ email: '', degree: '' }); // Reset new doctor input
      })
      .catch(error => {
        console.error('Error adding doctor:', error);
        alert(`Error: ${error.message}`);  // Show pop-up error
      });
  };

  // Handle editing an existing doctor
  const handleEditDoctor = (updatedDoctor) => {
    fetch(`${BASE_API_URL}/api/doctors/${updatedDoctor.email}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedDoctor),
    })
      .then(response => response.json())
      .then(updated => {
        setDoctors(doctors.map(d => (d.email === updated.email ? updated : d)));
        setEditDoctor(null); // Exit edit mode
      })
      .catch(error => {
        console.error('Error updating doctor:', error);
        alert(`Error: ${error.message}`);  // Show pop-up error
      });
  };

  // Handle deleting a doctor
  const handleDeleteDoctor = (doctor) => {
    fetch(`${BASE_API_URL}/api/doctors/${doctor.email}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setDoctors(doctors.filter(d => d.email !== doctor.email));
        } else {
          console.error('Error deleting doctor:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error deleting doctor:', error);
        alert(`Error: ${error.message}`);  // Show pop-up error
      });
  };

  return (
    <div>
      <table className="table table-hover table-bordered">
        <caption className="caption-top">Doctors Table</caption>
        <thead className="table-dark">
          <tr>
            <th>Email</th>
            <th>Degree</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.email}>
              {editDoctor && editDoctor.email === doctor.email ? (
                <>
                  <td>
                    <input
                      type="email"
                      value={editDoctor.email}
                      onChange={(e) => setEditDoctor({ ...editDoctor, email: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editDoctor.degree}
                      onChange={(e) => setEditDoctor({ ...editDoctor, degree: e.target.value })}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleEditDoctor(editDoctor)} className="button-style">
                      ✔️
                    </button>
                    <button onClick={() => setEditDoctor(null)} className="button-style">
                      ❌
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{doctor.email}</td>
                  <td>{doctor.degree}</td>
                  <td>
                    <button onClick={() => setEditDoctor(doctor)} className="button-style">
                      ✏️
                    </button>
                    <button onClick={() => handleDeleteDoctor(doctor)} className="button-style">
                      🗑️
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {/* New Doctor Row */}
          <tr>
            <td>
              <input
                type="email"
                value={newDoctor.email}
                onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                placeholder="Email"
              />
            </td>
            <td>
              <input
                type="text"
                value={newDoctor.degree}
                onChange={(e) => setNewDoctor({ ...newDoctor, degree: e.target.value })}
                placeholder="Degree"
              />
            </td>
            <td>
              <button onClick={handleAddDoctor} className="button-style">
                ➕
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DoctorsTable;
