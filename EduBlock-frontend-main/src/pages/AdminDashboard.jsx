import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

const AdminDashboard = () => {
    const [formData, setFormData] = useState({
        studentName: '',
        studentId: '',
        registrationNumber: '',
        degreeName: '',
        universityName: '',
        grade: '',
        issueDate: '',
        certificateHash: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate blockchain transaction (replace with actual smart contract call)
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setSuccess(true);
            // Generate a mock certificate hash for demonstration
            const mockHash = '0x' + Math.random().toString(16).substr(2, 64);
            setFormData({
                studentName: '',
                studentId: '',
                registrationNumber: '',
                degreeName: '',
                universityName: '',
                grade: '',
                issueDate: '',
                certificateHash: mockHash,
            });
            setTimeout(() => setSuccess(false), 5000);
        } catch (error) {
            console.error('Error issuing certificate:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">
                                Admin <span className="gradient-text">Dashboard</span>
                            </h1>
                            <p className="text-white/60">Issue and manage certificates</p>
                        </div>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 bg-green-500/20 border border-green-500 rounded-lg p-4 flex items-center gap-3"
                        >
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-green-400 font-semibold">Certificate issued successfully on blockchain!</span>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Issue Certificate Form */}
                        <div className="lg:col-span-2">
                            <Card>
                                <h2 className="text-2xl font-bold mb-6">Issue New Certificate</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="studentName" className="block text-sm font-medium mb-2 text-white/80">
                                                Student Name
                                            </label>
                                            <input
                                                id="studentName"
                                                name="studentName"
                                                type="text"
                                                value={formData.studentName}
                                                onChange={handleInputChange}
                                                placeholder="Enter student full name"
                                                className="input-field w-full"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="studentId" className="block text-sm font-medium mb-2 text-white/80">
                                                Student ID
                                            </label>
                                            <input
                                                id="studentId"
                                                name="studentId"
                                                type="text"
                                                value={formData.studentId}
                                                onChange={handleInputChange}
                                                placeholder="e.g., STU-2024-001"
                                                className="input-field w-full"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="registrationNumber" className="block text-sm font-medium mb-2 text-white/80">
                                            Registration Number
                                        </label>
                                        <input
                                            id="registrationNumber"
                                            name="registrationNumber"
                                            type="text"
                                            value={formData.registrationNumber}
                                            onChange={handleInputChange}
                                            placeholder="Enter registration number"
                                            className="input-field w-full"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="degreeName" className="block text-sm font-medium mb-2 text-white/80">
                                            Degree Name
                                        </label>
                                        <input
                                            id="degreeName"
                                            name="degreeName"
                                            type="text"
                                            value={formData.degreeName}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Bachelor of Science in Computer Science"
                                            className="input-field w-full"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="universityName" className="block text-sm font-medium mb-2 text-white/80">
                                            University Name
                                        </label>
                                        <input
                                            id="universityName"
                                            name="universityName"
                                            type="text"
                                            value={formData.universityName}
                                            onChange={handleInputChange}
                                            placeholder="Enter university name"
                                            className="input-field w-full"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="grade" className="block text-sm font-medium mb-2 text-white/80">
                                                Grade / CGPA
                                            </label>
                                            <input
                                                id="grade"
                                                name="grade"
                                                type="text"
                                                value={formData.grade}
                                                onChange={handleInputChange}
                                                placeholder="e.g., A+ or 3.8"
                                                className="input-field w-full"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="issueDate" className="block text-sm font-medium mb-2 text-white/80">
                                                Issue Date
                                            </label>
                                            <input
                                                id="issueDate"
                                                name="issueDate"
                                                type="date"
                                                value={formData.issueDate}
                                                onChange={handleInputChange}
                                                className="input-field w-full"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="certificateHash" className="block text-sm font-medium mb-2 text-white/80">
                                            Certificate Hash / ID
                                        </label>
                                        <input
                                            id="certificateHash"
                                            name="certificateHash"
                                            type="text"
                                            value={formData.certificateHash}
                                            onChange={handleInputChange}
                                            placeholder="Will be auto-generated on blockchain"
                                            className="input-field w-full bg-white/5"
                                            readOnly
                                        />
                                        <p className="text-xs text-white/50 mt-1">This hash will be generated after blockchain transaction</p>
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        loading={loading}
                                        disabled={loading}
                                        className="w-full"
                                    >
                                        {loading ? 'Issuing on Blockchain...' : 'Issue Certificate'}
                                    </Button>
                                </form>
                            </Card>
                        </div>

                        {/* Stats Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <h3 className="text-xl font-bold mb-4">Statistics</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-white/5 rounded-lg">
                                        <p className="text-white/60 text-sm mb-1">Total Issued</p>
                                        <p className="text-3xl font-bold gradient-text">127</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-lg">
                                        <p className="text-white/60 text-sm mb-1">This Month</p>
                                        <p className="text-3xl font-bold text-blue-400">23</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-lg">
                                        <p className="text-white/60 text-sm mb-1">Pending</p>
                                        <p className="text-3xl font-bold text-cyan-400">5</p>
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                                <div className="space-y-3">
                                    {[1, 2, 3].map((_, index) => (
                                        <div key={index} className="p-3 bg-white/5 rounded-lg">
                                            <p className="font-semibold mb-1">Certificate #12{index}</p>
                                            <p className="text-white/60 text-sm">Issued 2 hours ago</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
