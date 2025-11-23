import { useState, useEffect } from 'react';
import axios from 'axios';
import EditModal from './EditModal';
import DeleteConfirmation from './DeleteConfirmation';
import './RegistrationList.css';

const RegistrationList = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editItem, setEditItem] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const API_URL = 'https://localhost:7185/api/Registration';

    // Fetch all registrations
    const fetchRegistrations = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(API_URL);
            setRegistrations(response.data);
        } catch (err) {
            console.error('Error fetching registrations:', err);
            setError('Failed to fetch registrations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    // Handle delete
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setRegistrations(registrations.filter(reg => reg.id !== id));
            setDeleteItem(null);
            // Show success message (optional)
            alert('Registration deleted successfully!');
        } catch (err) {
            console.error('Error deleting registration:', err);
            alert('Failed to delete registration. Please try again.');
        }
    };

    // Handle edit success
    const handleEditSuccess = (updatedRegistration) => {
        setRegistrations(registrations.map(reg =>
            reg.id === updatedRegistration.id ? updatedRegistration : reg
        ));
        setEditItem(null);
    };

    // Filter registrations based on search
    const filteredRegistrations = registrations.filter(reg =>
        reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.state.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="registration-list-container">
            <div className="list-header">
                <h2>Registration Records</h2>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by name, email, city, or state..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button onClick={fetchRegistrations} className="refresh-btn">
                        Refresh
                    </button>
                </div>
            </div>

            {loading && (
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading registrations...</p>
                </div>
            )}

            {error && <div className="error-alert">{error}</div>}

            {!loading && !error && (
                <>
                    <div className="table-info">
                        <p>Total Records: <strong>{filteredRegistrations.length}</strong></p>
                    </div>

                    {filteredRegistrations.length === 0 ? (
                        <div className="no-data">
                            <p>No registrations found.</p>
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table className="registration-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Gender</th>
                                        <th>State</th>
                                        <th>City</th>
                                        <th>Preferences</th>
                                        <th>Created At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRegistrations.map((registration) => (
                                        <tr key={registration.id}>
                                            <td>{registration.id}</td>
                                            <td>{registration.name}</td>
                                            <td>{registration.email}</td>
                                            <td>
                                                <span className="gender-badge">
                                                    {registration.gender}
                                                </span>
                                            </td>
                                            <td>{registration.state}</td>
                                            <td>{registration.city}</td>
                                            <td>
                                                <div className="preferences-list">
                                                    {registration.preferences.map((pref, index) => (
                                                        <span key={index} className="preference-tag">
                                                            {pref}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>{new Date(registration.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        onClick={() => setEditItem(registration)}
                                                        className="btn-edit"
                                                        title="Edit"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteItem(registration)}
                                                        className="btn-delete"
                                                        title="Delete"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* Edit Modal */}
            {editItem && (
                <EditModal
                    registration={editItem}
                    onClose={() => setEditItem(null)}
                    onSuccess={handleEditSuccess}
                    apiUrl={API_URL}
                />
            )}

            {/* Delete Confirmation */}
            {deleteItem && (
                <DeleteConfirmation
                    registration={deleteItem}
                    onConfirm={() => handleDelete(deleteItem.id)}
                    onCancel={() => setDeleteItem(null)}
                />
            )}
        </div>
    );
};

export default RegistrationList;