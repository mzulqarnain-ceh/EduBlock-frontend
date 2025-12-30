import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

const Landing = () => {
    const features = [
        {
            icon: '🔒',
            title: 'Blockchain Verified',
            description: 'All certificates are stored on the blockchain, ensuring immutability and authenticity.',
        },
        {
            icon: '⚡',
            title: 'Instant Verification',
            description: 'Verify any certificate in seconds with just a certificate ID or hash.',
        },
        {
            icon: '🌐',
            title: 'Decentralized',
            description: 'No central authority. Certificates are distributed across the blockchain network.',
        },
        {
            icon: '🛡️',
            title: 'Tamper-Proof',
            description: 'Once issued, certificates cannot be altered or forged, ensuring trust.',
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative section-padding pt-32 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="container-custom relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            <span className="gradient-text">Blockchain-Powered</span>
                            <br />
                            Educational Certificates
                        </h1>
                        <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto">
                            Secure, verifiable, and tamper-proof certificates for the digital age.
                            Built on blockchain technology.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/verify">
                                <Button variant="primary" size="lg">
                                    Verify Certificate
                                </Button>
                            </Link>
                            <Link to="/admin">
                                <Button variant="secondary" size="lg">
                                    Issue Certificate
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Hero Image/Illustration Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-16 max-w-4xl mx-auto"
                    >
                        <div className="glass-card p-8 rounded-3xl">
                            <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">📜</div>
                                    <p className="text-white/60">Certificate Verification Demo</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section-padding bg-black/20">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Why <span className="gradient-text">EduBlock</span>?
                        </h2>
                        <p className="text-white/70 text-lg max-w-2xl mx-auto">
                            Experience the future of educational credentials with our blockchain-based verification system.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {features.map((feature, index) => (
                            <motion.div key={index} variants={itemVariants}>
                                <Card className="h-full text-center">
                                    <div className="text-5xl mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                    <p className="text-white/70">{feature.description}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="section-padding">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            How It <span className="gradient-text">Works</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: '1', title: 'Issue Certificate', desc: 'Admin creates and issues certificate on blockchain' },
                            { step: '2', title: 'Store on Blockchain', desc: 'Certificate data is permanently recorded' },
                            { step: '3', title: 'Verify Anytime', desc: 'Anyone can verify authenticity instantly' },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                            >
                                <Card className="h-full text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 text-9xl font-bold text-white/5">
                                        {item.step}
                                    </div>
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl font-bold">{item.step}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                                        <p className="text-white/70">{item.desc}</p>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding bg-gradient-to-r from-blue-600/20 to-cyan-600/20">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Ready to Get <span className="gradient-text">Started</span>?
                        </h2>
                        <p className="text-xl text-white/80 mb-8">
                            Join the future of educational credential verification today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/admin">
                                <Button variant="primary" size="lg">
                                    Issue Your First Certificate
                                </Button>
                            </Link>
                            <Link to="/verify">
                                <Button variant="outline" size="lg">
                                    Verify a Certificate
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black/40 border-t border-white/10 py-12">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">E</span>
                                </div>
                                <span className="text-2xl font-bold gradient-text">EduBlock</span>
                            </div>
                            <p className="text-white/60">
                                Blockchain-powered educational certificate verification.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Product</h4>
                            <ul className="space-y-2 text-white/60">
                                <li><Link to="/verify" className="hover:text-white transition-colors">Verify</Link></li>
                                <li><Link to="/admin" className="hover:text-white transition-colors">Admin</Link></li>
                                <li><Link to="/student" className="hover:text-white transition-colors">Student</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Resources</h4>
                            <ul className="space-y-2 text-white/60">
                                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Legal</h4>
                            <ul className="space-y-2 text-white/60">
                                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">License</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-8 text-center text-white/60">
                        <p>&copy; 2026 EduBlock. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
