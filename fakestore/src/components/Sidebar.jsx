import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setActiveTab } from '../store/uiSlice';
import { Book, Users, UserCheck, Activity, Image, LayoutDashboard, ChevronRight } from 'lucide-react';

const Sidebar = () => {
    const dispatch = useDispatch();

    const menuItems = [
        { name: 'Books', icon: <Book size={20} />, path: '/books' },
        { name: 'Authors', icon: <UserCheck size={20} />, path: '/authors' },
        { name: 'Users', icon: <Users size={20} />, path: '/users' },
        { name: 'Activities', icon: <Activity size={20} />, path: '/activities' },
        { name: 'Gallery', icon: <Image size={20} />, path: '/gallery' },
    ];

    return (
        <div className="w-72 bg-white h-screen text-slate-800 flex flex-col fixed left-0 top-0 border-r border-slate-100 transition-all duration-300 z-[50]">
            <div className="p-10 flex items-center gap-4">
                <div className="bg-primary-600 p-2.5 rounded-2xl text-white shadow-lg shadow-primary-600/20">
                    <LayoutDashboard size={20} />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 italic">
                    Agile<span className="text-primary-600">Tech</span>
                </h1>
            </div>

            <nav className="flex-1 mt-4 px-6">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 px-4">
                    Main Navigation
                </div>
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.path}
                                onClick={() => dispatch(setActiveTab(item.name))}
                                className={({ isActive }) => `w-full flex items-center gap-4 px-8 py-4 rounded-2xl transition-all duration-300 group relative ${isActive
                                    ? 'bg-primary-50 text-primary-600 shadow-sm'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className={`transition-colors ${isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                            {item.icon}
                                        </span>
                                        <span className="font-bold text-[15px]">{item.name}</span>
                                        {isActive ? (
                                            <ChevronRight size={16} className="ml-auto opacity-100" />
                                        ) : (
                                            <ChevronRight size={16} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            
        </div>
    );
};

export default Sidebar;
