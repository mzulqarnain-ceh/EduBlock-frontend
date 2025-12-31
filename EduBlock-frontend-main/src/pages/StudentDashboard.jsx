import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCode } from 'react-qr-code';
import Button from '../components/Button';
import Card from '../components/Card';
import { generateCertificatePDF } from '../utils/pdfGenerator';

const StudentDashboard = () => {
    const [showQRModal, setShowQRModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedCert, setSelectedCert] = useState(null);
    const [user, setUser] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '' });

    // Get user from localStorage
    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const showNotification = (message) => {
        setNotification({ show: true, message });
        setTimeout(() => setNotification({ show: false, message: '' }), 3000);
    };

    // Mock certificates data with transaction details
    const certificates = [
        {
            id: 1,
            studentName: user?.name || 'Student User',
            courseName: 'Blockchain Development',
            institution: 'Tech University',
            grade: 'A+',
            issueDate: '2025-01-15',
            hash: '0xabcd1234ef567890abcd1234ef567890abcd1234ef567890abcd1234ef567890',
            txHash: '0x7f8c9d2e1a3b4c5f6789abcdef012345678901234567890abcdef01234567890',
            status: 'Issued',
            txStatus: 'Confirmed',
        },
        {
            id: 2,
            studentName: user?.name || 'Student User',
            courseName: 'Smart Contract Security',
            institution: 'Crypto Academy',
            grade: 'A',
            issueDate: '2024-12-10',
            hash: '0xefgh5678ij901234klmn5678opqr9012stuv3456wxyz7890abcd1234efgh5678',
            txHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
            status: 'Issued',
            txStatus: 'Confirmed',
        },
        {
            id: 3,
            studentName: user?.name || 'Student User',
            courseName: 'Web3 Development',
            institution: 'Tech University',
            grade: 'A-',
            issueDate: '2024-11-20',
            hash: '0xijkl9012mnop3456qrst7890uvwx1234yz567890abcd1234efgh5678ijkl9012',
            txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            status: 'Pending',
            txStatus: 'Pending',
        },
    ];

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header */}
                    <div className="mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-2xl text-white/80 mb-2">
                                Hello, <span className="gradient-text font-semibold">{user?.name || 'Student'}!</span> 👋
                            </h2>
                        </motion.div>
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-4xl font-bold mb-2">
                                    My <span className="gradient-text">Certificates</span>
                                </h1>
                                <p className="text-white/60">View and manage your earned certificates</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <Card>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">🎓</span>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm">Total Certificates</p>
                                    <p className="text-2xl font-bold">{certificates.length}</p>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">✓</span>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm">Verified</p>
                                    <p className="text-2xl font-bold">{certificates.filter(c => c.status === 'Issued').length}</p>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">⭐</span>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm">Average Grade</p>
                                    <p className="text-2xl font-bold">A</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Certificates Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certificates.map((cert, index) => (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="h-full flex flex-col">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="text-3xl">📜</div>
                                            <div className={`rounded-full px-3 py-1 text-xs font-semibold border ${cert.status === 'Issued'
                                                ? 'bg-green-500/20 text-green-400 border-green-500'
                                                : cert.status === 'Pending'
                                                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500'
                                                    : 'bg-red-500/20 text-red-400 border-red-500'
                                                }`}>
                                                {cert.status}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{cert.courseName}</h3>
                                        <p className="text-white/60 mb-4">{cert.institution}</p>
                                        <div className="space-y-2 mb-6">
                                            <div className="flex justify-between">
                                                <span className="text-white/60 text-sm">Grade:</span>
                                                <span className="font-semibold">{cert.grade}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/60 text-sm">Issued:</span>
                                                <span className="font-semibold">{cert.issueDate}</span>
                                            </div>
                                            <div>
                                                <span className="text-white/60 text-sm">Certificate Hash:</span>
                                                <p className="font-mono text-xs text-blue-400 break-all">{cert.hash.slice(0, 20)}...{cert.hash.slice(-10)}</p>
                                            </div>
                                            <div className="pt-2 border-t border-white/10">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-white/60 text-sm">Transaction Hash:</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${cert.txStatus === 'Confirmed'
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-yellow-500/20 text-yellow-400'
                                                        }`}>
                                                        {cert.txStatus}
                                                    </span>
                                                </div>
                                                <p className="font-mono text-xs text-cyan-400 break-all mb-2">
                                                    {cert.txHash.slice(0, 15)}...{cert.txHash.slice(-10)}
                                                </p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(cert.txHash);
                                                            showNotification('Transaction hash copied!');
                                                        }}
                                                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                                    >
                                                        📋 Copy
                                                    </button>
                                                    <a
                                                        href={`https://sepolia.etherscan.io/tx/${cert.txHash}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                                                    >
                                                        🔗 Explorer
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* QR Code */}
                                    <div className="mb-6 flex justify-center">
                                        <div className="bg-white p-3 rounded-lg">
                                            <QRCode
                                                value={`https://edublock.com/verify/${cert.hash}`}
                                                size={120}
                                                level="H"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="w-full"
                                            onClick={() => {
                                                setSelectedCert(cert);
                                                setShowQRModal(true);
                                            }}
                                        >
                                            View QR Code
                                        </Button>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => {
                                                    generateCertificatePDF(cert);
                                                    showNotification('PDF downloaded successfully!');
                                                }}
                                            >
                                                📥 PDF
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => {
                                                    setSelectedCert(cert);
                                                    setShowShareModal(true);
                                                }}
                                            >
                                                🔗 Share
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(cert.hash);
                                                    showNotification('Certificate hash copied!');
                                                }}
                                            >
                                                📋 Copy
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {certificates.length === 0 && (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">📚</div>
                            <h3 className="text-2xl font-bold mb-2">No Certificates Yet</h3>
                            <p className="text-white/60">Your earned certificates will appear here</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* QR Code Modal */}
            {showQRModal && selectedCert && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full"
                    >
                        <Card>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Certificate QR Code</h2>
                                <button
                                    onClick={() => setShowQRModal(false)}
                                    className="text-white/60 hover:text-white"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="text-center mb-6">
                                <h3 className="text-lg font-semibold mb-2">{selectedCert.courseName}</h3>
                                <p className="text-white/60 text-sm">{selectedCert.institution}</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl mb-6 flex justify-center">
                                <QRCode
                                    value={`https://edublock.com/verify/${selectedCert.hash}`}
                                    size={200}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>

                            <div className="bg-white/5 p-4 rounded-lg mb-6">
                                <p className="text-white/60 text-xs mb-2">Verification Link</p>
                                <p className="text-blue-400 text-sm break-all font-mono">
                                    https://edublock.com/verify/{selectedCert.hash}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Button
                                    variant="primary"
                                    className="w-full"
                                    onClick={() => {
                                        navigator.clipboard.writeText(`https://edublock.com/verify/${selectedCert.hash}`);
                                        alert('Link copied to clipboard!');
                                    }}
                                >
                                    📋 Copy Verification Link
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() => setShowQRModal(false)}
                                >
                                    Close
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            )}

            {/* Share Modal */}
            {showShareModal && selectedCert && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full"
                    >
                        <Card>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Share Certificate</h2>
                                <button
                                    onClick={() => setShowShareModal(false)}
                                    className="text-white/60 hover:text-white"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="text-center mb-6">
                                <h3 className="text-lg font-semibold mb-2">{selectedCert.courseName}</h3>
                                <p className="text-white/60 text-sm">{selectedCert.institution}</p>
                            </div>

                            <div className="bg-white/5 p-4 rounded-lg mb-6">
                                <p className="text-white/60 text-xs mb-2">Verification Link</p>
                                <p className="text-blue-400 text-sm break-all font-mono mb-3">
                                    {`${window.location.origin}/verify?hash=${selectedCert.hash}`}
                                </p>
                                <Button
                                    variant="primary"
                                    className="w-full"
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}/verify?hash=${selectedCert.hash}`);
                                        showNotification('Verification link copied!');
                                    }}
                                >
                                    📋 Copy Link
                                </Button>
                            </div>

                            <div className="border-t border-white/10 pt-4">
                                <p className="text-white/60 text-xs mb-3">Share via:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const text = `Check out my ${selectedCert.courseName} certificate!`;
                                            const url = `${window.location.origin}/verify?hash=${selectedCert.hash}`;
                                            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                                        }}
                                    >
                                        🐦 Twitter
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const url = `${window.location.origin}/verify?hash=${selectedCert.hash}`;
                                            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                                        }}
                                    >
                                        💼 LinkedIn
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const subject = `My ${selectedCert.courseName} Certificate`;
                                            const body = `I've earned a certificate in ${selectedCert.courseName}! Verify it here: ${window.location.origin}/verify?hash=${selectedCert.hash}`;
                                            window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                                        }}
                                    >
                                        ✉️ Email
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const text = `Check out my ${selectedCert.courseName} certificate: ${window.location.origin}/verify?hash=${selectedCert.hash}`;
                                            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                                        }}
                                    >
                                        💬 WhatsApp
                                    </Button>
                                </div>
                            </div>

                            <Button
                                variant="secondary"
                                className="w-full mt-4"
                                onClick={() => setShowShareModal(false)}
                            >
                                Close
                            </Button>
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
                    <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 flex items-center gap-3 backdrop-blur-md">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-green-400 font-medium">{notification.message}</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default StudentDashboard;
