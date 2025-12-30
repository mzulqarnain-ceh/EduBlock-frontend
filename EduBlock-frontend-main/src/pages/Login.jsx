import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'student', // student, admin, superadmin
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Test accounts with proper validation
    const validAccounts = [
        { email: 'super@admin.com', password: 'test', role: 'superadmin', name: 'Super Admin' },
        { email: 'superadmin@edublock.com', password: 'admin123', role: 'superadmin', name: 'Super Admin' },
        { email: 'admin@test.com', password: 'test', role: 'admin', name: 'Institute Admin' },
        { email: 'admin@university.edu', password: 'admin123', role: 'admin', name: 'Institute Admin' },
        { email: 'student@test.com', password: 'test', role: 'student', name: 'Student User' },
        { email: 'student@example.com', password: 'student123', role: 'student', name: 'Student User' },
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Mock authentication delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Validate credentials against test accounts
        const matchedAccount = validAccounts.find(
            acc => acc.email === formData.email && acc.password === formData.password
        );

        if (!matchedAccount) {
            setError('Invalid email or password!');
            setLoading(false);
            return;
        }

        // Check if selected role matches account role
        if (matchedAccount.role !== formData.role) {
            setError('Invalid credentials! Please check your email, password, and role selection.');
            setLoading(false);
            return;
        }

        // Create user data from matched account
        const mockUser = {
            email: matchedAccount.email,
            role: matchedAccount.role,
            name: matchedAccount.name,
        };

        // Store in localStorage and call parent handler
        localStorage.setItem('user', JSON.stringify(mockUser));
        if (onLogin) onLogin(mockUser);

        setLoading(false);

        // Redirect based on role
        if (matchedAccount.role === 'superadmin') {
            navigate('/superadmin');
        } else if (matchedAccount.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/student');
        }
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
                            <span className="gradient-text">Login</span>
                        </h1>
                        <p className="text-white/60">Access your EduBlock account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                            <label htmlFor="password" className="block text-sm font-medium mb-2 text-white/80">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="input-field"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium mb-2 text-white/80">
                                Login As
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
                                <option value="superadmin">Super Admin</option>
                            </select>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/20 border border-red-500 rounded-lg p-3 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-red-400 text-sm font-medium">{error}</span>
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={loading}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-white/60 text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-400 hover:text-blue-300 transition-colors">
                            Sign up here
                        </Link>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default Login;
