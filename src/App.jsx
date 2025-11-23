import { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import RegistrationList from './components/RegistrationList';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('list'); // 'form' or 'list'

  return (
    <div className="App">
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          📝 New Registration
        </button>
        <button
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          📋 View All Records
        </button>
      </div>

      {activeTab === 'form' ? <RegistrationForm /> : <RegistrationList />}
    </div>
  );
}

export default App;