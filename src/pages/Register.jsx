import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import Footer from '../components/Footer';
import api from '../utils/api';

const Register = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('User');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/');
        }
    }, [navigate]);

    const staffSkills = ['Plumbing', 'Electrical', 'Facility', 'IT Support', 'Security', 'Maintenance'];

    const toggleSkill = (skill) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter(s => s !== skill));
        } else {
            setSelectedSkills([...selectedSkills, skill]);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            const res = await api.post('/auth/register', {
                ...formData,
                role,
                skills: selectedSkills
            });

            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/'); // Redirect to home or dashboard
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#fcfcfc] font-['Outfit'] select-none">
            <NavBar />

            <main className="flex-grow flex items-center justify-center px-6 py-24 md:py-32">
                <div className="w-full max-w-2xl">
                    <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] space-y-10">
                        <div className="text-center space-y-2">
                            <h1 className="text-4xl font-bold text-black tracking-tight">Create an Account</h1>
                            <p className="text-slate-500 font-medium">Join ResolveDesk to start managing complaints.</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold animate-in fade-in duration-300">
                                {error}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Role Selection */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-black uppercase tracking-widest ml-1">Select Your Role</label>
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

                            {/* Common Fields: Name and Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-black uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="w-full px-6 py-4 bg-[#f9fafb] border border-black/[0.05] rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium placeholder:text-slate-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-black uppercase tracking-widest ml-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 234 567 890"
                                        className="w-full px-6 py-4 bg-[#f9fafb] border border-black/[0.05] rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            {/* Common Field: Email */}
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

                            {/* Common Fields: Password and Confirm Password */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-black uppercase tracking-widest ml-1">Password</label>
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
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-black uppercase tracking-widest ml-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full px-6 py-4 bg-[#f9fafb] border border-black/[0.05] rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            {/* Conditional Field: Staff Skills */}
                            {role === 'Staff' && (
                                <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <label className="text-sm font-bold text-black uppercase tracking-widest ml-1 block">Staff Skills</label>
                                    <div className="flex flex-wrap gap-2">
                                        {staffSkills.map((skill) => (
                                            <button
                                                key={skill}
                                                type="button"
                                                onClick={() => toggleSkill(skill)}
                                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${selectedSkills.includes(skill)
                                                    ? 'bg-black text-white border-black shadow-md'
                                                    : 'bg-white text-slate-400 border-black/[0.05] hover:border-black/10'
                                                    }`}
                                            >
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-400 ml-1 italic font-medium">Please select your areas of expertise for relevant assignments.</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-black/10 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="text-center pt-4">
                            <p className="text-slate-500 font-medium">
                                Already have an account? <Link to="/login" className="text-black font-bold hover:underline">Login here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Register;
