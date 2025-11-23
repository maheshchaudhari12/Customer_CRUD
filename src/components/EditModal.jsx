import { useState, useEffect } from 'react';
import axios from 'axios';
import './EditModal.css';

const EditModal = ({ registration, onClose, onSuccess, apiUrl }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        gender: '',
        state: '',
        city: '',
        preferences: []
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const states = [
        'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu',
        'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal'
    ];

    const cities = {
        Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
        Delhi: ['New Delhi', 'North Delhi', 'South Delhi'],
        Karnataka: ['Bangalore', 'Mysore', 'Mangalore'],
        'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
        Gujarat: ['Ahmedabad', 'Surat', 'Vadodara'],
        Rajasthan: ['Jaipur', 'Udaipur', 'Jodhpur'],
        'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra'],
        'West Bengal': ['Kolkata', 'Siliguri', 'Durgapur']
    };

    const propertyPreferences = [
        { id: '1bhk', label: '1 BHK' },
        { id: '2bhk', label: '2 BHK' },
        { id: '3bhk', label: '3 BHK' },
        { id: '4bhk', label: '4 BHK' },
        { id: 'rk', label: 'RK' },
        { id: 'rowhouse', label: 'Row House' }
    ];

    useEffect(() => {
        if (registration) {
            setFormData({
                name: registration.name,
                email: registration.email,
                gender: registration.gender,
                state: registration.state,
                city: registration.city,
                preferences: registration.preferences || []
            });
        }
    }, [registration]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'state' && { city: '' })
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            preferences: checked
                ? [...prev.preferences, value]
                : prev.preferences.filter(pref => pref !== value)
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (formData.preferences.length === 0) {
            newErrors.preferences = 'Select at least one preference';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await axios.put(
                `${apiUrl}/${registration.id}`,
                formData,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            // Fetch updated record
            const updatedResponse = await axios.get(`${apiUrl}/${registration.id}`);
            onSuccess(updatedResponse.data);
            alert('Registration updated successfully!');
        } catch (error) {
            console.error('Error updating registration:', error);
            if (error.response?.status === 409) {
                setErrors({ submit: 'Email already registered!' });
            } else {
                setErrors({
                    submit: error.response?.data?.message || 'Update failed. Please try again.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Registration</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="edit-form">
                    {/* Name */}
                    <div className="form-group">
                        <label htmlFor="name">Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={errors.name ? 'error' : ''}
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    {/* Gender */}
                    <div className="form-group">
                        <label>Gender *</label>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={formData.gender === 'male'}
                                    onChange={handleInputChange}
                                />
                                Male
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={formData.gender === 'female'}
                                    onChange={handleInputChange}
                                />
                                Female
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="other"
                                    checked={formData.gender === 'other'}
                                    onChange={handleInputChange}
                                />
                                Other
                            </label>
                        </div>
                        {errors.gender && <span className="error-message">{errors.gender}</span>}
                    </div>

                    {/* State */}
                    <div className="form-group">
                        <label htmlFor="state">State *</label>
                        <select
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className={errors.state ? 'error' : ''}
                        >
                            <option value="">Select State</option>
                            {states.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                        {errors.state && <span className="error-message">{errors.state}</span>}
                    </div>

                    {/* City */}
                    <div className="form-group">
                        <label htmlFor="city">City *</label>
                        <select
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className={errors.city ? 'error' : ''}
                            disabled={!formData.state}
                        >
                            <option value="">Select City</option>
                            {formData.state && cities[formData.state]?.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        {errors.city && <span className="error-message">{errors.city}</span>}
                    </div>

                    {/* Preferences */}
                    <div className="form-group">
                        <label>Property Preferences *</label>
                        <div className="checkbox-group">
                            {propertyPreferences.map(pref => (
                                <label key={pref.id} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        value={pref.id}
                                        checked={formData.preferences.includes(pref.id)}
                                        onChange={handleCheckboxChange}
                                    />
                                    {pref.label}
                                </label>
                            ))}
                        </div>
                        {errors.preferences && <span className="error-message">{errors.preferences}</span>}
                    </div>

                    {errors.submit && (
                        <div className="error-alert">{errors.submit}</div>
                    )}

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="btn-save" disabled={loading}>
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditModal;