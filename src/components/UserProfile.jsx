import { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = ({ user, onLogout }) => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(
                `https://localhost:7185/api/Registration/${user.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setProfileData(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="user-profile-container">
            <div className="profile-header">
                <h1>My Profile</h1>
                <button onClick={onLogout} className="logout-btn">
                    Logout
                </button>
            </div>

            <div className="profile-content">
                <div className="profile-card">
                    <div className="profile-avatar">
                        <div className="avatar-circle">
                            {profileData?.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    <div className="profile-info">
                        <h2>{profileData?.name}</h2>
                        <p className="profile-email">{profileData?.email}</p>
                        <span className="profile-role">User</span>
                    </div>

                    <div className="profile-details">
                        <div className="detail-row">
                            <span className="detail-label">Gender</span>
                            <span className="detail-value">{profileData?.gender}</span>
                        </div>

                        <div className="detail-row">
                            <span className="detail-label">State</span>
                            <span className="detail-value">{profileData?.state}</span>
                        </div>

                        <div className="detail-row">
                            <span className="detail-label">City</span>
                            <span className="detail-value">{profileData?.city}</span>
                        </div>

                        <div className="detail-row">
                            <span className="detail-label">Property Preferences</span>
                            <div className="preferences-display">
                                {profileData?.preferences?.map((pref, index) => (
                                    <span key={index} className="pref-badge">
                                        {pref.toUpperCase()}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="detail-row">
                            <span className="detail-label">Member Since</span>
                            <span className="detail-value">
                                {new Date(profileData?.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>

                        {profileData?.lastLoginAt && (
                            <div className="detail-row">
                                <span className="detail-label">Last Login</span>
                                <span className="detail-value">
                                    {new Date(profileData?.lastLoginAt).toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="profile-actions">
                        <button
                            className="change-password-btn"
                            onClick={() => setShowPasswordModal(true)}
                        >
                            Change Password
                        </button>
                    </div>
                </div>

                <div className="profile-stats">
                    <div className="stat-card">
                        <div className="stat-icon">📧</div>
                        <div className="stat-info">
                            <h3>Email Verified</h3>
                            <p>{profileData?.email}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">📍</div>
                        <div className="stat-info">
                            <h3>Location</h3>
                            <p>{profileData?.city}, {profileData?.state}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🏠</div>
                        <div className="stat-info">
                            <h3>Preferences</h3>
                            <p>{profileData?.preferences?.length} Properties</p>
                        </div>
                    </div>
                </div>
            </div>

            {showPasswordModal && (
                <ChangePasswordModal
                    userId={user.id}
                    onClose={() => setShowPasswordModal(false)}
                />
            )}
        </div>
    );
};

// Change Password Modal Component
const ChangePasswordModal = ({ userId, onClose }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.currentPassword) newErrors.currentPassword = 'Required';
        if (!formData.newPassword) newErrors.newPassword = 'Required';
        if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Must be at least 6 characters';
        }
        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                `https://localhost:7185/api/Auth/ChangePassword/${userId}`,
                {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            setErrors({
                submit: error.response?.data?.message || 'Failed to change password'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="password-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Change Password</h3>
                {success ? (
                    <div className="success-message">Password changed successfully!</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className={errors.currentPassword ? 'error' : ''}
                            />
                            {errors.currentPassword && (
                                <span className="error-message">{errors.currentPassword}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className={errors.newPassword ? 'error' : ''}
                            />
                            {errors.newPassword && (
                                <span className="error-message">{errors.newPassword}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={errors.confirmPassword ? 'error' : ''}
                            />
                            {errors.confirmPassword && (
                                <span className="error-message">{errors.confirmPassword}</span>
                            )}
                        </div>

                        {errors.submit && (
                            <div className="error-alert">{errors.submit}</div>
                        )}

                        <div className="modal-actions">
                            <button type="button" onClick={onClose} className="btn-cancel">
                                Cancel
                            </button>
                            <button type="submit" className="btn-save" disabled={loading}>
                                {loading ? 'Changing...' : 'Change Password'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UserProfile;