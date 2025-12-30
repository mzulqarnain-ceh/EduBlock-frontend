import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';

const Navigation = ({ walletAddress, onConnectWallet }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [location]);

    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    const isActive = (path) => location.pathname === path;

    const navLinkClass = (path) => {
        const baseClass = "relative px-3 py-2 transition-all duration-300";
        const activeClass = isActive(path)
            ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-cyan-500"
            : "text-white/80 hover:text-white";
        const hoverBorder = "hover:border hover:border-white/30 hover:rounded-lg";
        return `${baseClass} ${activeClass} ${hoverBorder}`;
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setShowUserMenu(false);
        navigate('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
            <div className="container-custom">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">E</span>
                        </div>
                        <span className="text-2xl font-bold gradient-text">EduBlock</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        <Link to="/" className={navLinkClass('/')}>
                            Home
                        </Link>
                        <Link to="/verify" className={navLinkClass('/verify')}>
                            Verify
                        </Link>
                        {user && user.role === 'superadmin' && (
                            <Link to="/superadmin" className={navLinkClass('/superadmin')}>
                                Super Admin
                            </Link>
                        )}
                        {user && user.role === 'admin' && (
                            <Link to="/admin" className={navLinkClass('/admin')}>
                                Admin
                            </Link>
                        )}
                        {user && user.role === 'student' && (
                            <Link to="/student" className={navLinkClass('/student')}>
                                My Degrees
                            </Link>
                        )}
                        <Link to="/contact" className={navLinkClass('/contact')}>
                            Contact Us
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-2 ml-4">
                                {/* Connect Wallet button for students */}
                                {user.role === 'student' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={onConnectWallet}
                                        className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                                    >
                                        {walletAddress ? (
                                            <span className="flex items-center gap-2">
                                                🟢 {formatAddress(walletAddress)}
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                🔗 Connect Wallet
                                            </span>
                                        )}
                                    </Button>
                                )}

                                {/* User Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="text-white font-medium">{user.name}</span>
                                        <svg className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {showUserMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-lg border border-white/20 rounded-lg overflow-hidden">
                                            <div className="p-3 border-b border-white/10">
                                                <p className="text-white/60 text-xs">Logged in as</p>
                                                <p className="text-white font-semibold">{user.email}</p>
                                                <p className="text-blue-400 text-xs mt-1 capitalize">{user.role}</p>
                                            </div>
                                            {walletAddress && (
                                                <div className="p-3 border-b border-white/10">
                                                    <p className="text-white/60 text-xs mb-1">Wallet</p>
                                                    <p className="text-white font-mono text-sm">{formatAddress(walletAddress)}</p>
                                                </div>
                                            )}
                                            <Link
                                                to="/settings"
                                                onClick={() => setShowUserMenu(false)}
                                                className="block px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                                            >
                                                ⚙️ Settings
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 ml-4">
                                <Link to="/login">
                                    <Button variant="secondary" size="sm">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button variant="primary" size="sm">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden py-4 space-y-4 animate-slide-down">
                        <Link to="/" className="block text-white/80 hover:text-white transition-colors py-2" onClick={() => setIsOpen(false)}>
                            Home
                        </Link>
                        <Link to="/verify" className="block text-white/80 hover:text-white transition-colors py-2" onClick={() => setIsOpen(false)}>
                            Verify
                        </Link>
                        <Link to="/contact" className="block text-white/80 hover:text-white transition-colors py-2" onClick={() => setIsOpen(false)}>
                            Contact Us
                        </Link>

                        {user ? (
                            <div className="border-t border-white/10 pt-4">
                                <p className="text-white/60 text-sm mb-2">{user.name}</p>
                                <Button variant="secondary" size="sm" onClick={handleLogout} className="w-full">
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Link to="/login" className="flex-1">
                                    <Button variant="secondary" size="sm" className="w-full">Login</Button>
                                </Link>
                                <Link to="/signup" className="flex-1">
                                    <Button variant="primary" size="sm" className="w-full">Sign Up</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;
