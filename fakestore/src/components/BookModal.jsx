import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Edit3, Trash2, Plus, Loader2 } from 'lucide-react';

const BookModal = ({ isOpen, onClose, onSubmit, book, isEdit, isLoading }) => {
    const [formData, setFormData] = useState(
        book || { title: '', description: '', pageCount: 0, excerpt: '', publishDate: new Date().toISOString() }
    );

    useEffect(() => {
        if (!isOpen) return;
        document.body.classList.add('overflow-hidden');
        return () => document.body.classList.remove('overflow-hidden');
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 modal-backdrop animate-in fade-in duration-500">
            <div className="bg-white w-full max-w-sm rounded-xl shadow-md border border-slate-100 overflow-hidden transform transition-all max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0">
                    <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${isEdit ? 'bg-primary-50 text-primary-600' : 'bg-primary-600 text-white'}`}>
                            {isEdit ? <Edit3 size={16} /> : <Plus size={16} />}
                        </div>
                        {isEdit ? 'Refine Book' : 'New Publication'}
                    </h3>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-50 rounded-lg transition-all text-slate-400 hover:text-primary-600">
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto px-5 py-5 custom-scrollbar">
                    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
                        <div className="space-y-4">
                            <div className="group">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 block px-0.5 group-focus-within:text-primary-600 transition-colors">Book Identity</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500/50 focus:bg-white transition-all outline-none"
                                    placeholder="Title..."
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="group">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 block px-0.5 group-focus-within:text-primary-600 transition-colors">Narrative Summary</label>
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500/50 focus:bg-white transition-all outline-none min-h-[80px] resize-none"
                                    placeholder="Description..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="group">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 block px-0.5 group-focus-within:text-primary-600 transition-colors">Teaser Excerpt</label>
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500/50 focus:bg-white transition-all outline-none min-h-[60px] resize-none"
                                    placeholder="Snippet..."
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="group">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 block px-0.5 group-focus-within:text-primary-600 transition-colors">Volume</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500/50 focus:bg-white transition-all outline-none"
                                        value={formData.pageCount}
                                        onChange={(e) => setFormData({ ...formData, pageCount: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="group">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 block px-0.5 group-focus-within:text-primary-600 transition-colors">Date</label>
                                    <input
                                        type="date"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500/50 focus:bg-white transition-all outline-none"
                                        value={formData.publishDate.split('T')[0]}
                                        onChange={(e) => setFormData({ ...formData, publishDate: new Date(e.target.value).toISOString() })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-3 sticky bottom-0 bg-white">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 py-3 px-4 bg-slate-50 text-slate-500 rounded-lg font-black uppercase tracking-widest text-[9px] hover:bg-slate-100 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-[2] py-4 px-6 bg-primary-600 text-white rounded-lg font-black uppercase tracking-widest text-[9px] shadow-sm shadow-primary-600/20 hover:bg-primary-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                                {isEdit ? 'update' : 'Add'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default BookModal;
