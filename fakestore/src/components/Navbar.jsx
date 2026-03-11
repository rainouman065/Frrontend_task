import React from 'react';
import { useSelector } from 'react-redux';
import { Bell, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const activeTab = useSelector((state) => state.ui.activeTab);
    const user = useSelector((state) => state.user);

    return (
        <>
            {/* Scroll Mask: Hides content that scrolls above the floating navbar */}
            <div className="fixed top-0 right-0 left-72 h-10 bg-slate-50 z-[45]" />
            
            <nav className="fixed top-6 right-8 left-[20rem] h-20 bg-white z-[50] px-14 flex items-center justify-between border border-slate-100 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] transition-all duration-500">
            {/* Left Section: Page Indicator */}
            <div className="flex items-center gap-4">
                <div className="w-1.5 h-8 bg-primary-600 rounded-full" />
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">
                        {activeTab}
                    </h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">
                        Workspace / <span className="text-primary-600">{activeTab}</span>
                    </p>
                </div>
            </div>

            {/* Right Section: User & Notifications */}
            <div className="flex items-center gap-6 md:gap-8">
                
                {/* Notification Icon */}
                <div className="flex items-center gap-2 pr-6 border-r border-slate-100">
                    <button className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all relative">
                        <Bell size={20} />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 border-2 border-white rounded-full"></span>
                    </button>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 md:gap-4 group cursor-pointer">
                    <div className="text-right flex flex-col justify-center">
                        <span className="text-sm font-black text-slate-900 leading-tight tracking-tight group-hover:text-primary-600 transition-colors">
                            {user.name}
                        </span>
                        <span className="text-[10px] text-primary-600 font-bold uppercase tracking-widest mt-0.5 opacity-80">
                            {user.role}
                        </span>
                    </div>
                    
                    <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 p-0.5 shadow-lg group-hover:rotate-6 transition-transform duration-300">
                            <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center font-black text-slate-900 text-xs">
                                {user.initials}
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -right-0.5 w-3.5 h-3.5 bg-accent-500 border-2 border-white rounded-full shadow-sm" />
                    </div>
                    
                    <ChevronDown size={14} className="text-slate-400 group-hover:text-primary-600 transition-all group-hover:translate-y-0.5" />
                </div>
            </div>
        </nav>
        </>
    );
};

export default Navbar;