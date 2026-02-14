import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import Footer from '../components/Footer';
import api from '../utils/api';
import {
    Clock,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Filter,
    Search,
    Plus,
    Calendar,
    User,
    ChevronRight,
    Loader2,
    LayoutDashboard
} from 'lucide-react';

const ComplaintList = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [role, setRole] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [autoAssignEnabled, setAutoAssignEnabled] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setRole(user.role);
            if (user.role === 'Admin') fetchSettings();
        }
        fetchComplaints();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/complaints/settings');
            if (res.data.success) {
                setAutoAssignEnabled(res.data.data.isAutoAssignEnabled);
            }
        } catch (err) {
            console.error('Failed to fetch settings');
        }
    };

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const res = await api.get('/complaints');
            if (res.data.success) {
                setComplaints(res.data.data);
            }
        } catch (err) {
            setError('Failed to load complaints. Please refresh the page.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredComplaints = complaints.filter(c => {
        const matchesSearch =
            c.complaint_unique_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'All' || c.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

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
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-[#fcfcfc] font-['Outfit']">
                <NavBar />
                <div className="flex-grow flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-black/20" />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#fcfcfc] font-['Outfit'] select-none">
            <NavBar />

            <main className="flex-grow pt-32 pb-20 px-6 md:px-16">
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black text-black tracking-tight">
                                {role === 'Admin' ? 'Management Console' : role === 'Staff' ? 'Assigned Tasks' : 'Your Complaints'}
                            </h1>
                            <p className="text-slate-500 font-medium">
                                {role === 'Admin' ? 'Overview of all complaints in the system.' : 'Track and manage resolutions in real-time.'}
                            </p>
                        </div>

                        {role === 'Admin' && (
                            <button
                                onClick={async () => {
                                    try {
                                        const res = await api.put('/complaints/settings', {
                                            isAutoAssignEnabled: !autoAssignEnabled
                                        });
                                        if (res.data.success) {
                                            setAutoAssignEnabled(res.data.data.isAutoAssignEnabled);
                                            // Trigger an immediate run if enabled
                                            if (res.data.data.isAutoAssignEnabled) {
                                                await api.post('/complaints/auto-assign');
                                                fetchComplaints();
                                            }
                                        }
                                    } catch (err) {
                                        alert('Failed to update auto-assign setting');
                                    }
                                }}
                                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95 ${autoAssignEnabled
                                    ? 'bg-green-600 text-white shadow-green-600/10 hover:bg-green-700'
                                    : 'bg-slate-200 text-slate-600 shadow-black/5 hover:bg-slate-300'}`}
                            >
                                <LayoutDashboard size={20} />
                                {autoAssignEnabled ? 'Auto-Assign: ON' : 'Auto-Assign: OFF'}
                            </button>
                        )}
                        {role === 'User' && (
                            <Link
                                to="/complaints/new"
                                className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl font-bold shadow-xl shadow-black/10 hover:opacity-90 transition-all active:scale-95"
                            >
                                <Plus size={20} />
                                New Complaint
                            </Link>
                        )}
                    </div>

                    {/* Stats/Filters Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white p-6 rounded-3xl border border-black/5 flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</p>
                                <p className="text-xl font-black text-black">{complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-black/5 flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resolved</p>
                                <p className="text-xl font-black text-black">{complaints.filter(c => c.status === 'Resolved').length}</p>
                            </div>
                        </div>
                        <div className="md:col-span-2 bg-white px-6 py-4 rounded-3xl border border-black/5 flex items-center gap-4">
                            <Search className="text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by ID, title, category or user..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-grow bg-transparent border-none focus:ring-0 font-medium text-slate-900 placeholder:text-slate-400"
                            />
                            <div className="h-8 w-px bg-slate-100"></div>
                            <div className="flex items-center gap-2">
                                <Filter size={18} className="text-slate-400" />
                                <select
                                    className="bg-transparent border-none focus:ring-0 font-bold text-sm text-slate-400 hover:text-black transition-colors cursor-pointer appearance-none"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="All">All Status</option>
                                    <option value="Open">Open</option>
                                    <option value="Assigned">Assigned</option>
                                    <option value="In-Progress">In-Progress</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Complaints Table/Grid */}
                    {filteredComplaints.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-black/10">
                            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-black mb-2">No complaints found</h3>
                            <p className="text-slate-500 max-w-xs mx-auto mb-8">It looks like everything is running smoothly. Reach out if you need anything.</p>
                            {role === 'User' && (
                                <Link to="/complaints/new" className="text-black font-black uppercase tracking-widest text-sm hover:underline">
                                    Submit your first complaint
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredComplaints.map((complaint) => (
                                <Link
                                    key={complaint._id}
                                    to={`/complaints/${complaint._id}`}
                                    className="group block bg-white border border-black/[0.03] rounded-[2rem] p-6 md:p-8 hover:border-black/10 hover:shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-all"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="space-y-4 flex-grow">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                    {complaint.complaint_unique_id}
                                                </span>
                                                <span className="text-[10px] font-black text-black uppercase tracking-widest bg-black/5 px-3 py-1.5 rounded-lg">
                                                    {complaint.category}
                                                </span>
                                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(complaint.status)}`}>
                                                    {complaint.status}
                                                </div>
                                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getPriorityColor(complaint.priority)}`}>
                                                    {complaint.priority}
                                                </div>
                                                {complaint.isEscalated && (
                                                    <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest border border-red-100 animate-pulse">
                                                        <AlertCircle size={12} />
                                                        SLA Breached
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-1">
                                                <h3 className="text-xl font-bold text-black group-hover:text-black transition-colors flex items-center gap-3">
                                                    {complaint.title}
                                                </h3>
                                                <p className="text-slate-500 font-medium line-clamp-1 max-w-2xl">
                                                    {complaint.description}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-6 pt-2">
                                                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                                                    <Calendar size={14} />
                                                    {formatDate(complaint.createdAt)}
                                                </div>
                                                {role !== 'User' && (
                                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                                                        <User size={14} />
                                                        {complaint.user?.name}
                                                    </div>
                                                )}
                                                {complaint.assignedTo && (
                                                    <div className="flex items-center gap-2 text-green-600/60 text-xs font-bold">
                                                        <CheckCircle2 size={14} />
                                                        Assigned to {complaint.assignedTo.name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="hidden md:flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">View Details</p>
                                                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                                    <ChevronRight size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ComplaintList;
