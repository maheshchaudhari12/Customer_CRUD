import { useState, useEffect } from 'react';
import RegistrationList from './RegistrationList';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="user-info">
                    <h2>Admin Dashboard </h2>
                    <p>{user?.email}</p>
                </div>
                <button onClick={onLogout} className="logout-btn">
                    Logout
                </button>
            </div>
            <RegistrationList isAdmin={true} />
        </div>
    );
};

export default Dashboard;