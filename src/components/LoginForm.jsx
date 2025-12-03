import { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';

const LoginForm = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const response = await axios.post(
                'https://localhost:7185/api/Auth/Login',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Login Response:', response.data);

            if (response.data.success) {
                // Store token and user data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // Call success callback
                if (onLoginSuccess) {
                    onLoginSuccess(response.data.user);
                }
            }

        } catch (error) {
            console.error('Login Error:', error);
            if (error.response?.status === 401) {
                setErrors({ submit: 'Invalid email or password' });
            } else {
                setErrors({
                    submit: error.response?.data?.message || 'Login failed. Please try again.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Welcome Back</h2>
                <p className="login-subtitle">Login to your account</p>

                {/* Email */}
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? 'error' : ''}
                        placeholder="Enter your email"
                        autoFocus
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                {/* Password */}
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={errors.password ? 'error' : ''}
                            placeholder="Enter your password"
                        />

                    </div>
                    {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                {/* Error Message */}
                {errors.submit && (
                    <div className="error-alert">{errors.submit}</div>
                )}
            </form>
        </div>
    );
};

export default LoginForm;