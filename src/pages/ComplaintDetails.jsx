import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import NavBar from '../components/navBar';
import Footer from '../components/Footer';
import api from '../utils/api';
import { io } from 'socket.io-client';
import {
    Clock,
    Calendar,
    User,
    ChevronLeft,
    CheckCircle2,
    Shield,
    MessageSquare,
    Paperclip,
    ArrowRight,
    Loader2,
    Check,
    AlertCircle,
    Briefcase,
    FileText,
    Star,
    Heart,
    Send,
    X,
    MessageCircle
} from 'lucide-react';

const socket = io('http://localhost:5000');

const ComplaintDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [role, setRole] = useState('');
    const [staffList, setStaffList] = useState([]);
    const [updating, setUpdating] = useState(false);
    const [updateMsg, setUpdateMsg] = useState('');
    const [note, setNote] = useState('');
    const [feedback, setFeedback] = useState({ rating: 0, comment: '' });
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setRole(user.role);
            setCurrentUser(user);
        }
        fetchComplaint();
        fetchMessages();
        if (user.role === 'Admin') fetchStaff();

        // Socket logic
        socket.emit('join_room', id);

        socket.on('receive_message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, [id]);

    const fetchMessages = async () => {
        try {
            const res = await api.get(`/complaints/${id}/messages`);
            if (res.data.success) {
                setMessages(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching messages:', err);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && currentUser) {
            socket.emit('send_message', {
                complaintId: id,
                senderId: currentUser.id || currentUser._id,
                text: newMessage
            });
            setNewMessage('');
        }
    };

    const fetchComplaint = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/complaints/${id}`);
            if (res.data.success) {
                setComplaint(res.data.data);
                setNote(res.data.data.resolutionNotes || '');
            }
        } catch (err) {
            setError('Failed to load complaint details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStaff = async () => {
        try {
            const res = await api.get('/auth/users?role=Staff');
            if (res.data.success) {
                setStaffList(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching staff:', err);
        }
    };

    const handleAssignStaff = async (staffId) => {
        if (!staffId) return;
        setUpdating(true);
        try {
            const res = await api.put(`/complaints/${id}`, { assignedTo: staffId });
            if (res.data.success) {
                setComplaint(res.data.data);
                setUpdateMsg('Complaint assigned successfully!');
            }
        } catch (err) {
            setError('Failed to assign staff.');
        } finally {
            setUpdating(false);
            setTimeout(() => setUpdateMsg(''), 3000);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        setUpdating(true);
        try {
            const res = await api.get(`/complaints/${id}`); // Refresh to get latest notes
            const res2 = await api.put(`/complaints/${id}`, { status: newStatus });
            if (res2.data.success) {
                setComplaint(res2.data.data);
                setUpdateMsg('Status updated successfully!');
            }
        } catch (err) {
            setError('Failed to update status.');
        } finally {
            setUpdating(false);
            setTimeout(() => setUpdateMsg(''), 3000);
        }
    };

    const handleUpdateNotes = async () => {
        setUpdating(true);
        try {
            const res = await api.put(`/complaints/${id}`, { resolutionNotes: note });
            if (res.data.success) {
                setComplaint(res.data.data);
                setUpdateMsg('Notes updated successfully!');
            }
        } catch (err) {
            setError('Failed to update notes.');
        } finally {
            setUpdating(false);
            setTimeout(() => setUpdateMsg(''), 3000);
        }
    };

    const handleUpdateFeedback = async () => {
        if (feedback.rating === 0) return setError('Please select a rating');
        setSubmittingFeedback(true);
        try {
            const res = await api.put(`/complaints/${id}`, { feedback });
            if (res.data.success) {
                setComplaint(res.data.data);
                setUpdateMsg('Thank you for your feedback!');
            }
        } catch (err) {
            setError('Failed to submit feedback.');
        } finally {
            setSubmittingFeedback(false);
            setTimeout(() => setUpdateMsg(''), 3000);
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
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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

    if (!complaint) return null;

    return (
        <div className="flex flex-col min-h-screen bg-[#fcfcfc] font-['Outfit'] select-none">
            <NavBar />

            <main className="flex-grow pt-32 pb-20 px-6 md:px-16">
                <div className="max-w-5xl mx-auto">
                    {/* Back Button */}
                    <Link
                        to="/complaints"
                        className="inline-flex items-center gap-2 text-slate-400 font-bold text-sm mb-12 hover:text-black transition-colors"
                    >
                        <ChevronLeft size={18} />
                        Back to List
                    </Link>

                    {/* Header Card */}
                    <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-black/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.02)] mb-8">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                            <div className="space-y-6 flex-grow">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                        ID: {complaint.complaint_unique_id}
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

                                <h1 className="text-4xl font-black text-black tracking-tight leading-tight">
                                    {complaint.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-8 py-2 border-y border-slate-50">
                                    <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                                        <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                            <Calendar size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[8px] uppercase tracking-widest text-slate-400">Date Logged</p>
                                            <p>{formatDate(complaint.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                                        <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[8px] uppercase tracking-widest text-slate-400">Submitted By</p>
                                            <p>{complaint.user?.name}</p>
                                        </div>
                                    </div>
                                    {complaint.assignedTo && (
                                        <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
                                                <Briefcase size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[8px] uppercase tracking-widest text-slate-400">Assigned To</p>
                                                <p>{complaint.assignedTo.name}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions Column for Staff/Admin */}
                            {(role === 'Staff' || role === 'Admin') && (
                                <div className="w-full md:w-64 space-y-4">
                                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-black/[0.02]">
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Shield size={14} />
                                            Admin Actions
                                        </h3>

                                        <div className="space-y-2">
                                            {complaint.status !== 'Resolved' && (
                                                <button
                                                    onClick={() => handleUpdateStatus('In-Progress')}
                                                    className="w-full h-12 flex items-center justify-center gap-2 bg-black text-white rounded-xl text-xs font-bold hover:scale-[1.02] transition-all"
                                                >
                                                    Set In-Progress
                                                </button>
                                            )}
                                            {complaint.status !== 'Resolved' && (
                                                <button
                                                    onClick={() => handleUpdateStatus('Resolved')}
                                                    className="w-full h-12 flex items-center justify-center gap-2 bg-green-600 text-white rounded-xl text-xs font-bold hover:scale-[1.02] transition-all"
                                                >
                                                    Mark Resolved
                                                </button>
                                            )}
                                            {role === 'Admin' && (
                                                <div className="space-y-2 mt-4 pt-4 border-t border-black/5">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Assign Technician</label>
                                                    <select
                                                        onChange={(e) => handleAssignStaff(e.target.value)}
                                                        defaultValue={complaint.assignedTo?._id || ""}
                                                        className="w-full h-12 bg-white border border-black/10 rounded-xl px-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-black/5 appearance-none cursor-pointer"
                                                    >
                                                        <option value="" disabled>Select Staff...</option>
                                                        {staffList.map((staff) => (
                                                            <option key={staff._id} value={staff._id}>
                                                                {staff.name} ({staff.skills?.join(', ') || 'General'})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            {updateMsg && (
                                                <p className="text-[10px] font-bold text-green-600 text-center mt-2 flex items-center justify-center gap-1">
                                                    <Check size={12} /> {updateMsg}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-12 space-y-8">
                            <div>
                                <h3 className="text-sm font-black text-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <MessageSquare size={16} />
                                    Detailed Description
                                </h3>
                                <div className="p-8 bg-slate-50 rounded-[2rem] text-slate-700 font-medium leading-relaxed">
                                    {complaint.description}
                                </div>
                            </div>

                            {complaint.attachment && (
                                <div>
                                    <h3 className="text-sm font-black text-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Paperclip size={16} />
                                        Attachments
                                    </h3>
                                    <div className="flex items-center gap-3 p-4 border border-black/[0.05] rounded-2xl w-fit group cursor-pointer hover:bg-black hover:text-white transition-all">
                                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white/10 group-hover:text-white">
                                            <Paperclip size={18} />
                                        </div>
                                        <div className="pr-4">
                                            <p className="text-xs font-bold">attachment_file.pdf</p>
                                            <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Click to view</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Removed embedded chat - now a popup */}

                            {/* Resolution Notes Section */}
                            <div className="pt-8 border-t border-slate-100">
                                <h3 className="text-sm font-black text-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <FileText size={16} />
                                    Resolution Notes
                                </h3>

                                {(role === 'Staff' || role === 'Admin') ? (
                                    <div className="space-y-4">
                                        <textarea
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder="Write resolution details or status updates here..."
                                            className="w-full p-6 bg-slate-50 border border-black/[0.03] rounded-[2rem] text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-black/5 transition-all resize-none min-h-[120px]"
                                        />
                                        <button
                                            onClick={handleUpdateNotes}
                                            disabled={updating}
                                            className="px-8 py-3 bg-black text-white rounded-xl text-xs font-bold hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            Update Notes
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-8 bg-black/5 rounded-[2rem] text-slate-600 font-medium italic">
                                        {complaint.resolutionNotes || "No resolution notes yet. Our team will provide updates here."}
                                    </div>
                                )}
                            </div>

                            {/* Feedback Section */}
                            {(complaint.status === 'Resolved' || complaint.status === 'Closed' || complaint.feedback?.rating) && (
                                <div className="pt-8 border-t border-slate-100">
                                    <h3 className="text-sm font-black text-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <Heart size={16} className="text-red-500" />
                                        Service Feedback
                                    </h3>

                                    {complaint.feedback?.rating ? (
                                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-black/[0.02]">
                                            <div className="flex gap-1 mb-4">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        size={20}
                                                        fill={s <= complaint.feedback.rating ? "#000" : "none"}
                                                        className={s <= complaint.feedback.rating ? "text-black" : "text-slate-200"}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-slate-700 font-medium leading-relaxed italic">
                                                "{complaint.feedback.comment || "No specific comments provided."}"
                                            </p>
                                        </div>
                                    ) : role === 'User' ? (
                                        <div className="bg-white p-8 rounded-[2.5rem] border border-black/[0.05] shadow-[0_10px_40px_rgba(0,0,0,0.02)] space-y-6">
                                            <div className="space-y-4">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rate the service</p>
                                                <div className="flex gap-3">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <button
                                                            key={s}
                                                            onClick={() => setFeedback({ ...feedback, rating: s })}
                                                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${feedback.rating === s ? 'bg-black text-white scale-110 shadow-lg' : 'bg-slate-50 text-slate-300 hover:text-black hover:bg-slate-100'}`}
                                                        >
                                                            <Star size={24} fill={feedback.rating === s ? "currentColor" : "none"} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Additional comments (Optional)</p>
                                                <textarea
                                                    value={feedback.comment}
                                                    onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                                                    placeholder="How was your experience with the resolution?"
                                                    className="w-full p-6 bg-slate-50 border border-black/[0.03] rounded-2xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-black/5 transition-all resize-none h-24"
                                                />
                                            </div>

                                            <button
                                                onClick={handleUpdateFeedback}
                                                disabled={submittingFeedback}
                                                className="w-full py-4 bg-black text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                                            >
                                                {submittingFeedback ? <Loader2 className="animate-spin" size={18} /> : "Submit Feedback"}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="p-8 bg-slate-50 rounded-[2rem] text-slate-400 font-medium italic text-center text-sm">
                                            User has not provided feedback yet.
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Timeline Placeholder */}
                            <div className="pt-8 border-t border-slate-100">
                                <h3 className="text-sm font-black text-black uppercase tracking-widest mb-8">Resolution Timeline</h3>
                                <div className="space-y-8 ml-4">
                                    <div className="relative pl-8 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-3 before:bg-black before:rounded-full after:absolute after:left-[5px] after:top-[calc(50%+12px)] after:w-[2px] after:h-12 after:bg-slate-100">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{formatDate(complaint.createdAt)}</p>
                                        <p className="font-bold text-black">Complaint Registered</p>
                                        <p className="text-xs text-slate-500 font-medium">System generated the unique ID: {complaint.complaint_unique_id}</p>
                                    </div>
                                    {complaint.status !== 'Open' && (
                                        <div className="relative pl-8 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-3 before:bg-slate-200 before:rounded-full">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Updated recently</p>
                                            <p className="font-bold text-black">Status changed to {complaint.status}</p>
                                            <p className="text-xs text-slate-500 font-medium">The complaint is being processed by our team.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Chat Popup Widget */}
            <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
                {showChat && (
                    <div className="w-[380px] h-[550px] bg-white rounded-[2.5rem] shadow-[0_25px_80px_rgba(0,0,0,0.15)] border border-black/5 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
                        {/* Chat Header */}
                        <div className="bg-black p-6 flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center relative">
                                    <MessageCircle size={20} />
                                    <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-widest">Support Chat</h4>
                                    <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Case ID: {complaint.complaint_unique_id}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowChat(false)}
                                className="p-2 hover:bg-white/10 rounded-xl transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-2">
                                    <MessageSquare size={32} strokeWidth={1} />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No messages yet</p>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const isMine = msg.sender?._id === (currentUser?.id || currentUser?._id);
                                    return (
                                        <div key={index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${isMine ? 'bg-black text-white rounded-tr-none' : 'bg-white text-black rounded-tl-none border border-black/5'}`}>
                                                {!isMine && (
                                                    <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-50">
                                                        {msg.sender?.name}
                                                    </p>
                                                )}
                                                <p className="font-medium leading-relaxed">{msg.text}</p>
                                                <p className={`text-[8px] mt-2 opacity-30 font-bold uppercase tracking-widest ${isMine ? 'text-right' : 'text-left'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-black/5">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Message staff..."
                                    className="flex-grow bg-slate-50 border-none focus:ring-2 focus:ring-black/5 rounded-2xl px-5 text-sm font-medium"
                                />
                                <button
                                    type="submit"
                                    className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center hover:scale-[1.05] active:scale-95 transition-all shadow-lg shadow-black/10"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Floating Button */}
                <button
                    onClick={() => setShowChat(!showChat)}
                    className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 ${showChat ? 'bg-slate-100 text-black rotate-90' : 'bg-black text-white hover:scale-105'}`}
                >
                    {showChat ? <X size={24} /> : (
                        <div className="relative">
                            <MessageCircle size={28} />
                            {messages.length > 0 && !showChat && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black flex items-center justify-center">
                                    <span className="text-[8px] font-black text-white">{messages.length > 9 ? '9+' : messages.length}</span>
                                </div>
                            )}
                        </div>
                    )}
                </button>
            </div>

            <Footer />
        </div>
    );
};

export default ComplaintDetails;
