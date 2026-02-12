import React, { useState, useEffect } from 'react';
import NavBar from '../components/navBar';
import Footer from '../components/Footer';
import api from '../utils/api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import {
    LayoutDashboard, Users, ClipboardList, Activity, TrendingUp,
    CheckCircle2, AlertCircle, Clock, Loader2
} from 'lucide-react';

const AdminAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await api.get('/complaints/analytics');
            if (res.data.success) {
                setData(res.data.data);
            }
        } catch (err) {
            setError('Failed to load analytics data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#000000', '#6366f1', '#10b981', '#f59e0b', '#ef4444'];

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

    if (!data) return null;

    // Prepare data for charts
    const statusData = data.statusCounts.map(s => ({ name: s._id, value: s.count }));
    const categoryData = data.categoryCounts.map(c => ({ name: c._id, count: c.count }));
    const timelineData = data.recentStats.map(r => ({ date: r._id, complaints: r.count }));

    return (
        <div className="flex flex-col min-h-screen bg-[#fcfcfc] font-['Outfit'] select-none">
            <NavBar />

            <main className="flex-grow pt-32 pb-20 px-6 md:px-16">
                <div className="max-w-7xl mx-auto space-y-12">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black text-black tracking-tight flex items-center gap-4">
                                <LayoutDashboard size={40} />
                                Analytics Dashboard
                            </h1>
                            <p className="text-slate-500 font-medium">System-wide performance and user metrics.</p>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-black/[0.03] shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col gap-4">
                            <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg shadow-black/10">
                                <ClipboardList size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Complaints</p>
                                <p className="text-3xl font-black text-black tracking-tighter">{data.totalComplaints}</p>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-black/[0.03] shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col gap-4">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Staff</p>
                                <p className="text-3xl font-black text-black tracking-tighter">{data.totalStaff}</p>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-black/[0.03] shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col gap-4">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Resolved</p>
                                <p className="text-3xl font-black text-black tracking-tighter">
                                    {data.statusCounts.find(s => s._id === 'Resolved')?.count || 0}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-black/[0.03] shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col gap-4">
                            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Efficiency</p>
                                <p className="text-3xl font-black text-black tracking-tighter">
                                    {data.totalComplaints > 0
                                        ? Math.round(((data.statusCounts.find(s => s._id === 'Resolved')?.count || 0) / data.totalComplaints) * 100)
                                        : 0}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Weekly Activity Line Chart */}
                        <div className="bg-white p-10 rounded-[3rem] border border-black/[0.03] shadow-[0_20px_60px_rgba(0,0,0,0.02)]">
                            <h3 className="text-lg font-black text-black mb-8 flex items-center gap-3">
                                <Activity size={20} className="text-slate-400" />
                                Complaint Velocity (7D)
                            </h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={timelineData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', fontWeight: 700 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="complaints"
                                            stroke="#000"
                                            strokeWidth={4}
                                            dot={{ r: 6, fill: '#000', strokeWidth: 3, stroke: '#fff' }}
                                            activeDot={{ r: 8 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Category Distribution Bar Chart */}
                        <div className="bg-white p-10 rounded-[3rem] border border-black/[0.03] shadow-[0_20px_60px_rgba(0,0,0,0.02)]">
                            <h3 className="text-lg font-black text-black mb-8 flex items-center gap-3">
                                <AlertCircle size={20} className="text-slate-400" />
                                Distribution by Category
                            </h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={categoryData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#000', fontSize: 11, fontWeight: 800 }}
                                            width={80}
                                        />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', fontWeight: 700 }}
                                        />
                                        <Bar dataKey="count" fill="#000" radius={[0, 10, 10, 0]} barSize={24} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Status Breakdown Pie Chart */}
                        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-black/[0.03] shadow-[0_20px_60px_rgba(0,0,0,0.02)]">
                            <div className="flex flex-col md:flex-row items-center gap-12">
                                <div className="flex-grow space-y-4">
                                    <h3 className="text-lg font-black text-black flex items-center gap-3">
                                        <Clock size={20} className="text-slate-400" />
                                        Resolution Status
                                    </h3>
                                    <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                        Monitor the lifecycle of all complaints. A high concentration in 'Resolved' or 'Closed' indicates optimal performance.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 mt-8">
                                        {statusData.map((entry, index) => (
                                            <div key={entry.name} className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                                <span className="text-xs font-bold text-slate-700">{entry.name}: {entry.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="h-[250px] w-full md:w-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statusData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {statusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', fontWeight: 700 }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AdminAnalytics;
