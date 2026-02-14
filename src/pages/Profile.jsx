import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import Footer from '../components/Footer';
import api from '../utils/api';
import { User, Mail, Phone, Shield, Calendar, Award, Briefcase, LogOut, Edit3, X, Check, Plus, Trash2 } from 'lucide-react';

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        skills: []
    });
    const [newSkill, setNewSkill] = useState('');
    const [updating, setUpdating] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchUserProfile();
    }, [navigate]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const res = await api.get('/auth/me');
            if (res.data.success) {
                setUserData(res.data.data);
                setFormData({
                    name: res.data.data.name,
                    phone: res.data.data.phone || '',
                    skills: res.data.data.skills || []
                });
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile data. Please try logging in again.');
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData({
                ...formData,
                skills: [...formData.skills, newSkill.trim()]
            });
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(skill => skill !== skillToRemove)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError('');
        setSuccessMsg('');

        try {
            const res = await api.put('/auth/updatedetails', formData);
            if (res.data.success) {
                setUserData(res.data.data);
                setSuccessMsg('Profile updated successfully!');
                setEditMode(false);
                // Update local storage user data
                const storedUser = JSON.parse(localStorage.getItem('user'));
                localStorage.setItem('user', JSON.stringify({
                    ...storedUser,
                    name: res.data.data.name
                }));
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setUpdating(false);
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMsg(''), 3000);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-[#fcfcfc] font-['Outfit']">
                <NavBar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#fcfcfc] font-['Outfit'] select-none">
            <NavBar />

            <main className="flex-grow pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Feedback Messages */}
                    {successMsg && (
                        <div className="fixed top-24 right-6 bg-green-500 text-white px-6 py-3 rounded-2xl font-bold shadow-xl animate-in slide-in-from-right duration-300 z-[60] flex items-center gap-2">
                            <Check size={20} />
                            {successMsg}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-8 flex items-center gap-2">
                            <Shield size={20} />
                            <span className="font-bold">{error}</span>
                        </div>
                    )}

                    {/* Profile Header */}
                    <div className="relative mb-12">
                        <div className="h-56 w-full bg-black rounded-[3rem] overflow-hidden shadow-2xl">
                        </div>

                        <div className="absolute -bottom-12 left-12 flex items-end gap-8">
                            <div className="w-40 h-40 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center border-[10px] border-[#fcfcfc]">
                                <div className="w-full h-full bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                                    <User size={80} strokeWidth={1} />
                                </div>
                            </div>
                            <div className="pb-6">
                                <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-md">{userData?.name}</h1>
                                <div className="flex items-center gap-3">
                                    <span className="px-4 py-1.5 bg-white/10 backdrop-blur-xl text-white rounded-full text-xs font-bold uppercase tracking-[0.2em] border border-white/20">
                                        {userData?.role}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-white/50 text-sm font-medium">
                                        <Calendar size={14} />
                                        <span>Joined {formatDate(userData?.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-black/[0.03]">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Manage Account</h3>
                                <div className="space-y-3">
                                    {!editMode ? (
                                        <button
                                            onClick={() => setEditMode(true)}
                                            className="w-full h-14 flex items-center justify-center gap-3 rounded-2xl bg-black text-white text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-black/10"
                                        >
                                            <Edit3 size={18} />
                                            Edit Profile
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setEditMode(false);
                                                setFormData({
                                                    name: userData.name,
                                                    phone: userData.phone || '',
                                                    skills: userData.skills || []
                                                });
                                            }}
                                            className="w-full h-14 flex items-center justify-center gap-3 rounded-2xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition-all"
                                        >
                                            <X size={18} />
                                            Cancel Editing
                                        </button>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full h-14 flex items-center justify-center gap-3 rounded-2xl bg-red-50 text-red-500 text-sm font-bold hover:bg-red-500 hover:text-white transition-all group"
                                    >
                                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                                        Log Out
                                    </button>
                                </div>
                            </div>

                            {/* Skills Section for Staff */}
                            {userData?.role === 'Staff' && (
                                <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-black/[0.03]">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Award size={14} />
                                            Skills & Expertise
                                        </h3>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {(editMode ? formData.skills : userData.skills).map((skill, index) => (
                                            <div
                                                key={index}
                                                className="group flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-100 hover:border-black/10 transition-all"
                                            >
                                                {skill}
                                                {editMode && (
                                                    <button
                                                        onClick={() => removeSkill(skill)}
                                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {editMode && (
                                        <div className="flex gap-2 mt-4">
                                            <input
                                                type="text"
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                placeholder="Add skill..."
                                                className="flex-grow px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-black/5"
                                                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                            />
                                            <button
                                                onClick={addSkill}
                                                className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-xl hover:scale-105 transition-all"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Main Content */}
                        <div className="md:col-span-2">
                            <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-black/[0.03]">
                                <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
                                    <h3 className="text-xl font-bold text-black flex items-center gap-3">
                                        <div className="w-2 h-8 bg-black rounded-full"></div>
                                        Personal Information
                                    </h3>
                                    {!editMode && (
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Live Profile</span>
                                        </div>
                                    )}
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                                            <div className="relative">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                                                    <User size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editMode ? formData.name : userData.name}
                                                    onChange={handleInputChange}
                                                    disabled={!editMode}
                                                    className={`w-full pl-14 pr-6 py-4 rounded-2xl font-bold transition-all ${editMode
                                                        ? 'bg-slate-50 border-black/10 focus:ring-4 focus:ring-black/5'
                                                        : 'bg-transparent border-transparent grayscale italic text-slate-700'
                                                        }`}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                                            <div className="relative">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                                                    <Phone size={18} />
                                                </div>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={editMode ? formData.phone : (userData.phone || 'Not provided')}
                                                    onChange={handleInputChange}
                                                    disabled={!editMode}
                                                    placeholder="e.g. +91 9876543210"
                                                    className={`w-full pl-14 pr-6 py-4 rounded-2xl font-bold transition-all ${editMode
                                                        ? 'bg-slate-50 border-black/10 focus:ring-4 focus:ring-black/5'
                                                        : 'bg-transparent border-transparent grayscale italic text-slate-700'
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                                                <Mail size={18} />
                                            </div>
                                            <input
                                                type="email"
                                                value={userData?.email}
                                                disabled
                                                className="w-full pl-14 pr-6 py-4 bg-transparent border-transparent rounded-2xl font-bold text-slate-400 grayscale italic"
                                            />
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                                <Shield size={16} className="text-slate-300" />
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-slate-400 italic font-medium ml-1 flex items-center gap-1">
                                            <Shield size={10} /> Email is verified and locked for security.
                                        </p>
                                    </div>

                                    <div className="pt-8">
                                        <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                                    <Briefcase size={20} className="text-black" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Role</p>
                                                    <p className="font-bold text-black">{userData?.role} Privileges</p>
                                                </div>
                                            </div>
                                            <div className="px-5 py-2 bg-green-50 text-green-600 rounded-full text-xs font-black uppercase tracking-widest">
                                                Active
                                            </div>
                                        </div>
                                    </div>

                                    {editMode && (
                                        <div className="flex gap-4 pt-10">
                                            <button
                                                type="submit"
                                                disabled={updating}
                                                className="flex-grow h-16 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 disabled:opacity-50"
                                            >
                                                {updating ? (
                                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                ) : (
                                                    <>
                                                        <Check size={20} />
                                                        Save Changes
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Profile;
