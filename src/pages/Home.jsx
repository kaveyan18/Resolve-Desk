import React, { useState, useEffect } from 'react'
import NavBar from '../components/navBar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import api from '../utils/api'

function Home() {
    const [stats, setStats] = useState({
        totalComplaints: 0,
        resolvedComplaints: 0,
        totalStaff: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/complaints/public/stats');
                if (res.data.success) {
                    setStats(res.data.data);
                }
            } catch (err) {
                console.error('Error fetching public stats:', err);
            }
        };
        fetchStats();
    }, []);
    const features = [
        {
            title: "Lightning Fast Processing",
            description: "AI-powered system categorizes and routes complaints instantly to the right department for swift resolution.",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
            )
        },
        {
            title: "Secure & Confidential",
            description: "End-to-end encryption ensures your sensitive information remains private and protected at all times.",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            )
        },
        {
            title: "Real-time Notifications",
            description: "Stay updated with instant alerts via email, SMS, and push notifications at every step of the process.",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
            )
        },
        {
            title: "Advanced Analytics",
            description: "Gain insights into complaint trends and resolution times with comprehensive graphical reports and dashboards.",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
            )
        },
        {
            title: "Data Privacy",
            description: "Strict data privacy controls to ensure that your personal information is accessible only to authorized personnel.",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            )
        },
        {
            title: "24/7 Availability",
            description: "Submit and track your grievances anytime, anywhere, with our round-the-clock available portal.",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            )
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#fcfcfc] font-['Outfit'] select-none">
            <NavBar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section id="hero" className="px-6 pt-32 pb-20 md:px-16 md:pt-48 md:pb-32 max-w-7xl mx-auto flex flex-col items-start gap-8">
                    <h1 className="text-5xl md:text-7xl font-bold text-black tracking-tight leading-[1.1] max-w-4xl">
                        A Simple, Transparent, and Efficient Way to Raise and Track Complaints
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl leading-relaxed">
                        Submit complaints, monitor progress in real time, and ensure faster resolution through a centralized grievance management system.
                    </p>
                    <div className="flex flex-col items-start gap-6 pt-4">
                        <Link to="/complaints" className="bg-black text-white px-10 py-4 rounded-full font-bold text-lg hover:opacity-80 transition-opacity shadow-xl shadow-black/10">
                            Get Started
                        </Link>
                        <div className="flex items-center gap-2 group cursor-pointer">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-black transition-colors"></div>
                            <span className="text-slate-400 group-hover:text-black transition-colors text-sm font-medium">Scroll</span>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="works" className="px-6 py-24 md:px-16 bg-white">
                    <div className="max-w-7xl mx-auto text-center space-y-4 mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight">How It Works</h2>
                        <p className="text-slate-400 text-lg">A seamless process from submission to resolution.</p>
                    </div>

                    <div className="max-w-6xl mx-auto relative px-4">
                        {/* Connecting Line */}
                        <div className="absolute top-8 left-0 w-full h-[1px] bg-[#e2e8f0] hidden md:block"></div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 relative">
                            {[
                                { step: '1', title: 'Register & Login', desc: 'Create your account to get started.' },
                                { step: '2', title: 'Submit Details', desc: 'Provide complaint details and attachments.' },
                                { step: '3', title: 'Assign Staff', desc: 'Complaint is assigned to relevant staff.' },
                                { step: '4', title: 'Track Status', desc: 'Get real-time updates on progress.' },
                                { step: '5', title: 'Resolution', desc: 'Issue resolved and ticket closed.' }
                            ].map((item, index) => (
                                <div key={index} className="flex flex-col items-center text-center space-y-6 group">
                                    <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-black/20 z-10 transition-transform group-hover:scale-110">
                                        {item.step}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-bold text-black text-lg">{item.title}</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="px-6 py-24 md:px-16 bg-slate-50 border-y border-black/[0.03]">
                    <div className="max-w-7xl mx-auto">
                        <div className="space-y-4 mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight">Powerful Features</h2>
                            <p className="text-slate-500 text-lg max-w-2xl italic">Designed for efficiency, security, and transparency.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div key={index} className="bg-white p-8 rounded-3xl border border-black/[0.03] shadow-sm hover:shadow-xl hover:shadow-black/[0.02] transition-all group">
                                    <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>



                {/* Why This Portal? Section */}
                <section className="px-6 py-24 md:px-16 max-w-7xl mx-auto">
                    <div className="text-center space-y-4 mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight">Why This Portal?</h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Ensuring accountability by allowing users, staff, and administrators to manage, track, and resolve complaints efficiently.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { value: stats.totalComplaints.toString(), label: 'Total Complaints' },
                            { value: stats.resolvedComplaints.toString(), label: 'Resolved' },
                            { value: '24h', label: 'Avg. Resolution' },
                            { value: stats.totalStaff.toString(), label: 'Total Staff' }
                        ].map((stat, index) => (
                            <div key={index} className="bg-white p-10 rounded-[2.5rem] border border-black/[0.03] shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center space-y-2 hover:shadow-[0_8px_40px_rgba(0,0,0,0.04)] transition-all">
                                <span className="text-6xl font-bold text-black tracking-tighter">{stat.value}</span>
                                <span className="text-slate-400 font-medium text-sm border-t border-slate-50 pt-2 w-full">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </section>
                {/* CTA Section */}
                <section className="px-6 py-24 md:px-16 max-w-7xl mx-auto">
                    <div className="bg-black rounded-[2.5rem] md:rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden group">
                        {/* Background subtle glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none"></div>

                        <div className="relative z-10 space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                                    Have an Issue? Let Us Know.
                                </h2>
                                <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                                    Don't let grievances go unheard. Resolve them today.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                                <Link to="/login" className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5">
                                    Raise a Complaint
                                </Link>
                                <Link to="/register" className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5">
                                    Register Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

export default Home;