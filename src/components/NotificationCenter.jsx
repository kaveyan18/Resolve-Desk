import React, { useState, useEffect } from 'react';
import { Bell, Check, Clock, AlertCircle, Activity, User } from 'lucide-react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            if (res.data.success) {
                setNotifications(res.data.data);
                setUnreadCount(res.data.data.filter(n => !n.read).length);
            }
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}`);
            fetchNotifications();
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 bg-white border border-black/5 rounded-full hover:bg-slate-50 transition-all group"
            >
                <Bell size={20} className="text-slate-400 group-hover:text-black transition-colors" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] border border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 overflow-hidden transform origin-top-right transition-all">
                        <div className="p-6 border-b border-black/[0.03] flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xs font-black text-black uppercase tracking-widest">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="text-[10px] font-bold text-slate-400">{unreadCount} unread</span>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((n) => (
                                    <div
                                        key={n._id}
                                        className={`p-5 border-b border-black/[0.02] last:border-0 hover:bg-slate-50 transition-colors flex gap-4 cursor-pointer ${!n.read ? 'bg-black/[0.01]' : ''}`}
                                        onClick={() => {
                                            if (!n.read) markAsRead(n._id);
                                            setIsOpen(false);
                                        }}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!n.read ? 'bg-black text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            {n.type === 'StatusChange' ? <Activity size={18} /> :
                                                n.type === 'Assignment' ? <User size={18} /> :
                                                    <AlertCircle size={18} />}
                                        </div>
                                        <div className="space-y-1">
                                            <p className={`text-xs leading-relaxed ${!n.read ? 'font-bold text-black' : 'text-slate-500 font-medium'}`}>
                                                {n.message}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center space-y-3">
                                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                                        <Bell size={24} />
                                    </div>
                                    <p className="text-xs font-bold text-slate-400">No notifications yet.</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-slate-50/50 border-t border-black/[0.03] text-center">
                            <Link to="/complaints" className="text-[10px] font-black text-black uppercase tracking-widest hover:opacity-70 transition-opacity">
                                View My Complaints
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationCenter;
