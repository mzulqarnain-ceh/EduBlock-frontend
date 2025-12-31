import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';
import { Html5QrcodeScanner } from 'html5-qrcode';

const Verification = () => {
    const [certificateId, setCertificateId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const [scannerInstance, setScannerInstance] = useState(null);

    const handleVerify = async () => {
        if (!certificateId.trim()) {
            setError('Please enter a certificate ID');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            // Simulate blockchain verification (replace with actual blockchain call)
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Mock data - replace with actual blockchain verification
            const mockVerification = {
                valid: true,
                studentName: 'John Doe',
                courseName: 'Blockchain Development',
                issueDate: '2025-01-15',
                institution: 'Tech University',
                grade: 'A+',
                hash: certificateId,
                txHash: '0x1234567890abcdef...',
            };

            setResult(mockVerification);
        } catch (err) {
            setError('Failed to verify certificate. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStartScanner = () => {
        setShowScanner(true);
    };

    const handleStopScanner = () => {
        if (scannerInstance) {
            scannerInstance.clear().catch(err => console.error('Scanner clear error:', err));
            setScannerInstance(null);
        }
        setShowScanner(false);
    };

    useEffect(() => {
        if (showScanner && !scannerInstance) {
            const scanner = new Html5QrcodeScanner(
                'qr-reader',
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false
            );

            scanner.render(
                (decodedText) => {
                    // Extract hash from URL or use direct hash
                    const hashMatch = decodedText.match(/hash=([a-fA-F0-9x]+)/);
                    const extractedHash = hashMatch ? hashMatch[1] : decodedText;

                    setCertificateId(extractedHash);
                    handleStopScanner();
                },
                (errorMessage) => {
                    // Ignore scanning errors (continuous scanning)
                }
            );

            setScannerInstance(scanner);
        }

        return () => {
            if (scannerInstance) {
                scannerInstance.clear().catch(err => console.error('Cleanup error:', err));
            }
        };
    }, [showScanner]);

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold mb-4">
                            <span className="gradient-text">Verify</span> Certificate
                        </h1>
                        <p className="text-white/70 text-lg">
                            Enter the certificate ID to verify its authenticity on the blockchain
                        </p>
                    </div>

                    {/* Verification Form */}
                    <Card className="mb-8">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="certificateId" className="block text-sm font-medium mb-2 text-white/80">
                                    Certificate ID
                                </label>
                                <input
                                    id="certificateId"
                                    type="text"
                                    value={certificateId}
                                    onChange={(e) => setCertificateId(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                                    placeholder="Enter certificate ID or hash"
                                    className="input-field w-full"
                                />
                                {error && (
                                    <p className="mt-2 text-red-400 text-sm">{error}</p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={handleVerify}
                                    disabled={loading}
                                    loading={loading}
                                    className="flex-1"
                                >
                                    {loading ? 'Verifying...' : 'Verify Certificate'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={handleStartScanner}
                                    disabled={loading}
                                    className="px-6"
                                >
                                    📷 Scan QR
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Verification Result */}
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="relative overflow-hidden">
                                {/* Success Badge */}
                                <div className="absolute top-0 right-0 m-4">
                                    {result.valid ? (
                                        <div className="flex items-center gap-2 bg-green-500/20 border border-green-500 rounded-full px-4 py-2">
                                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-green-400 font-semibold">Verified</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 bg-red-500/20 border border-red-500 rounded-full px-4 py-2">
                                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            <span className="text-red-400 font-semibold">Invalid</span>
                                        </div>
                                    )}
                                </div>

                                {/* Certificate Details */}
                                <div className="space-y-6">
                                    <div className="text-center mb-8">
                                        <div className="text-6xl mb-4">🎓</div>
                                        <h2 className="text-3xl font-bold mb-2">{result.courseName}</h2>
                                        <p className="text-white/60">{result.institution}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-white/60 text-sm mb-1">Student Name</p>
                                            <p className="text-lg font-semibold">{result.studentName}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-sm mb-1">Grade</p>
                                            <p className="text-lg font-semibold">{result.grade}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-sm mb-1">Issue Date</p>
                                            <p className="text-lg font-semibold">{result.issueDate}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-sm mb-1">Certificate Hash</p>
                                            <p className="text-sm font-mono break-all">{result.hash}</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/10 pt-6">
                                        <p className="text-white/60 text-sm mb-2">Transaction Hash</p>
                                        <div className="bg-black/30 rounded-lg p-4">
                                            <p className="text-sm font-mono break-all text-blue-400">{result.txHash}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button variant="outline" className="flex-1">
                                            Download Certificate
                                        </Button>
                                        <Button variant="secondary" className="flex-1">
                                            View on Blockchain
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Info Section */}
                    {!result && (
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { icon: '⚡', title: 'Instant', desc: 'Results in seconds' },
                                { icon: '🔒', title: 'Secure', desc: 'Blockchain verified' },
                                { icon: '✓', title: 'Trusted', desc: 'Tamper-proof' },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <div className="text-center">
                                        <div className="text-4xl mb-3">{item.icon}</div>
                                        <h3 className="font-bold mb-1">{item.title}</h3>
                                        <p className="text-white/60 text-sm">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* QR Scanner Modal */}
                {showScanner && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-md w-full"
                        >
                            <Card>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold">Scan QR Code</h2>
                                    <button
                                        onClick={handleStopScanner}
                                        className="text-white/60 hover:text-white"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <p className="text-white/60 text-sm mb-4">
                                    Position the QR code within the frame to scan
                                </p>

                                {/* Scanner Container */}
                                <div id="qr-reader" className="mb-4"></div>

                                <div className="text-center text-sm text-white/50">
                                    <p>📷 Allow camera access when prompted</p>
                                    <p className="mt-2">Hash will be auto-filled after scanning</p>
                                </div>

                                <Button
                                    variant="secondary"
                                    className="w-full mt-4"
                                    onClick={handleStopScanner}
                                >
                                    Cancel
                                </Button>
                            </Card>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Verification;
