import React, { useState, useEffect } from 'react';
import { BASE_API_URL } from '../config';
import './component.css'; // Import the CSS file

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null); // Track the user being edited
  const [newUser, setNewUser] = useState({ email: '', name: '', surname: '', salary: '', phone: '', cname: '' }); // Track new user inputs

  // Fetch users from the backend
  useEffect(() => {
    fetch(`${BASE_API_URL}/api/users/`)
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

// Handle adding a new user
const handleAddUser = () => {
    fetch(`${BASE_API_URL}/api/users/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add user. Please check the form or the backend!');
        }
        return response.json();
      })
      .then(savedUser => {
        setUsers([...users, savedUser]);
        setNewUser({ email: '', name: '', surname: '', salary: '', phone: '', cname: '' }); // Reset new user input
      })
      .catch(error => {
        console.error('Error adding user:', error);
        alert(`Error: ${error.message}`);  // Show pop-up error
      });
  };
  
  // Handle editing an existing user
  const handleEditUser = (updatedUser) => {
    fetch(`${BASE_API_URL}/api/users/${updatedUser.email}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to edit user. Please check the data or the backend!');
        }
        return response.json();
      })
      .then(updated => {
        setUsers(users.map(u => (u.email === updated.email ? updated : u)));
        setEditUser(null); // Exit edit mode
      })
      .catch(error => {
        console.error('Error editing user:', error);
        alert(`Error: ${error.message}`);  // Show pop-up error
      });
  };
  
  // Handle deleting a user
  const handleDeleteUser = (user) => {
    fetch(`${BASE_API_URL}/api/users/${user.email}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete user. Please try again later.');
        }
        setUsers(users.filter(u => u.email !== user.email));
      })
      .catch(error => {
        console.error('Error deleting user:', error);
        alert(`Error: ${error.message}`);  // Show pop-up error
      });
  };
  

  return (
    <div>
      <table className="table table-hover table-bordered">
        <caption className="caption-top">Users table</caption>
        <thead className="table-dark">
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Salary</th>
            <th>Phone</th>
            <th>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.email}>
              {editUser && editUser.email === user.email ? (
                <>
                  <td>
                    <input
                      type="email"
                      value={editUser.email}
                      onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editUser.name}
                      onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editUser.surname}
                      onChange={(e) => setEditUser({ ...editUser, surname: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editUser.salary}
                      onChange={(e) => setEditUser({ ...editUser, salary: parseFloat(e.target.value) })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editUser.phone}
                      onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editUser.cname}
                      onChange={(e) => setEditUser({ ...editUser, cname: e.target.value })}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleEditUser(editUser)} className="button-style">
                      ✔️
                    </button>
                    <button onClick={() => setEditUser(null)} className="button-style">
                      ❌
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.email}</td>
                  <td>{user.name}</td>
                  <td>{user.surname}</td>
                  <td>{user.salary.toLocaleString()}</td>
                  <td>{user.phone}</td>
                  <td>{user.cname}</td>
                  <td>
                    <button onClick={() => setEditUser(user)} className="button-style">
                      ✏️
                    </button>
                    <button onClick={() => handleDeleteUser(user)} className="button-style">
                      🗑️
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {/* New User Row */}
          <tr>
            <td>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Email"
              />
            </td>
            <td>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Name"
              />
            </td>
            <td>
              <input
                type="text"
                value={newUser.surname}
                onChange={(e) => setNewUser({ ...newUser, surname: e.target.value })}
                placeholder="Surname"
              />
            </td>
            <td>
              <input
                type="number"
                value={newUser.salary}
                onChange={(e) => setNewUser({ ...newUser, salary: parseFloat(e.target.value) || '' })}
                placeholder="Salary"
              />
            </td>
            <td>
              <input
                type="text"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                placeholder="Phone"
              />
            </td>
            <td>
              <input
                type="text"
                value={newUser.cname}
                onChange={(e) => setNewUser({ ...newUser, cname: e.target.value })}
                placeholder="Country"
              />
            </td>
            <td>
              <button onClick={handleAddUser} className="button-style">
                ➕
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
