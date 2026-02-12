import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import Footer from '../components/Footer';
import api from '../utils/api';
import { Search, Loader2, AlertCircle, ArrowRight, Activity } from 'lucide-react';

const TrackStatus = () => {
    const navigate = useNavigate();
    const [uid, setUid] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!uid.trim()) return;

        setLoading(true);
        setError('');

        try {
            const cleanUid = uid.trim().toUpperCase();
            const res = await api.get(`/complaints/track/${cleanUid}`);
            if (res.data.success) {
                navigate(`/complaints/${res.data.data._id}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Complaint not found. Please check the ID.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#fcfcfc] font-['Outfit'] select-none">
            <NavBar />

            <main className="flex-grow flex items-center justify-center px-6 py-32">
                <div className="w-full max-w-md">
                    <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] space-y-10">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/10">
                                <Activity size={32} />
                            </div>
                            <h1 className="text-4xl font-bold text-black tracking-tight">Track Complaint</h1>
                            <p className="text-slate-500 font-medium">Enter your Unique Complaint ID (e.g., COMP-1001)</p>
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
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TrackStatus;
