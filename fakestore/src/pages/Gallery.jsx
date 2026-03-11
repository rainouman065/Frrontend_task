import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCoverPhotos } from '../api';
import { Image, Loader2, AlertCircle, Maximize2, Search } from 'lucide-react';

const Gallery = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { data: photos, isLoading, isError, error } = useQuery({
        queryKey: ['coverPhotos'],
        queryFn: fetchCoverPhotos,
    });

    const filteredPhotos = useMemo(() => {
        if (!photos) return [];
        return photos.filter(photo => 
            photo.idBook.toString().includes(searchTerm)
        );
    }, [photos, searchTerm]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <Loader2 className="animate-spin text-primary-600" size={48} />
                <p className="text-slate-500 font-medium animate-pulse tracking-[0.2em] uppercase text-[10px]">Processing Archives...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-red-500 gap-4">
                <AlertCircle size={48} />
                <h3 className="text-xl font-bold">Failed to load gallery</h3>
                <p className="text-slate-500">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 mb-20">
            {/* Sticky Header Section */}
            <div className="sticky top-[104px] z-[30] glass-header py-6 px-4 -mx-4 flex flex-col md:flex-row justify-between items-end gap-6 transition-all duration-300">
                <div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">Visual Archives</h3>
                    <p className="text-sm text-slate-400 mt-2 font-medium">A curated collection of {photos?.length} book cover designs.</p>
                </div>
                
                <div className="relative group w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search Book ID..."
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-xs font-bold shadow-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 outline-none transition-all placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
                {filteredPhotos?.map((photo) => (
                    <div key={photo.id} className="group relative aspect-square rounded-[2rem] overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2">
                        <img
                            src={photo.url || `https://picsum.photos/seed/${photo.id}/600/600`}
                            alt="Cover"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0">
                            <div className="flex justify-between items-end text-white">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 mb-1">Cover Photo</p>
                                    <p className="text-sm font-bold tracking-tight">#{photo.idBook} Document ID</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <div className="w-8 h-0.5 bg-primary-500 rounded-full" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Restricted</span>
                                    </div>
                                </div>
                                <button className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl hover:bg-primary-600 transition-all duration-300 border border-white/10 group/btn">
                                    <Maximize2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>
                        {/* Corner Tag */}
                        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[8px] font-black text-primary-400 uppercase tracking-widest">Live View</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
