import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, ChevronDown, Menu } from 'lucide-react';
import { toggleSidebar } from '../store/uiSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const activeTab = useSelector((state) => state.ui.activeTab);
    const user = useSelector((state) => state.user);

    return (
        <>
            {/* Scroll Mask */}
            <div className="fixed top-0 right-0 left-0 lg:left-72 h-10 bg-slate-50 z-[45]" />

            <nav className="fixed top-6 right-4 left-4 lg:left-[20rem] lg:right-8 h-16 lg:h-20 bg-white z-[50] px-5 lg:px-14 flex items-center justify-between border border-slate-100 shadow-2xl shadow-slate-200/50 rounded-[2rem] lg:rounded-[2.5rem] transition-all duration-500">

                {/* Left Section */}
                <div className="flex items-center gap-3 lg:gap-4">
                    {/* Hamburger — only on mobile */}
                    <button
                        className="lg:hidden p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                        onClick={() => dispatch(toggleSidebar())}
                    >
                        <Menu size={22} />
                    </button>

                    <div className="w-1.5 h-8 bg-primary-600 rounded-full hidden sm:block" />
                    <div>
                        <h2 className="text-lg lg:text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">
                            {activeTab}
                        </h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 hidden sm:block">
                            Workspace / <span className="text-primary-600">{activeTab}</span>
                        </p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4 lg:gap-8">

                    {/* Notification Icon */}
                    <div className="flex items-center gap-2 pr-4 lg:pr-6 border-r border-slate-100">
                        <button className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 border-2 border-white rounded-full"></span>
                        </button>
                    </div>

                    {/* User Profile */}
                    <div className="flex items-center gap-2 lg:gap-4 group cursor-pointer">
                        <div className="text-right flex-col justify-center hidden sm:flex">
                            <span className="text-sm font-black text-slate-900 leading-tight tracking-tight group-hover:text-primary-600 transition-colors">
                                {user.name}
                            </span>
                            <span className="text-[10px] text-primary-600 font-bold uppercase tracking-widest mt-0.5 opacity-80">
                                {user.role}
                            </span>
                        </div>

                        <div className="relative">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 p-0.5 shadow-lg group-hover:rotate-6 transition-transform duration-300">
                                <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center font-black text-slate-900 text-xs">
                                    {user.initials}
                                </div>
                            </div>
                            <div className="absolute -bottom-1 -right-0.5 w-3.5 h-3.5 bg-accent-500 border-2 border-white rounded-full shadow-sm" />
                        </div>

                        <ChevronDown size={14} className="text-slate-400 group-hover:text-primary-600 transition-all group-hover:translate-y-0.5 hidden sm:block" />
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;