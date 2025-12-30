import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

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
                            <p className="text-white/50">Issue and manage certificates</p>
                        </div>
                    </div>

                    {/* Stats Cards Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <StatsCard icon="📜" label="Total Issued" value="127" color="bg-amber-500/20" delay={0} />
                        <StatsCard icon="📅" label="This Month" value="23" color="bg-emerald-500/20" delay={0.1} />
                        <StatsCard icon="⏳" label="Pending" value="5" color="bg-orange-500/20" delay={0.2} />
                        <StatsCard icon="✅" label="Verified" value="122" color="bg-green-500/20" delay={0.3} />
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
                                    {[
                                        { id: '127', time: '2 hours ago', status: 'issued', color: 'bg-emerald-500' },
                                        { id: '126', time: '5 hours ago', status: 'verified', color: 'bg-amber-500' },
                                        { id: '125', time: '1 day ago', status: 'issued', color: 'bg-emerald-500' },
                                    ].map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold text-white">Certificate #{item.id}</p>
                                                    <p className="text-white/40 text-xs">{item.time}</p>
                                                </div>
                                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${item.color}/20 text-white`}>
                                                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${item.color} mr-1.5`}></span>
                                                    {item.status}
                                                </div>
                                            </div>
                                        </motion.div>
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
