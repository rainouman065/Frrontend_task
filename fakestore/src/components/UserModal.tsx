import React, { useEffect, useState } from 'react';
import { X, Save, Edit3, Plus, User as UserIcon, Key, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, BaseModalProps } from '../types';

interface UserModalProps extends BaseModalProps<User> {
    user?: User | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSubmit, user, isEdit, isLoading }) => {
    const [formData, setFormData] = useState(
        user || { userName: '', password: '' }
    );


    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-2xl"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.95, y: 20, opacity: 0 }}
                        transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
                        className="bg-white w-full max-w-sm rounded-[24px] shadow-2xl border border-slate-200/60 overflow-hidden transform max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                                <div className={`p-2 rounded-xl shadow-sm ${isEdit ? 'bg-orange-500/10 text-orange-600' : 'bg-slate-900 text-white'}`}>
                                    {isEdit ? <Edit3 size={18} /> : <Plus size={18} />}
                                </div>
                                {isEdit ? 'Update Profile' : 'New Identity'}
                            </h3>
                            <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-700">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto px-6 py-6 bg-slate-50/30">
                            <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-5">
                                <div className="space-y-5">
                                    <div className="group">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 group-focus-within:text-orange-500 transition-colors">Credential Handle</label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={16} />
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-slate-800 shadow-sm focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none"
                                                placeholder="Username..."
                                                value={formData.userName}
                                                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 group-focus-within:text-orange-500 transition-colors">Security Key</label>
                                        <div className="relative">
                                            <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={16} />
                                            <input
                                                type="password"
                                                required
                                                className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-slate-800 shadow-sm focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none"
                                                placeholder="Password..."
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 sticky bottom-0 bg-white/80 backdrop-blur-md">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={isLoading}
                                        className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-[2] py-3 px-6 bg-orange-600 text-white rounded-xl font-bold text-sm shadow-md shadow-orange-600/20 hover:bg-orange-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                        {isEdit ? 'Update User' : 'Add User'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UserModal;
