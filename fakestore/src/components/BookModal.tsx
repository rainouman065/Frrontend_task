import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Edit3, Trash2, Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book } from '../types';

interface BookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (book: Partial<Book>) => void;
    book?: Book | null;
    isEdit: boolean;
    isLoading: boolean;
}

const BookModal: React.FC<BookModalProps> = ({ isOpen, onClose, onSubmit, book, isEdit, isLoading }) => {
    const [formData, setFormData] = useState(
        book || { title: '', description: '', pageCount: 0, excerpt: '', publishDate: new Date().toISOString() }
    );

    useEffect(() => {
        if (!isOpen) return;
        document.body.classList.add('overflow-hidden');
        return () => document.body.classList.remove('overflow-hidden');
    }, [isOpen]);

    if (typeof window === 'undefined') return null;

    return createPortal(
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
                                <div className={`p-2 rounded-xl shadow-sm ${isEdit ? 'bg-primary-500/10 text-primary-600' : 'bg-slate-900 text-white'}`}>
                                    {isEdit ? <Edit3 size={18} /> : <Plus size={18} />}
                                </div>
                                {isEdit ? 'Refine Book' : 'New Publication'}
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
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 group-focus-within:text-primary-600 transition-colors">Book Identity</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 shadow-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                                            placeholder="Title..."
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 group-focus-within:text-primary-600 transition-colors">Narrative Summary</label>
                                        <textarea
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 shadow-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none min-h-[80px] resize-none"
                                            placeholder="Description..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 group-focus-within:text-primary-600 transition-colors">Teaser Excerpt</label>
                                        <textarea
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 shadow-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none min-h-[60px] resize-none"
                                            placeholder="Snippet..."
                                            value={formData.excerpt}
                                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="group">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 group-focus-within:text-primary-600 transition-colors">Volume</label>
                                            <input
                                                type="number"
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 shadow-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                                                value={formData.pageCount}
                                                onChange={(e) => setFormData({ ...formData, pageCount: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 group-focus-within:text-primary-600 transition-colors">Date</label>
                                            <input
                                                type="date"
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 shadow-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                                                value={formData.publishDate.split('T')[0]}
                                                onChange={(e) => setFormData({ ...formData, publishDate: new Date(e.target.value).toISOString() })}
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
                                        className="flex-[2] py-3 px-6 bg-primary-600 text-white rounded-xl font-bold text-sm shadow-md shadow-primary-600/20 hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                        {isEdit ? 'Update Book' : 'Add Book'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default BookModal;
