import React from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';

const PageHeader = ({
    title,
    subtitle,
    searchValue,
    onSearch,
    searchPlaceholder = 'Search...',
    onAdd,
    addLabel = 'Add',
    isAdding = false,
}) => {
    return (
        <div className="sticky top-[104px] z-[30] bg-slate-50/90 backdrop-blur-md py-6 px-4 -mx-4 flex flex-col md:flex-row justify-between items-center gap-6 transition-all duration-300">
            {/* Left: Title + Subtitle */}
            <div>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{title}</h3>
                {subtitle && (
                    <p className="text-sm text-slate-400 mt-2 font-medium italic">{subtitle}</p>
                )}
            </div>

            {/* Right: Search + Add Button */}
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                {/* Search Input */}
                <div className="relative group w-full md:w-80">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-xs font-bold shadow-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 outline-none transition-all placeholder:text-slate-400"
                        value={searchValue}
                        onChange={onSearch}
                    />
                </div>

                {/* Add Button */}
                <button
                    onClick={onAdd}
                    disabled={isAdding}
                    className="w-full md:w-auto px-6 py-4 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 active:scale-95 disabled:opacity-50 group"
                >
                    {isAdding
                        ? <Loader2 className="animate-spin" size={16} />
                        : <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                    }
                    {addLabel}
                </button>
            </div>
        </div>
    );
};

export default PageHeader;
