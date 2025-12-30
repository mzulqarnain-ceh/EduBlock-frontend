import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
        registrationNo: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // Password strength calculator
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, text: '', color: '' };
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        if (strength <= 2) return { strength, text: 'Weak', color: 'text-red-400' };
        if (strength <= 3) return { strength, text: 'Medium', color: 'text-yellow-400' };
        return { strength, text: 'Strong', color: 'text-green-400' };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Password validation
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        // Password match validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Name validation
        if (formData.name.trim().length < 3) {
            setError('Name must be at least 3 characters long');
            return;
        }

        setLoading(true);
        setError('');

        // Mock signup - replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setLoading(false);
        setSuccess(true);

        // Redirect to login after 2 seconds
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    };

    return (
        <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-md w-full mx-4"
            >
                <Card>
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">
                            <span className="gradient-text">Sign Up</span>
                        </h1>
                        <p className="text-white/60">Create your EduBlock account</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6 bg-green-500/20 border border-green-500 rounded-lg p-3 text-green-400 text-sm flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Account created successfully! Redirecting to login...
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-2 text-white/80">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="input-field"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2 text-white/80">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your.email@example.com"
                                className="input-field"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium mb-2 text-white/80">
                                Register As
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="student">Student</option>
                                <option value="admin">Institute Admin</option>
                            </select>
                        </div>

                        {formData.role === 'student' && (
                            <div>
                                <label htmlFor="registrationNo" className="block text-sm font-medium mb-2 text-white/80">
                                    Registration Number
                                </label>
                                <input
                                    id="registrationNo"
                                    name="registrationNo"
                                    type="text"
                                    value={formData.registrationNo}
                                    onChange={handleChange}
                                    placeholder="Enter your registration number"
                                    className="input-field"
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2 text-white/80">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                className="input-field"
                                required
                            />
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-white/60">Password Strength:</span>
                                        <span className={`text-xs font-medium ${passwordStrength.color}`}>
                                            {passwordStrength.text}
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${passwordStrength.strength <= 2
                                                    ? 'bg-red-400'
                                                    : passwordStrength.strength <= 3
                                                        ? 'bg-yellow-400'
                                                        : 'bg-green-400'
                                                }`}
                                            style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-white/80">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter your password"
                                className="input-field"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={loading}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-white/60 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                            Login here
                        </Link>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default Signup;
