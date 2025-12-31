import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

const SuperAdminDashboard = () => {
    const [universities, setUniversities] = useState([
        { id: 1, name: 'Tech University', email: 'admin@techuni.edu', status: 'Active', students: 1245 },
        { id: 2, name: 'Science Institute', email: 'admin@sciinst.edu', status: 'Active', students: 890 },
        { id: 3, name: 'Arts College', email: 'admin@artscol.edu', status: 'Inactive', students: 456 },
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    const [activeTab, setActiveTab] = useState('universities'); // universities, users, deployment

    // User Management State
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'student@test.com', role: 'student', status: 'Active', lastLogin: '2025-01-15 10:30 AM', selected: false },
        { id: 2, name: 'Jane Smith', email: 'student@example.com', role: 'student', status: 'Active', lastLogin: '2025-01-14 03:20 PM', selected: false },
        { id: 3, name: 'Institute Admin', email: 'admin@test.com', role: 'admin', status: 'Active', lastLogin: '2025-01-15 09:15 AM', selected: false },
        { id: 4, name: 'Mike Johnson', email: 'mike@university.edu', role: 'admin', status: 'Inactive', lastLogin: '2025-01-10 02:45 PM', selected: false },
        { id: 5, name: 'Sarah Williams', email: 'sarah@student.edu', role: 'student', status: 'Suspended', lastLogin: '2025-01-05 11:20 AM', selected: false },
    ]);
    const [userSearch, setUserSearch] = useState('');
    const [userRoleFilter, setUserRoleFilter] = useState('all');
    const [userStatusFilter, setUserStatusFilter] = useState('all');

    // Blockchain/Smart Contract Settings
    const [blockchainSettings, setBlockchainSettings] = useState({
        network: 'Sepolia Testnet',
        contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f28aBc',
        chainId: '11155111',
        gasPrice: '25',
        blockNumber: '4,892,341',
        connectionStatus: 'Connected',
        lastSync: '2025-01-15 12:30:00',
        transactionsPending: 3,
        transactionsConfirmed: 2847,
    });

    // System Analytics
    const [analytics, setAnalytics] = useState({
        totalCertificates: 2891,
        thisMonth: 234,
        verifications: 1456,
        activeUsers: 3247,
    });

    const [newUniversity, setNewUniversity] = useState({
        name: '',
        email: '',
        adminName: '',
        password: '',
    });

    const [editUniversity, setEditUniversity] = useState({
        id: null,
        name: '',
        email: '',
        status: 'Active',
    });

    const [roleAssignment, setRoleAssignment] = useState({
        userName: '',
        userEmail: '',
        role: 'viewer',
    });

    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
    };

    const handleAddUniversity = (e) => {
        e.preventDefault();
        // Use timestamp for unique ID to avoid conflicts
        const newUni = {
            id: Date.now(),
            name: newUniversity.name,
            email: newUniversity.email,
            status: 'Active',
            students: 0,
        };
        // Force state update with new array reference
        setUniversities(prev => [...prev, newUni]);
        setNewUniversity({ name: '', email: '', adminName: '', password: '' });
        setShowAddModal(false);
        showNotification('success', `${newUniversity.name} has been added successfully!`);
    };

    const handleDeleteUniversity = (id) => {
        const university = universities.find(uni => uni.id === id);

        if (!university) {
            showNotification('error', 'University not found!');
            return;
        }

        if (window.confirm(`Are you sure you want to delete ${university.name}?`)) {
            // Immediately update state - this will trigger re-render
            setUniversities(universities.filter(uni => uni.id !== id));

            // Show notification immediately  
            showNotification('success', `${university.name} has been deleted.`);
        }
    };

    const handleAssignRole = (e) => {
        e.preventDefault();
        const roleName = roleAssignment.role.charAt(0).toUpperCase() + roleAssignment.role.slice(1);
        showNotification('success', `Role "${roleName}" assigned to ${roleAssignment.userName} successfully!`);
        setRoleAssignment({ userName: '', userEmail: '', role: 'viewer' });
        setShowRoleModal(false);
    };

    const openRoleModal = (university) => {
        setSelectedUniversity(university);
        setShowRoleModal(true);
    };

    const openEditModal = (university) => {
        setEditUniversity({
            id: university.id,
            name: university.name,
            email: university.email,
            status: university.status,
        });
        setShowEditModal(true);
    };

    const handleEditUniversity = (e) => {
        e.preventDefault();
        setUniversities(universities.map(uni =>
            uni.id === editUniversity.id
                ? { ...uni, name: editUniversity.name, email: editUniversity.email, status: editUniversity.status }
                : uni
        ));
        setShowEditModal(false);
        showNotification('success', `${editUniversity.name} has been updated successfully!`);
    };

    const handleToggleStatus = (id) => {
        setUniversities(universities.map(uni =>
            uni.id === id
                ? { ...uni, status: uni.status === 'Active' ? 'Inactive' : 'Active' }
                : uni
        ));
        const university = universities.find(uni => uni.id === id);
        const newStatus = university.status === 'Active' ? 'Inactive' : 'Active';
        showNotification('success', `Status changed to ${newStatus}`);
    };

    const stats = {
        totalUniversities: universities.length,
        activeUniversities: universities.filter(u => u.status === 'Active').length,
        totalStudents: universities.reduce((sum, uni) => sum + uni.students, 0),
        totalDegrees: 2891,
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
                                Super Admin <span className="gradient-text">Dashboard</span>
                            </h1>
                            <p className="text-white/60">Manage universities and system settings</p>
                        </div>
                        {activeTab === 'universities' && (
                            <Button variant="primary" onClick={() => setShowAddModal(true)}>
                                + Add University
                            </Button>
                        )}
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2 mb-8">
                        <button
                            onClick={() => setActiveTab('universities')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'universities'
                                ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-black'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                                }`}
                        >
                            🏛️ Universities ({universities.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'users'
                                ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-black'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                                }`}
                        >
                            👥 Users ({users.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'settings'
                                ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-black'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                                }`}
                        >
                            ⚙️ Settings
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'analytics'
                                ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-black'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                                }`}
                        >
                            📊 Analytics
                        </button>
                    </div>

                    {/* Universities Tab Content */}
                    {activeTab === 'universities' && (
                        <>
                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                <Card>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">🏛️</span>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-sm">Total Universities</p>
                                            <p className="text-3xl font-bold">{stats.totalUniversities}</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">✓</span>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-sm">Active</p>
                                            <p className="text-3xl font-bold">{stats.activeUniversities}</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">🎓</span>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-sm">Total Students</p>
                                            <p className="text-3xl font-bold">{stats.totalStudents}</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">📜</span>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-sm">Issued Degrees</p>
                                            <p className="text-3xl font-bold">{stats.totalDegrees}</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Universities Table */}
                            <Card>
                                <h2 className="text-2xl font-bold mb-6">Universities Management</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="text-left py-3 px-4 text-white/80">University Name</th>
                                                <th className="text-left py-3 px-4 text-white/80">Admin Email</th>
                                                <th className="text-left py-3 px-4 text-white/80">Students</th>
                                                <th className="text-left py-3 px-4 text-white/80">Status</th>
                                                <th className="text-center py-3 px-4 text-white/80">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {universities.map((uni) => (
                                                <tr key={uni.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="py-4 px-4 font-semibold">{uni.name}</td>
                                                    <td className="py-4 px-4 text-white/70">{uni.email}</td>
                                                    <td className="py-4 px-4">{uni.students}</td>
                                                    <td className="py-4 px-4">
                                                        <button
                                                            onClick={() => handleToggleStatus(uni.id)}
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all hover:scale-105 ${uni.status === 'Active'
                                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                                                                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-gray-500/30'
                                                                }`}
                                                            title="Click to toggle status"
                                                        >
                                                            {uni.status}
                                                        </button>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex gap-2 justify-center">
                                                            <Button
                                                                variant="secondary"
                                                                size="sm"
                                                                onClick={() => openEditModal(uni)}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="secondary"
                                                                size="sm"
                                                                onClick={() => openRoleModal(uni)}
                                                            >
                                                                Assign Role
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleDeleteUniversity(uni.id)}
                                                                className="border-red-500 text-red-400 hover:bg-red-500/10"
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </>
                    )}

                    {/* Users Tab Content */}
                    {activeTab === 'users' && (
                        <Card>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <h2 className="text-2xl font-bold">User Management</h2>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={userSearch}
                                        onChange={(e) => setUserSearch(e.target.value)}
                                        className="input-field w-64"
                                    />
                                    <select
                                        value={userRoleFilter}
                                        onChange={(e) => setUserRoleFilter(e.target.value)}
                                        className="input-field w-32"
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="student">Student</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <select
                                        value={userStatusFilter}
                                        onChange={(e) => setUserStatusFilter(e.target.value)}
                                        className="input-field w-32"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left py-3 px-4 text-white/80">User</th>
                                            <th className="text-left py-3 px-4 text-white/80">Role</th>
                                            <th className="text-left py-3 px-4 text-white/80">Status</th>
                                            <th className="text-left py-3 px-4 text-white/80">Last Login</th>
                                            <th className="text-center py-3 px-4 text-white/80">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users
                                            .filter(user => {
                                                const matchesSearch =
                                                    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                                                    user.email.toLowerCase().includes(userSearch.toLowerCase());
                                                const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;
                                                const matchesStatus = userStatusFilter === 'all' || user.status === userStatusFilter;
                                                return matchesSearch && matchesRole && matchesStatus;
                                            })
                                            .map((user) => (
                                                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="py-4 px-4">
                                                        <p className="font-semibold">{user.name}</p>
                                                        <p className="text-white/50 text-xs">{user.email}</p>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin'
                                                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                            }`}>
                                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                            user.status === 'Inactive' ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30' :
                                                                'bg-red-500/20 text-red-400 border border-red-500/30'
                                                            }`}>
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-white/60 text-sm">{user.lastLogin}</td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex gap-2 justify-center">
                                                            {user.status !== 'Active' && (
                                                                <Button
                                                                    variant="secondary"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setUsers(prev => prev.map(u =>
                                                                            u.id === user.id ? { ...u, status: 'Active' } : u
                                                                        ));
                                                                        showNotification('success', `${user.name} has been activated.`);
                                                                    }}
                                                                >
                                                                    Activate
                                                                </Button>
                                                            )}
                                                            {user.status === 'Active' && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setUsers(prev => prev.map(u =>
                                                                            u.id === user.id ? { ...u, status: 'Suspended' } : u
                                                                        ));
                                                                        showNotification('success', `${user.name} has been suspended.`);
                                                                    }}
                                                                    className="border-orange-500 text-orange-400 hover:bg-orange-500/10"
                                                                >
                                                                    Suspend
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    if (window.confirm(`Delete ${user.name}?`)) {
                                                                        setUsers(prev => prev.filter(u => u.id !== user.id));
                                                                        showNotification('success', `${user.name} has been deleted.`);
                                                                    }
                                                                }}
                                                                className="border-red-500 text-red-400 hover:bg-red-500/10"
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}

                    {/* Settings Tab Content */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            {/* Blockchain Network Status */}
                            <Card>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold">🌐 Blockchain Network Status</h2>
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${blockchainSettings.connectionStatus === 'Connected'
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        }`}>
                                        <span className={`w-2 h-2 rounded-full ${blockchainSettings.connectionStatus === 'Connected' ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                                            }`}></span>
                                        {blockchainSettings.connectionStatus}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-white/5 rounded-lg p-4">
                                        <p className="text-white/60 text-sm mb-1">Network</p>
                                        <p className="text-lg font-semibold text-cyan-400">{blockchainSettings.network}</p>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-4">
                                        <p className="text-white/60 text-sm mb-1">Chain ID</p>
                                        <p className="text-lg font-semibold">{blockchainSettings.chainId}</p>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-4">
                                        <p className="text-white/60 text-sm mb-1">Gas Price</p>
                                        <p className="text-lg font-semibold text-amber-400">{blockchainSettings.gasPrice} Gwei</p>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-4">
                                        <p className="text-white/60 text-sm mb-1">Latest Block</p>
                                        <p className="text-lg font-semibold text-emerald-400">{blockchainSettings.blockNumber}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white/5 rounded-lg p-4">
                                        <p className="text-white/60 text-sm mb-1">Pending Transactions</p>
                                        <p className="text-2xl font-bold text-orange-400">{blockchainSettings.transactionsPending}</p>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-4">
                                        <p className="text-white/60 text-sm mb-1">Confirmed Transactions</p>
                                        <p className="text-2xl font-bold text-green-400">{blockchainSettings.transactionsConfirmed}</p>
                                    </div>
                                </div>

                                <p className="text-white/40 text-sm mt-4">Last synced: {blockchainSettings.lastSync}</p>
                            </Card>

                            {/* Smart Contract Settings */}
                            <Card>
                                <h2 className="text-2xl font-bold mb-6">📜 Smart Contract Settings</h2>

                                <div className="space-y-4">
                                    <div className="bg-white/5 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-white/60 text-sm mb-1">Contract Address</p>
                                                <p className="font-mono text-blue-400">{blockchainSettings.contractAddress}</p>
                                            </div>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(blockchainSettings.contractAddress);
                                                    showNotification('success', 'Contract address copied!');
                                                }}
                                            >
                                                📋 Copy
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <p className="text-white/60 text-sm mb-1">Contract Status</p>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                                <span className="text-green-400 font-semibold">Deployed & Active</span>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <p className="text-white/60 text-sm mb-1">Contract Version</p>
                                            <p className="font-semibold">v1.2.0</p>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <p className="text-white/60 text-sm mb-1">Owner Address</p>
                                            <p className="font-mono text-sm text-white/70">0x1234...abcd</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <Button
                                            variant="secondary"
                                            onClick={() => window.open(`https://sepolia.etherscan.io/address/${blockchainSettings.contractAddress}`, '_blank')}
                                        >
                                            🔗 View on Etherscan
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => showNotification('success', 'Contract health check passed!')}
                                        >
                                            🔄 Check Health
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            {/* System Configuration */}
                            <Card>
                                <h2 className="text-2xl font-bold mb-6">⚙️ System Configuration</h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                        <div>
                                            <p className="font-semibold">Auto-verify Certificates</p>
                                            <p className="text-white/60 text-sm">Automatically verify certificates after blockchain confirmation</p>
                                        </div>
                                        <div className="relative">
                                            <input type="checkbox" defaultChecked className="sr-only peer" id="auto-verify" />
                                            <label htmlFor="auto-verify" className="w-11 h-6 bg-white/20 rounded-full peer-checked:bg-emerald-500 cursor-pointer block transition-colors"></label>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                        <div>
                                            <p className="font-semibold">Email Notifications</p>
                                            <p className="text-white/60 text-sm">Send email notifications for important events</p>
                                        </div>
                                        <div className="relative">
                                            <input type="checkbox" defaultChecked className="sr-only peer" id="email-notif" />
                                            <label htmlFor="email-notif" className="w-11 h-6 bg-white/20 rounded-full peer-checked:bg-emerald-500 cursor-pointer block transition-colors"></label>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Analytics Tab Content */}
                    {activeTab === 'analytics' && (
                        <div className="space-y-6">
                            {/* Overview Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Card>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">📜</span>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-sm">Total Certificates</p>
                                            <p className="text-3xl font-bold">{analytics.totalCertificates}</p>
                                        </div>
                                    </div>
                                </Card>
                                <Card>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">📈</span>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-sm">This Month</p>
                                            <p className="text-3xl font-bold text-emerald-400">+{analytics.thisMonth}</p>
                                        </div>
                                    </div>
                                </Card>
                                <Card>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">✓</span>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-sm">Verifications</p>
                                            <p className="text-3xl font-bold">{analytics.verifications}</p>
                                        </div>
                                    </div>
                                </Card>
                                <Card>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">👥</span>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-sm">Active Users</p>
                                            <p className="text-3xl font-bold">{analytics.activeUsers}</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Monthly Certificates Chart */}
                                <Card>
                                    <h3 className="text-xl font-bold mb-4">📊 Monthly Certificates Issued</h3>
                                    <div className="space-y-3">
                                        {[
                                            { month: 'October', value: 189, color: 'bg-amber-500' },
                                            { month: 'November', value: 234, color: 'bg-emerald-500' },
                                            { month: 'December', value: 198, color: 'bg-blue-500' },
                                            { month: 'January', value: 256, color: 'bg-purple-500' },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <span className="w-20 text-white/60 text-sm">{item.month}</span>
                                                <div className="flex-1 bg-white/10 rounded-full h-4">
                                                    <div
                                                        className={`${item.color} h-4 rounded-full transition-all`}
                                                        style={{ width: `${(item.value / 300) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="w-12 text-right font-semibold">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                {/* University Distribution */}
                                <Card>
                                    <h3 className="text-xl font-bold mb-4">🏛️ Certificates by University</h3>
                                    <div className="space-y-3">
                                        {universities.map((uni, idx) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <span className="w-32 text-white/60 text-sm truncate">{uni.name}</span>
                                                <div className="flex-1 bg-white/10 rounded-full h-4">
                                                    <div
                                                        className="bg-gradient-to-r from-amber-500 to-emerald-500 h-4 rounded-full"
                                                        style={{ width: `${(uni.students / 1500) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="w-12 text-right font-semibold">{uni.students}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>

                            {/* Recent Activity */}
                            <Card>
                                <h3 className="text-xl font-bold mb-4">📋 Recent System Activity</h3>
                                <div className="space-y-3">
                                    {[
                                        { action: 'Certificate Issued', user: 'Tech University', time: '2 minutes ago', type: 'success' },
                                        { action: 'User Registered', user: 'john@student.edu', time: '15 minutes ago', type: 'info' },
                                        { action: 'Certificate Verified', user: 'External Verifier', time: '1 hour ago', type: 'success' },
                                        { action: 'Certificate Revoked', user: 'Science Institute', time: '3 hours ago', type: 'warning' },
                                        { action: 'Admin Login', user: 'admin@techuni.edu', time: '5 hours ago', type: 'info' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-2 h-2 rounded-full ${item.type === 'success' ? 'bg-green-400' :
                                                        item.type === 'warning' ? 'bg-orange-400' : 'bg-blue-400'
                                                    }`}></span>
                                                <div>
                                                    <p className="font-semibold">{item.action}</p>
                                                    <p className="text-white/50 text-sm">{item.user}</p>
                                                </div>
                                            </div>
                                            <span className="text-white/40 text-sm">{item.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Add University Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full"
                    >
                        <Card>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Add New University</h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-white/60 hover:text-white"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleAddUniversity} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white/80">
                                        University Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newUniversity.name}
                                        onChange={(e) => setNewUniversity({ ...newUniversity, name: e.target.value })}
                                        placeholder="Enter university name"
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white/80">
                                        Admin Email
                                    </label>
                                    <input
                                        type="email"
                                        value={newUniversity.email}
                                        onChange={(e) => setNewUniversity({ ...newUniversity, email: e.target.value })}
                                        placeholder="admin@university.edu"
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white/80">
                                        Admin Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newUniversity.adminName}
                                        onChange={(e) => setNewUniversity({ ...newUniversity, adminName: e.target.value })}
                                        placeholder="Enter admin name"
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white/80">
                                        Default Password
                                    </label>
                                    <input
                                        type="password"
                                        value={newUniversity.password}
                                        onChange={(e) => setNewUniversity({ ...newUniversity, password: e.target.value })}
                                        placeholder="Set initial password"
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="primary" className="flex-1">
                                        Add University
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </motion.div>
                </div>
            )}

            {/* Edit University Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full"
                    >
                        <Card>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Edit University</h2>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="text-white/60 hover:text-white"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleEditUniversity} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white/80">
                                        University Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editUniversity.name}
                                        onChange={(e) => setEditUniversity({ ...editUniversity, name: e.target.value })}
                                        placeholder="Enter university name"
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white/80">
                                        Admin Email
                                    </label>
                                    <input
                                        type="email"
                                        value={editUniversity.email}
                                        onChange={(e) => setEditUniversity({ ...editUniversity, email: e.target.value })}
                                        placeholder="admin@university.edu"
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white/80">
                                        Status
                                    </label>
                                    <select
                                        value={editUniversity.status}
                                        onChange={(e) => setEditUniversity({ ...editUniversity, status: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="primary" className="flex-1">
                                        Update University
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </motion.div>
                </div>
            )}

            {/* Assign Role Modal */}
            {showRoleModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full"
                    >
                        <Card>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Assign User Role</h2>
                                <button
                                    onClick={() => setShowRoleModal(false)}
                                    className="text-white/60 hover:text-white"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {selectedUniversity && (
                                <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                    <p className="text-sm text-blue-400">Assigning role for:</p>
                                    <p className="font-semibold">{selectedUniversity.name}</p>
                                </div>
                            )}

                            <form onSubmit={handleAssignRole} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white/80">
                                        User Name
                                    </label>
                                    <input
                                        type="text"
                                        value={roleAssignment.userName}
                                        onChange={(e) => setRoleAssignment({ ...roleAssignment, userName: e.target.value })}
                                        placeholder="Enter user name"
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white/80">
                                        User Email
                                    </label>
                                    <input
                                        type="email"
                                        value={roleAssignment.userEmail}
                                        onChange={(e) => setRoleAssignment({ ...roleAssignment, userEmail: e.target.value })}
                                        placeholder="user@example.com"
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white/80">
                                        Assign Role
                                    </label>
                                    <select
                                        value={roleAssignment.role}
                                        onChange={(e) => setRoleAssignment({ ...roleAssignment, role: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="viewer">Viewer (Read Only)</option>
                                        <option value="issuer">Issuer (Can Issue Degrees)</option>
                                        <option value="admin">Admin (Full Access)</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setShowRoleModal(false)}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="primary" className="flex-1">
                                        Assign Role
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </motion.div>
                </div>
            )}

            {/* Notification Toast */}
            {notification.show && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
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

export default SuperAdminDashboard;
