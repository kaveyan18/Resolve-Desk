import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import Footer from '../components/Footer';
import api from '../utils/api';
import { ClipboardList, Type, FileText, Tag, Upload, Send, AlertCircle } from 'lucide-react';

const NewComplaint = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/complaints', formData);
            if (res.data.success) {
                navigate('/complaints');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#fcfcfc] font-['Outfit'] select-none">
            <NavBar />

            <main className="flex-grow flex items-center justify-center px-6 py-32">
                <div className="w-full max-w-2xl">
                    <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] space-y-10">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/10">
                                <ClipboardList size={32} />
                            </div>
                            <h1 className="text-4xl font-bold text-black tracking-tight">Raise a Complaint</h1>
                            <p className="text-slate-500 font-medium">Please provide details about the issue you are facing.</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-black uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Type size={16} className="text-slate-400" />
                                    Complaint Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Brief summary of the issue"
                                    className="w-full px-6 py-4 bg-[#f9fafb] border border-black/[0.05] rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium placeholder:text-slate-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-black uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Tag size={16} className="text-slate-400" />
                                    Category
                                </label>
                                <select
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-[#f9fafb] border border-black/[0.05] rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all font-bold appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Select a category</option>
                                    <option value="Plumbing">Plumbing</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="Facility">Facility</option>
                                    <option value="IT">IT</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-black uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FileText size={16} className="text-slate-400" />
                                    Detailed Description
                                </label>
                                <textarea
                                    name="description"
                                    required
                                    rows="5"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Explain the problem in detail..."
                                    className="w-full px-6 py-4 bg-[#f9fafb] border border-black/[0.05] rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium placeholder:text-slate-400 resize-none"
                                ></textarea>
                            </div>

                            {/* Attachment Placeholder */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-black uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Upload size={16} className="text-slate-400" />
                                    Attachments (Optional)
                                </label>
                                <div className="w-full px-6 py-8 bg-[#f9fafb] border-2 border-dashed border-black/[0.1] rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-black/20 transition-all cursor-pointer">
                                    <Upload size={24} className="mb-2" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Click to upload or drag & drop</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-black/10 mt-4 disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {loading ? 'Submitting...' : (
                                    <>
                                        Submit Complaint
                                        <Send size={20} />
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

export default NewComplaint;
