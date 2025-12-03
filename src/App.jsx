import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      setIsAuthenticated(true);

      if (user.role === 'Admin') {
        setCurrentView('admin-dashboard');
      } else {
        setCurrentView('user-profile');
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);

    if (user.role === 'Admin') {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('user-profile');
    }
  };

  const handleRegistrationSuccess = () => {
    setCurrentView('login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('login');
  };

  // Admin Dashboard View
  if (isAuthenticated && currentUser?.role === 'Admin' && currentView === 'admin-dashboard') {
    return <Dashboard user={currentUser} onLogout={handleLogout} />;
  }

  // User Profile View
  if (isAuthenticated && currentUser?.role === 'User' && currentView === 'user-profile') {
    return <UserProfile user={currentUser} onLogout={handleLogout} />;
  }

  // Login/Register Views
  return (
    <div className="App">
      {currentView === 'login' ? (
        <div className="auth-wrapper">
          <LoginForm onLoginSuccess={handleLoginSuccess} />
          <div className="auth-switch">
            <p>Don't have an account?</p>
            <button
              onClick={() => setCurrentView('register')}
              className="switch-btn"
            >
              Create Account
            </button>
          </div>
        </div>
      ) : (
        <div className="auth-wrapper">
          <RegistrationForm onRegistrationSuccess={handleRegistrationSuccess} />
          <div className="auth-switch">
            <p>Already have an account?</p>
            <button
              onClick={() => setCurrentView('login')}
              className="switch-btn"
            >
              Login Here
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;