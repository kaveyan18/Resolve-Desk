import React, { useState, useEffect } from 'react';
import NavBar from '../components/navBar';
import Footer from '../components/Footer';
import api from '../utils/api';
import {
    Users, Shield, UserCheck, UserX, Search, Filter,
    MoreVertical, Edit3, CheckCircle2, AlertCircle,
    Loader2, Briefcase, Mail, Phone, Tag, Trash2, X
} from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({ skills: '', isActive: true, isApproved: true });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/auth/users');
            if (res.data.success) {
                setUsers(res.data.data);
            }
        } catch (err) {
            setError('Failed to fetch users.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const skillsArray = typeof editData.skills === 'string'
                ? editData.skills.split(',').map(s => s.trim()).filter(s => s !== '')
                : editData.skills;

            const res = await api.put(`/auth/users/${selectedUser._id}`, {
                ...editData,
                skills: skillsArray
            });

            if (res.data.success) {
                setUsers(users.map(u => u._id === selectedUser._id ? res.data.data : u));
                setIsEditModalOpen(false);
                setSelectedUser(null);
            }
        } catch (err) {
            alert('Failed to update user');
        } finally {
            setUpdating(false);
        }
    };

    const toggleUserStatus = async (user) => {
        try {
            const res = await api.put(`/auth/users/${user._id}`, { isActive: !user.isActive });
            if (res.data.success) {
                setUsers(users.map(u => u._id === user._id ? res.data.data : u));
            }
        } catch (err) {
            alert('Failed to toggle user status');
        }
    };

    const approveStaff = async (user) => {
        try {
            const res = await api.put(`/auth/users/${user._id}`, { isApproved: true });
            if (res.data.success) {
                setUsers(users.map(u => u._id === user._id ? res.data.data : u));
            }
        } catch (err) {
            alert('Failed to approve user');
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch =
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.phone.includes(searchTerm);

        const matchesRole = filterRole === 'All' || u.role === filterRole;

        return matchesSearch && matchesRole;
    });

    const openEditModal = (user) => {
        setSelectedUser(user);
        setEditData({
            skills: user.skills?.join(', ') || '',
            isActive: user.isActive,
            isApproved: user.isApproved
        });
        setIsEditModalOpen(true);
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
                <div className="max-w-7xl mx-auto space-y-12">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black text-black tracking-tight flex items-center gap-4">
                                <Users size={40} />
                                User & Staff Management
                            </h1>
                            <p className="text-slate-500 font-medium">Control access, approve staff, and manage system users.</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="bg-white px-6 py-3 rounded-2xl border border-black/5 flex items-center gap-3">
                                <Search size={18} className="text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 placeholder:text-slate-400 w-48"
                                />
                            </div>
                            <div className="bg-white px-4 py-3 rounded-2xl border border-black/5 flex items-center gap-2">
                                <Filter size={18} className="text-slate-400" />
                                <select
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                    className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 cursor-pointer appearance-none"
                                >
                                    <option value="All">All Roles</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Staff">Staff</option>
                                    <option value="User">User</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-[3rem] border border-black/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-black/[0.03]">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status / Approval</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/[0.02]">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center font-black text-lg">
                                                    {user.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-black">{user.name}</p>
                                                    <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${user.role === 'Admin' ? 'bg-black text-white' :
                                                    user.role === 'Staff' ? 'bg-indigo-50 text-indigo-600' :
                                                        'bg-slate-100 text-slate-600'
                                                }`}>
                                                {user.role === 'Admin' ? <Shield size={10} /> : user.role === 'Staff' ? <Briefcase size={10} /> : <Users size={10} />}
                                                {user.role}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                                    {user.isActive ? <CheckCircle2 size={12} /> : <UserX size={12} />}
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </div>
                                                {user.role === 'Staff' && (
                                                    <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${user.isApproved ? 'text-blue-600' : 'text-amber-600 animate-pulse'}`}>
                                                        {user.isApproved ? <Shield size={12} /> : <AlertCircle size={12} />}
                                                        {user.isApproved ? 'Approved' : 'Pending'}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!user.isApproved && user.role === 'Staff' && (
                                                    <button
                                                        onClick={() => approveStaff(user)}
                                                        className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                                        title="Approve Staff"
                                                    >
                                                        <UserCheck size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-black hover:text-white transition-all shadow-sm"
                                                    title="Edit User"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => toggleUserStatus(user)}
                                                    className={`p-2 rounded-xl transition-all shadow-sm ${user.isActive ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'}`}
                                                    title={user.isActive ? "Deactivate User" : "Activate User"}
                                                >
                                                    {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredUsers.length === 0 && (
                            <div className="p-20 text-center">
                                <Users size={48} className="mx-auto text-slate-200 mb-4" />
                                <p className="text-slate-500 font-bold">No users found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-black text-black tracking-tight flex items-center gap-3">
                                <Edit3 size={24} />
                                Manage User
                            </h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl">
                            <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                                {selectedUser.name[0]}
                            </div>
                            <div>
                                <p className="font-bold text-black text-lg">{selectedUser.name}</p>
                                <p className="text-sm text-slate-400 font-medium">{selectedUser.role} • {selectedUser.email}</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateUser} className="space-y-6">
                            {selectedUser.role === 'Staff' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Tag size={12} />
                                        Skills (Comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={editData.skills}
                                        onChange={(e) => setEditData({ ...editData, skills: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm font-bold"
                                        placeholder="Plumbing, Electrical, IT..."
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Status</label>
                                    <select
                                        value={editData.isActive}
                                        onChange={(e) => setEditData({ ...editData, isActive: e.target.value === 'true' })}
                                        className="w-full px-6 py-4 bg-slate-50 border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm font-bold appearance-none cursor-pointer"
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Inactive / Suspended</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Approval</label>
                                    <select
                                        value={editData.isApproved}
                                        onChange={(e) => setEditData({ ...editData, isApproved: e.target.value === 'true' })}
                                        className="w-full px-6 py-4 bg-slate-50 border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm font-bold appearance-none cursor-pointer"
                                    >
                                        <option value="true">Approved</option>
                                        <option value="false">Pending / Restricted</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={updating}
                                className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-black/10 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                            >
                                {updating ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default UserManagement;
