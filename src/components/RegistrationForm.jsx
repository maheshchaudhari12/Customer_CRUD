import { useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css';

const RegistrationForm = () => {
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
    const [successMessage, setSuccessMessage] = useState('');

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

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Reset city when state changes
            ...(name === 'state' && { city: '' })
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Handle checkbox changes
    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            preferences: checked
                ? [...prev.preferences, value]
                : prev.preferences.filter(pref => pref !== value)
        }));
        // Clear error for preferences
        if (errors.preferences) {
            setErrors(prev => ({ ...prev, preferences: '' }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.gender) {
            newErrors.gender = 'Gender is required';
        }

        if (!formData.state) {
            newErrors.state = 'State is required';
        }

        if (!formData.city) {
            newErrors.city = 'City is required';
        }

        if (formData.preferences.length === 0) {
            newErrors.preferences = 'Select at least one preference';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                'https://localhost:7185/api/Registration', // Replace with your API port
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Response:', response.data);
            setSuccessMessage('Registration successful! Switch to "View All Records" to see it.');

            // Reset form
            setFormData({
                name: '',
                email: '',
                gender: '',
                state: '',
                city: '',
                preferences: []
            });

        } catch (error) {
            console.error('Error:', error);
            if (error.response?.status === 409) {
                setErrors({ submit: 'Email already registered!' });
            } else {
                setErrors({
                    submit: error.response?.data?.message || 'Registration failed. Please try again.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registration-container">
            <form className="registration-form" onSubmit={handleSubmit}>
                <h2>Registration Form</h2>

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
                        placeholder="Enter your name"
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
                        placeholder="Enter your email"
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

                {/* Submit Button */}
                <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>

                {/* Success/Error Messages */}
                {successMessage && (
                    <div className="success-message">{successMessage}</div>
                )}
                {errors.submit && (
                    <div className="error-message">{errors.submit}</div>
                )}
            </form>
        </div>
    );
};

export default RegistrationForm;