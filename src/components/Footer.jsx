import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-black text-white font-['Outfit'] border-t border-white/5">
            <div className="px-6 py-16 md:px-16 grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Column 1: Brand */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">ResolveDesk</h2>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                        Centralized grievance redressal system empowering citizens with faster resolutions and transparent tracking.
                    </p>
                </div>

                {/* Column 2: Company */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold">Company</h3>
                    <ul className="space-y-4">
                        <li><a href="/" className="text-slate-400 hover:text-white transition-colors text-sm">Home</a></li>
                        <li><a href="/about" className="text-slate-400 hover:text-white transition-colors text-sm">About Us</a></li>
                        <li><a href="/features" className="text-slate-400 hover:text-white transition-colors text-sm">Features</a></li>
                    </ul>
                </div>

                {/* Column 3: Support */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold">Support</h3>
                    <ul className="space-y-4">
                        <li><a href="/track" className="text-slate-400 hover:text-white transition-colors text-sm">Track Status</a></li>
                        <li><a href="/help" className="text-slate-400 hover:text-white transition-colors text-sm">Help Center</a></li>
                        <li><a href="/contact" className="text-slate-400 hover:text-white transition-colors text-sm">Contact Support</a></li>
                    </ul>
                </div>

                {/* Column 4: Contact */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold">Contact</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-slate-400">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                                </svg>
                            </div>
                            <span className="text-slate-400 text-sm">support@resolvedesk.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-slate-400">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </div>
                            <span className="text-slate-400 text-sm">+1 (800) 123-4567</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom: Copyright */}
            <div className="border-t border-white/5 px-6 py-8 md:px-16 text-center">
                <p className="text-slate-500 text-xs">
                    © 2025 ResolveDesk. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
