import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';
import { openTransactionInExplorer, shortenHash } from '../utils/blockchain';

// Custom Bar Chart Component
const BarChart = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="space-y-3">
            <h4 className="text-sm font-medium text-white/60 mb-4">{title}</h4>
            {data.map((item, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-1"
                >
                    <div className="flex justify-between text-sm">
                        <span className="text-white/70">{item.label}</span>
                        <span className="font-semibold" style={{ color: item.color }}>{item.value}</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.value / maxValue) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, ${item.color}, ${item.colorEnd || item.color})` }}
                        />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

// Custom Donut Chart Component
const DonutChart = ({ data, title, centerValue, centerLabel }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercent = 0;

    const getCoordinatesForPercent = (percent) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    return (
        <div className="flex flex-col items-center">
            <h4 className="text-sm font-medium text-white/60 mb-4">{title}</h4>
            <div className="relative w-48 h-48">
                <svg viewBox="-1.2 -1.2 2.4 2.4" className="w-full h-full transform -rotate-90">
                    {data.map((item, index) => {
                        const percent = item.value / total;
                        const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
                        cumulativePercent += percent;
                        const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
                        const largeArcFlag = percent > 0.5 ? 1 : 0;

                        const pathData = [
                            `M ${startX * 0.6} ${startY * 0.6}`,
                            `L ${startX} ${startY}`,
                            `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                            `L ${endX * 0.6} ${endY * 0.6}`,
                            `A 0.6 0.6 0 ${largeArcFlag} 0 ${startX * 0.6} ${startY * 0.6}`,
                        ].join(' ');

                        return (
                            <motion.path
                                key={index}
                                d={pathData}
                                fill={item.color}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.2, duration: 0.5 }}
                                className="hover:opacity-80 transition-opacity cursor-pointer"
                            />
                        );
                    })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold gradient-text">{centerValue}</span>
                    <span className="text-xs text-white/50">{centerLabel}</span>
                </div>
            </div>
            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2 w-full">
                {data.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center gap-2"
                    >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-white/60">{item.label}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// Stats Card with animated number
const StatsCard = ({ icon, label, value, color, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-amber-500/30 transition-all duration-300 group"
        >
            <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${color}`}>
                    {icon}
                </div>
                <p className="text-white/50 text-sm">{label}</p>
            </div>
            <motion.p
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay + 0.2, type: "spring" }}
                className="text-3xl font-bold gradient-text"
            >
                {value}
            </motion.p>
        </motion.div>
    );
};

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
    const [activeTab, setActiveTab] = useState('issue'); // 'issue' or 'certificates'
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    const [showRevokeModal, setShowRevokeModal] = useState(false);
    const [selectedCert, setSelectedCert] = useState(null);
    const [revokeReason, setRevokeReason] = useState('');

    // Mock issued certificates data
    const [issuedCertificates, setIssuedCertificates] = useState([
        {
            id: 1,
            studentName: 'John Doe',
            studentId: 'STU-2024-001',
            degreeName: 'Computer Science',
            issueDate: '2025-01-15',
            status: 'Issued',
            hash: '0xabcd1234ef567890abcd1234ef567890abcd1234ef567890abcd1234ef567890',
            txHash: '0x7f8c9d2e1a3b4c5f6789abcdef012345678901234567890abcdef01234567890',
        },
        {
            id: 2,
            studentName: 'Jane Smith',
            studentId: 'STU-2024-002',
            degreeName: 'Business Administration',
            issueDate: '2025-01-14',
            status: 'Issued',
            hash: '0xefgh5678ij901234klmn5678opqr9012stuv3456wxyz7890abcd1234efgh5678',
            txHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
        },
        {
            id: 3,
            studentName: 'Mike Johnson',
            studentId: 'STU-2024-003',
            degreeName: 'Electrical Engineering',
            issueDate: '2025-01-13',
            status: 'Pending',
            hash: '0xijkl9012mnop3456qrst7890uvwx1234yz567890abcd1234efgh5678ijkl9012',
            txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        },
        {
            id: 4,
            studentName: 'Sarah Williams',
            studentId: 'STU-2024-004',
            degreeName: 'Data Science',
            issueDate: '2025-01-10',
            status: 'Revoked',
            hash: '0xmnop3456qrst7890uvwx1234yz567890abcd1234efgh5678ijkl9012mnop3456',
            txHash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
            revokeReason: 'Fraudulent application',
        },
    ]);

    // Audit Log Data
    const [auditLog, setAuditLog] = useState([
        { id: 1, action: 'Certificate Issued', user: 'Admin User', target: 'John Smith - Computer Science', timestamp: '2025-01-15 10:30 AM', type: 'success' },
        { id: 2, action: 'Certificate Issued', user: 'Admin User', target: 'Sarah Johnson - Data Science', timestamp: '2025-01-14 03:15 PM', type: 'success' },
        { id: 3, action: 'Certificate Revoked', user: 'Admin User', target: 'Mike Brown - Blockchain Development', timestamp: '2025-01-13 11:45 AM', type: 'warning' },
        { id: 4, action: 'Login', user: 'admin@techuniversity.edu', target: 'Admin Portal', timestamp: '2025-01-15 09:00 AM', type: 'info' },
        { id: 5, action: 'Certificate Issued', user: 'Admin User', target: 'Emily Davis - Web Development', timestamp: '2025-01-12 02:30 PM', type: 'success' },
        { id: 6, action: 'Bulk Import', user: 'Admin User', target: '15 certificates imported', timestamp: '2025-01-11 04:00 PM', type: 'info' },
    ]);

    // Pending Transactions Data
    const [pendingTransactions, setPendingTransactions] = useState([
        { id: 1, studentName: 'Alex Turner', degreeName: 'AI Engineering', txHash: '0xpending123...', status: 'Pending', submittedAt: '2 minutes ago' },
        { id: 2, studentName: 'Jessica Lee', degreeName: 'Cybersecurity', txHash: '0xpending456...', status: 'Processing', submittedAt: '5 minutes ago' },
        { id: 3, studentName: 'David Kim', degreeName: 'Cloud Computing', txHash: '0xpending789...', status: 'Confirming', submittedAt: '10 minutes ago' },
    ]);


    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
    };

    // Filter certificates based on search and status
    const filteredCertificates = issuedCertificates.filter(cert => {
        const matchesSearch =
            cert.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cert.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cert.degreeName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleRevoke = () => {
        if (!selectedCert || !revokeReason.trim()) return;

        setIssuedCertificates(prev => prev.map(cert =>
            cert.id === selectedCert.id
                ? { ...cert, status: 'Revoked', revokeReason: revokeReason }
                : cert
        ));

        showNotification('success', `Certificate for ${selectedCert.studentName} has been revoked.`);
        setShowRevokeModal(false);
        setSelectedCert(null);
        setRevokeReason('');
    };

    // Handle status change
    const handleStatusChange = (certId, newStatus) => {
        setIssuedCertificates(prev => prev.map(cert =>
            cert.id === certId
                ? { ...cert, status: newStatus }
                : cert
        ));
        showNotification('success', `Certificate status changed to ${newStatus}.`);
    };

    // Chart data
    const monthlyData = [
        { label: 'January', value: 45, color: '#fbbf24', colorEnd: '#f59e0b' },
        { label: 'February', value: 38, color: '#10b981', colorEnd: '#059669' },
        { label: 'March', value: 52, color: '#fbbf24', colorEnd: '#10b981' },
        { label: 'April', value: 23, color: '#f59e0b', colorEnd: '#fbbf24' },
        { label: 'May', value: 67, color: '#10b981', colorEnd: '#34d399' },
        { label: 'June', value: 41, color: '#fbbf24', colorEnd: '#f59e0b' },
    ];

    const degreeDistribution = [
        { label: 'Computer Science', value: 45, color: '#fbbf24' },
        { label: 'Engineering', value: 30, color: '#10b981' },
        { label: 'Business', value: 25, color: '#f59e0b' },
        { label: 'Arts', value: 15, color: '#34d399' },
    ];

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
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setSuccess(true);
            const mockHash = '0x' + Math.random().toString(16).substr(2, 64);
            const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);

            // Add to issued certificates
            const newCert = {
                id: Date.now(),
                studentName: formData.studentName,
                studentId: formData.studentId,
                degreeName: formData.degreeName,
                issueDate: formData.issueDate,
                status: 'Issued',
                hash: mockHash,
                txHash: mockTxHash,
            };
            setIssuedCertificates(prev => [newCert, ...prev]);

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

            showNotification('success', 'Certificate issued successfully!');
            setTimeout(() => setSuccess(false), 5000);
        } catch (error) {
            console.error('Error issuing certificate:', error);
            showNotification('error', 'Failed to issue certificate.');
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
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">
                                Admin <span className="gradient-text">Dashboard</span>
                            </h1>
                            <p className="text-white/50">Issue and manage certificates</p>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2 mb-8">
                        <button
                            onClick={() => setActiveTab('issue')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'issue'
                                ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-black'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                                }`}
                        >
                            📝 Issue
                        </button>
                        <button
                            onClick={() => setActiveTab('certificates')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'certificates'
                                ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-black'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                                }`}
                        >
                            📋 Certificates ({issuedCertificates.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'pending'
                                ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-black'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                                }`}
                        >
                            ⏳ Pending ({pendingTransactions.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('audit')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'audit'
                                ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-black'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                                }`}
                        >
                            📊 Audit Log
                        </button>
                    </div>

                    {/* Stats Cards Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <StatsCard icon="📜" label="Total Issued" value={issuedCertificates.length.toString()} color="bg-amber-500/20" delay={0} />
                        <StatsCard icon="📅" label="This Month" value={issuedCertificates.filter(c => c.status === 'Issued').length.toString()} color="bg-emerald-500/20" delay={0.1} />
                        <StatsCard icon="⏳" label="Pending" value={issuedCertificates.filter(c => c.status === 'Pending').length.toString()} color="bg-orange-500/20" delay={0.2} />
                        <StatsCard icon="❌" label="Revoked" value={issuedCertificates.filter(c => c.status === 'Revoked').length.toString()} color="bg-red-500/20" delay={0.3} />
                    </div>

                    {/* Success Message */}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3"
                        >
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-emerald-400 font-semibold">Certificate issued successfully on blockchain!</span>
                        </motion.div>
                    )}

                    {/* Issue Certificate Tab Content */}
                    {activeTab === 'issue' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Issue Certificate Form */}
                            <div className="lg:col-span-2">
                                <Card className="border-white/10 hover:border-amber-500/20">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-emerald-500 rounded-lg flex items-center justify-center">
                                            <span className="text-xl">📝</span>
                                        </div>
                                        <h2 className="text-2xl font-bold">Issue New Certificate</h2>
                                    </div>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="studentName" className="block text-sm font-medium mb-2 text-white/70">
                                                    Student Name
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">👤</span>
                                                    <input
                                                        id="studentName"
                                                        name="studentName"
                                                        type="text"
                                                        value={formData.studentName}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter student full name"
                                                        className="input-field w-full pl-12"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="studentId" className="block text-sm font-medium mb-2 text-white/70">
                                                    Student ID
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">🆔</span>
                                                    <input
                                                        id="studentId"
                                                        name="studentId"
                                                        type="text"
                                                        value={formData.studentId}
                                                        onChange={handleInputChange}
                                                        placeholder="e.g., STU-2024-001"
                                                        className="input-field w-full pl-12"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="registrationNumber" className="block text-sm font-medium mb-2 text-white/70">
                                                Registration Number
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">🔢</span>
                                                <input
                                                    id="registrationNumber"
                                                    name="registrationNumber"
                                                    type="text"
                                                    value={formData.registrationNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter registration number"
                                                    className="input-field w-full pl-12"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="degreeName" className="block text-sm font-medium mb-2 text-white/70">
                                                Degree Name
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">🎓</span>
                                                <input
                                                    id="degreeName"
                                                    name="degreeName"
                                                    type="text"
                                                    value={formData.degreeName}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g., Bachelor of Science in Computer Science"
                                                    className="input-field w-full pl-12"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="universityName" className="block text-sm font-medium mb-2 text-white/70">
                                                University Name
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">🏛️</span>
                                                <input
                                                    id="universityName"
                                                    name="universityName"
                                                    type="text"
                                                    value={formData.universityName}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter university name"
                                                    className="input-field w-full pl-12"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="grade" className="block text-sm font-medium mb-2 text-white/70">
                                                    Grade / CGPA
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">⭐</span>
                                                    <input
                                                        id="grade"
                                                        name="grade"
                                                        type="text"
                                                        value={formData.grade}
                                                        onChange={handleInputChange}
                                                        placeholder="e.g., A+ or 3.8"
                                                        className="input-field w-full pl-12"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="issueDate" className="block text-sm font-medium mb-2 text-white/70">
                                                    Issue Date
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">📅</span>
                                                    <input
                                                        id="issueDate"
                                                        name="issueDate"
                                                        type="date"
                                                        value={formData.issueDate}
                                                        onChange={handleInputChange}
                                                        className="input-field w-full pl-12"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="certificateHash" className="block text-sm font-medium mb-2 text-white/70">
                                                Certificate Hash / ID
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">⛓️</span>
                                                <input
                                                    id="certificateHash"
                                                    name="certificateHash"
                                                    type="text"
                                                    value={formData.certificateHash}
                                                    onChange={handleInputChange}
                                                    placeholder="Will be auto-generated on blockchain"
                                                    className="input-field w-full pl-12 bg-white/5"
                                                    readOnly
                                                />
                                            </div>
                                            <p className="text-xs text-white/40 mt-1">This hash will be generated after blockchain transaction</p>
                                        </div>

                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                            loading={loading}
                                            disabled={loading}
                                            className="w-full"
                                        >
                                            {loading ? (
                                                <span className="flex items-center gap-2">
                                                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Issuing on Blockchain...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    Issue Certificate
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </span>
                                            )}
                                        </Button>
                                    </form>
                                </Card>
                            </div>

                            {/* Charts Sidebar */}
                            <div className="space-y-6">
                                {/* Donut Chart */}
                                <Card className="border-white/10 hover:border-amber-500/20">
                                    <DonutChart
                                        data={degreeDistribution}
                                        title="Certificates by Degree"
                                        centerValue="115"
                                        centerLabel="Total"
                                    />
                                </Card>

                                {/* Bar Chart */}
                                <Card className="border-white/10 hover:border-amber-500/20">
                                    <BarChart
                                        data={monthlyData}
                                        title="Monthly Certificates Issued"
                                    />
                                </Card>

                                {/* Recent Activity */}
                                <Card className="border-white/10 hover:border-amber-500/20">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                            <span className="text-lg">📋</span>
                                        </div>
                                        <h3 className="text-lg font-bold">Recent Activity</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {issuedCertificates.slice(0, 3).map((cert, index) => (
                                            <motion.div
                                                key={cert.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-semibold text-white">{cert.studentName}</p>
                                                        <p className="text-white/40 text-xs">{cert.degreeName}</p>
                                                    </div>
                                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${cert.status === 'Issued' ? 'bg-emerald-500/20 text-emerald-400' :
                                                        cert.status === 'Pending' ? 'bg-orange-500/20 text-orange-400' :
                                                            'bg-red-500/20 text-red-400'
                                                        }`}>
                                                        {cert.status}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* Certificates Tab Content */}
                    {activeTab === 'certificates' && (
                        <Card>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <h2 className="text-2xl font-bold">Issued Certificates</h2>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="Search by name, ID, degree..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="input-field w-64"
                                    />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="input-field w-40"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="Issued">Issued</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Revoked">Revoked</option>
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left py-3 px-4 text-white/80">Student</th>
                                            <th className="text-left py-3 px-4 text-white/80">Degree</th>
                                            <th className="text-left py-3 px-4 text-white/80">Issue Date</th>
                                            <th className="text-left py-3 px-4 text-white/80">Status</th>
                                            <th className="text-left py-3 px-4 text-white/80">Hash</th>
                                            <th className="text-center py-3 px-4 text-white/80">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCertificates.map((cert) => (
                                            <tr key={cert.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-4">
                                                    <p className="font-semibold">{cert.studentName}</p>
                                                    <p className="text-white/50 text-xs">{cert.studentId}</p>
                                                </td>
                                                <td className="py-4 px-4 text-white/70">{cert.degreeName}</td>
                                                <td className="py-4 px-4 text-white/70">{cert.issueDate}</td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cert.status === 'Issued' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                        cert.status === 'Pending' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                                                            'bg-red-500/20 text-red-400 border border-red-500/30'
                                                        }`}>
                                                        {cert.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <p className="text-blue-400 font-mono text-xs">{shortenHash(cert.hash)}</p>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex gap-2 justify-center flex-wrap">
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => openTransactionInExplorer(cert.txHash)}
                                                        >
                                                            🔗 View
                                                        </Button>
                                                        {cert.status !== 'Issued' && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleStatusChange(cert.id, 'Issued')}
                                                                className="border-green-500 text-green-400 hover:bg-green-500/10"
                                                            >
                                                                ✓ Issue
                                                            </Button>
                                                        )}
                                                        {cert.status !== 'Pending' && cert.status !== 'Revoked' && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleStatusChange(cert.id, 'Pending')}
                                                                className="border-orange-500 text-orange-400 hover:bg-orange-500/10"
                                                            >
                                                                ⏳ Pending
                                                            </Button>
                                                        )}
                                                        {cert.status !== 'Revoked' && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedCert(cert);
                                                                    setShowRevokeModal(true);
                                                                }}
                                                                className="border-red-500 text-red-400 hover:bg-red-500/10"
                                                            >
                                                                🚫 Revoke
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredCertificates.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-white/50">No certificates found matching your criteria.</p>
                                </div>
                            )}
                        </Card>
                    )}

                    {/* Pending Transactions Tab */}
                    {activeTab === 'pending' && (
                        <Card>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">⏳ Pending Transactions</h2>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => showNotification('info', 'Refreshing transactions...')}
                                >
                                    🔄 Refresh
                                </Button>
                            </div>

                            {pendingTransactions.length > 0 ? (
                                <div className="space-y-4">
                                    {pendingTransactions.map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.status === 'Pending' ? 'bg-orange-500/20' :
                                                    tx.status === 'Processing' ? 'bg-blue-500/20' :
                                                        'bg-emerald-500/20'
                                                    }`}>
                                                    <span className="text-xl">
                                                        {tx.status === 'Pending' ? '⏳' :
                                                            tx.status === 'Processing' ? '⚙️' : '✓'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{tx.studentName}</p>
                                                    <p className="text-white/50 text-sm">{tx.degreeName}</p>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tx.status === 'Pending' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                                                    tx.status === 'Processing' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                    }`}>
                                                    {tx.status}
                                                </span>
                                                <p className="text-white/40 text-xs mt-1">{tx.submittedAt}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => showNotification('info', 'Checking transaction status...')}
                                                >
                                                    🔍 Check
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-red-500 text-red-400 hover:bg-red-500/10"
                                                    onClick={() => {
                                                        setPendingTransactions(prev => prev.filter(t => t.id !== tx.id));
                                                        showNotification('warning', 'Transaction cancelled');
                                                    }}
                                                >
                                                    ❌ Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <span className="text-4xl mb-4 block">✅</span>
                                    <p className="text-white/50">No pending transactions! All caught up.</p>
                                </div>
                            )}
                        </Card>
                    )}

                    {/* Audit Log Tab */}
                    {activeTab === 'audit' && (
                        <Card>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <h2 className="text-2xl font-bold">📊 Activity / Audit Log</h2>
                                <div className="flex gap-3">
                                    <select className="input-field w-40">
                                        <option value="all">All Actions</option>
                                        <option value="issued">Certificate Issued</option>
                                        <option value="revoked">Certificate Revoked</option>
                                        <option value="login">Login</option>
                                    </select>
                                    <input
                                        type="date"
                                        className="input-field w-40"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                {auditLog.map((log) => (
                                    <div key={log.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <span className={`w-2 h-2 rounded-full ${log.type === 'success' ? 'bg-green-400' :
                                                log.type === 'warning' ? 'bg-orange-400' :
                                                    'bg-blue-400'
                                                }`}></span>
                                            <div>
                                                <p className="font-semibold">{log.action}</p>
                                                <p className="text-white/50 text-sm">{log.target}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white/70 text-sm">{log.user}</p>
                                            <p className="text-white/40 text-xs">{log.timestamp}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center mt-6">
                                <Button variant="outline" size="sm">
                                    Load More
                                </Button>
                            </div>
                        </Card>
                    )}
                </motion.div>
            </div>

            {/* Revoke Certificate Modal */}
            {showRevokeModal && selectedCert && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full"
                    >
                        <Card>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-red-400">Revoke Certificate</h2>
                                <button
                                    onClick={() => {
                                        setShowRevokeModal(false);
                                        setSelectedCert(null);
                                        setRevokeReason('');
                                    }}
                                    className="text-white/60 hover:text-white"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <p className="text-sm text-red-400">⚠️ Warning: This action cannot be undone.</p>
                            </div>

                            <div className="mb-4">
                                <p className="text-white/60 text-sm mb-1">Certificate for:</p>
                                <p className="font-semibold">{selectedCert.studentName}</p>
                                <p className="text-white/50 text-sm">{selectedCert.degreeName}</p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2 text-white/80">
                                    Reason for Revocation *
                                </label>
                                <textarea
                                    value={revokeReason}
                                    onChange={(e) => setRevokeReason(e.target.value)}
                                    placeholder="Enter reason for revoking this certificate..."
                                    className="input-field w-full h-24 resize-none"
                                    required
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => {
                                        setShowRevokeModal(false);
                                        setSelectedCert(null);
                                        setRevokeReason('');
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    className="flex-1 bg-red-500 hover:bg-red-600"
                                    onClick={handleRevoke}
                                    disabled={!revokeReason.trim()}
                                >
                                    Revoke Certificate
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            )}

            {/* Notification Toast */}
            {notification.show && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed top-24 right-4 z-50"
                >
                    <div className={`px-6 py-4 rounded-lg shadow-lg backdrop-blur-lg border ${notification.type === 'success'
                        ? 'bg-green-500/20 border-green-500 text-green-400'
                        : 'bg-red-500/20 border-red-500 text-red-400'
                        } flex items-center gap-3`}>
                        {notification.type === 'success' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        <span className="font-medium">{notification.message}</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default AdminDashboard;
