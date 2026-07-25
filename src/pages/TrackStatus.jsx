import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/navBar';
import Footer from '../components/Footer';
import api from '../utils/api';
import { Search, Loader2, AlertCircle, ArrowRight, Activity, Calendar, User, Briefcase, FileText, CheckCircle2, RotateCcw } from 'lucide-react';

const TrackStatus = () => {
    const [uid, setUid] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [complaint, setComplaint] = useState(null);

    const isLogged = Boolean(localStorage.getItem('token'));

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!uid.trim()) return;

        setLoading(true);
        setError('');
        setComplaint(null);

        try {
            const cleanUid = uid.trim().toUpperCase();
            const res = await api.get(`/complaints/track/${cleanUid}`);
            if (res.data.success) {
                setComplaint(res.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Complaint not found. Please check the ID.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Assigned': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'In-Progress': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'Resolved': return 'bg-green-50 text-green-600 border-green-100';
            case 'Closed': return 'bg-slate-50 text-slate-600 border-slate-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Low': return 'bg-slate-100 text-slate-600';
            case 'Medium': return 'bg-blue-100 text-blue-600';
            case 'High': return 'bg-orange-100 text-orange-600';
            case 'Urgent': return 'bg-red-500 text-white shadow-lg shadow-red-500/20';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#fcfcfc] font-['Outfit'] select-none">
            <NavBar />

            <main className="flex-grow flex items-center justify-center px-4 sm:px-6 py-24 sm:py-32">
                <div className="w-full max-w-2xl">
                    {!complaint ? (
                        <div className="bg-white p-6 sm:p-12 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] space-y-8 sm:space-y-10">
                            <div className="text-center space-y-2">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl shadow-black/10">
                                    <Activity className="w-7 h-7 sm:w-8 sm:h-8" />
                                </div>
                                <h1 className="text-2xl sm:text-4xl font-bold text-black tracking-tight">Track Complaint</h1>
                                <p className="text-slate-500 text-sm sm:text-base font-medium">Enter your Unique Complaint ID (e.g., COMP-1001)</p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleTrack} className="space-y-6">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-black transition-colors">
                                        <Search size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        value={uid}
                                        onChange={(e) => setUid(e.target.value)}
                                        placeholder="COMP-XXXX"
                                        className="w-full pl-14 pr-6 py-5 bg-[#f9fafb] border border-black/[0.05] rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all font-bold placeholder:text-slate-300 text-lg uppercase tracking-widest"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={24} /> : (
                                        <>
                                            Track Now
                                            <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] space-y-8 animate-in fade-in duration-300">
                            {/* Header */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-black/[0.04]">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                        ID: {complaint.complaint_unique_id}
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-bold text-black tracking-tight mt-2">{complaint.title}</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(complaint.status)}`}>
                                        {complaint.status}
                                    </span>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getPriorityColor(complaint.priority)}`}>
                                        {complaint.priority}
                                    </span>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-black/[0.02]">
                                    <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest flex items-center gap-1.5 mb-1">
                                        <Calendar size={12} /> Date Logged
                                    </p>
                                    <p className="text-sm font-bold text-black">{formatDate(complaint.createdAt)}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-black/[0.02]">
                                    <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest flex items-center gap-1.5 mb-1">
                                        <User size={12} /> Submitted By
                                    </p>
                                    <p className="text-sm font-bold text-black">{complaint.user?.name || 'Anonymous User'}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-black/[0.02]">
                                    <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest flex items-center gap-1.5 mb-1">
                                        <Briefcase size={12} /> Assigned Staff
                                    </p>
                                    <p className="text-sm font-bold text-black">{complaint.assignedTo?.name || 'Pending Assignment'}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</p>
                                <div className="p-5 bg-slate-50 rounded-2xl text-slate-700 text-sm font-medium leading-relaxed">
                                    {complaint.description}
                                </div>
                            </div>

                            {/* Resolution Notes */}
                            {complaint.resolutionNotes && (
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                        <FileText size={12} /> Resolution Notes
                                    </p>
                                    <div className="p-5 bg-black/5 rounded-2xl text-slate-800 text-sm font-medium italic leading-relaxed">
                                        {complaint.resolutionNotes}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-black/[0.04]">
                                <button
                                    onClick={() => setComplaint(null)}
                                    className="flex-1 py-4 bg-slate-100 text-black rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <RotateCcw size={16} /> Track Another Complaint
                                </button>
                                {isLogged && (
                                    <Link
                                        to={`/complaints/${complaint._id}`}
                                        className="flex-1 py-4 bg-black text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                    >
                                        View Discussion & Details <ArrowRight size={16} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TrackStatus;
