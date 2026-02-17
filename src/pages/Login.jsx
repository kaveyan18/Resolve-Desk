import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import Footer from '../components/Footer';
import api from '../utils/api';

const Login = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('User');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/auth/login', {
                ...formData,
                role
            });

            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/'); // Redirect to home or dashboard
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#fcfcfc] font-['Outfit'] select-none">
            <NavBar />

            <main className="flex-grow flex items-center justify-center px-6 py-32">
                <div className="w-full max-w-xl">
                    <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] space-y-10">
                        <div className="text-center space-y-2">
                            <h1 className="text-4xl font-bold text-black tracking-tight">Welcome Back</h1>
                            <p className="text-slate-500 font-medium">Please enter your details to login.</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold animate-in fade-in duration-300">
                                {error}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-black uppercase tracking-widest ml-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="w-full px-6 py-4 bg-[#f9fafb] border border-black/[0.05] rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium placeholder:text-slate-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-black uppercase tracking-widest ml-1 flex justify-between">
                                    <span>Password</span>
                                    <button
                                        type="button"
                                        onClick={() => alert('Password recovery system coming soon. Please contact administrator.')}
                                        className="text-xs font-bold text-black lowercase tracking-normal hover:underline"
                                    >
                                        Forgot?
                                    </button>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-6 py-4 bg-[#f9fafb] border border-black/[0.05] rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium placeholder:text-slate-400"
                                />
                            </div>

                            <div className="space-y-4 pt-2">
                                <label className="text-sm font-bold text-black uppercase tracking-widest ml-1">Login As</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['User', 'Staff', 'Admin'].map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setRole(r)}
                                            className={`py-3 rounded-xl font-bold transition-all border ${role === r
                                                ? 'bg-black text-white border-black shadow-lg shadow-black/10'
                                                : 'bg-white text-slate-500 border-black/[0.05] hover:border-black/20'
                                                }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-black/10 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="text-center pt-4">
                            <p className="text-slate-500 font-medium">
                                Don't have an account? <Link to="/register" className="text-black font-bold hover:underline">Register here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Login;
