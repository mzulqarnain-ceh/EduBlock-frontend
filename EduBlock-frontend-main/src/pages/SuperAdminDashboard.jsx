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
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">
                                Super Admin <span className="gradient-text">Dashboard</span>
                            </h1>
                            <p className="text-white/60">Manage universities and system settings</p>
                        </div>
                        <Button variant="primary" onClick={() => setShowAddModal(true)}>
                            + Add University
                        </Button>
                    </div>

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
