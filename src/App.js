import React, { useState, useEffect } from 'react';
import './App.css';

import CountriesTable from './components/CountriesTable';
import UsersTable from './components/UsersTable';
import DoctorsTable from './components/DoctorsTable';
import PatientsTable from './components/PatientsTable'
import DiseaseTypesTable from './components/DiseaseTypesTable';
import DiseasesTable from './components/DiseasesTable';
import DiscoveriesTable from './components/DiscoveriesTable';
import SpecializationsTable from './components/SpecializationsTable';
import PublicServantsTable from './components/PublicServantsTable';
import PatientDiseasesTable from './components/PatientDiseases';
import RecordsTable from './components/RecordsTable';

const App = () => {
  // Retrieve the last opened table from localStorage or default to 'doctors'
  const savedTable = localStorage.getItem('activeTable') || 'doctors';
  const [activeTable, setActiveTable] = useState(savedTable);

  useEffect(() => {
    // Save the active table to localStorage whenever it changes
    localStorage.setItem('activeTable', activeTable);
  }, [activeTable]);

  return (
    <div className='body-holder'>
      <div className='table-holder'>
        {/* Button to toggle between tables */}
        <p className="d-inline-flex gap-1">
          <button
            className={`btn btn-primary ${activeTable === 'countries' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTable('countries')}
            disabled={activeTable === 'countries'}
          >
            Country Table
          </button>

          <button
            className={`btn btn-primary ${activeTable === 'users' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTable('users')}
            disabled={activeTable === 'users'}
          >
            Users Table
          </button>

          <button
            className={`btn btn-primary ${activeTable === 'doctors' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTable('doctors')}
            disabled={activeTable === 'doctors'}
          >
            Doctor Table
          </button>

          <button
            className={`btn btn-primary ${activeTable === 'publicServants' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTable('publicServants')}
            disabled={activeTable === 'publicServants'}
          >
            Public Servant Table
          </button>

          <button
            className={`btn btn-primary ${activeTable === 'patients' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTable('patients')}
            disabled={activeTable === 'patients'}
          >
            Patient Table
          </button>

          <button
            className={`btn btn-primary ${activeTable === 'diseaseTypes' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTable('diseaseTypes')}
            disabled={activeTable === 'diseaseTypes'}
          >
            Disease Type Table
          </button>

          <button
            className={`btn btn-primary ${activeTable === 'specializations' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTable('specializations')}
            disabled={activeTable === 'specializations'}
          >
            Specialize Table
          </button>

          <button
            className={`btn btn-primary ${activeTable === 'diseases' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTable('diseases')}
            disabled={activeTable === 'diseases'}
          >
            Disease Table
          </button>

          <button
            className={`btn btn-primary ${activeTable === 'discoveries' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTable('discoveries')}
            disabled={activeTable === 'discoveries'}
          >
            Discover Table
          </button>

          <button
            className={`btn btn-primary ${activeTable === 'patientDiseases' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTable('patientDiseases')}
            disabled={activeTable === 'patientDiseases'}
          >
            Patient Disease Table
          </button>

          <button
            className={`btn btn-primary ${activeTable === 'records' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTable('records')}
            disabled={activeTable === 'records'}
          >
            Record Table
          </button>
        </p>

        {/* Table content */}
        <div className="collapse show" id="collapseExample">
          <div className="card card-body">
            {activeTable === 'countries' && <CountriesTable />}
            {activeTable === 'users' && <UsersTable />}
            {activeTable === 'doctors' && <DoctorsTable />}
            {activeTable === 'patients' && <PatientsTable />}
            {activeTable === 'diseaseTypes' && <DiseaseTypesTable />}
            {activeTable === 'diseases' && <DiseasesTable />}
            {activeTable === 'discoveries' && <DiscoveriesTable />}
            {activeTable === 'specializations' && <SpecializationsTable />}
            {activeTable === 'publicServants' && <PublicServantsTable />}
            {activeTable === 'patientDiseases' && <PatientDiseasesTable />}
            {activeTable === 'records' && <RecordsTable />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
