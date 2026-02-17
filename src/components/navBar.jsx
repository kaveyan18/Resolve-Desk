import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import NotificationCenter from './NotificationCenter';

const NavBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isHomePage = location.pathname === '/';
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setIsLogged(true);
            setUser(JSON.parse(userData));
        } else {
            setIsLogged(false);
            setUser(null);
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLogged(false);
        setUser(null);
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 md:px-16 bg-[#fcfcfc]/80 backdrop-blur-xl border-b border-black/[0.03] font-['Outfit'] select-none">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-3">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-black"
                >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span className="text-xl font-bold text-black tracking-tight">ResolveDesk</span>
            </Link>

            {/* Center: Navigation Pill */}
            <div className="hidden md:block bg-white/80 backdrop-blur-xl p-1 rounded-full shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-black/5">
                <div className="flex items-center">
                    <Link to="/" className={`px-6 py-2.5 text-[0.95rem] font-bold rounded-full transition-all ${location.pathname === '/' ? 'bg-black text-white' : 'text-[#64748b] hover:text-black'}`}>
                        Home
                    </Link>
                    <a href={isHomePage ? "#works" : "/#works"} className="px-5 py-2.5 text-[0.95rem] font-semibold text-[#64748b] rounded-full transition-all hover:text-black">
                        Works
                    </a>
                    <a href={isHomePage ? "#features" : "/#features"} className="px-5 py-2.5 text-[0.95rem] font-semibold text-[#64748b] rounded-full transition-all hover:text-black">
                        Features
                    </a>
                    {isLogged && (
                        <>
                            <Link to="/track" className={`px-6 py-2.5 text-[0.95rem] font-bold rounded-full transition-all ${location.pathname === '/track' ? 'bg-black text-white' : 'text-[#64748b] hover:text-black'}`}>
                                Track
                            </Link>
                            {user?.role === 'Admin' && (
                                <>
                                    <Link to="/analytics" className={`px-6 py-2.5 text-[0.95rem] font-bold rounded-full transition-all ${location.pathname === '/analytics' ? 'bg-black text-white' : 'text-[#64748b] hover:text-black'}`}>
                                        Analytics
                                    </Link>
                                    <Link to="/users" className={`px-6 py-2.5 text-[0.95rem] font-bold rounded-full transition-all ${location.pathname === '/users' ? 'bg-black text-white' : 'text-[#64748b] hover:text-black'}`}>
                                        Users
                                    </Link>
                                </>
                            )}
                            <Link to="/complaints" className={`px-6 py-2.5 text-[0.95rem] font-bold rounded-full transition-all ${location.pathname.startsWith('/complaints') ? 'bg-black text-white' : 'text-[#64748b] hover:text-black'}`}>
                                Complaints
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {isLogged ? (
                    <>
                        {user?.role !== 'Admin' && <NotificationCenter />}
                        <Link
                            to="/profile"
                            className={`px-6 py-2.5 text-[0.95rem] font-bold rounded-full transition-all ${location.pathname === '/profile' ? 'bg-black text-white' : 'text-[#64748b] hover:text-black'}`}
                        >
                            PROFILE
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-8 py-2.5 bg-red-600 text-white rounded-full text-[0.9rem] font-bold tracking-wider hover:opacity-80 transition-all uppercase shadow-lg shadow-red-600/10"
                        >
                            LOGOUT
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="px-6 py-2.5 text-[0.95rem] font-bold text-[#64748b] hover:text-black transition-colors">
                            LOGIN
                        </Link>
                        <Link to="/register" className="px-8 py-2.5 bg-black text-white rounded-full text-[0.9rem] font-bold tracking-wider hover:opacity-80 transition-all uppercase shadow-lg shadow-black/10">
                            REGISTER
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;