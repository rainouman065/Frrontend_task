import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { request } from '../api/api';
import { Activity as ActivityIcon, Clock, Loader2, AlertCircle, CircleCheck, CircleDashed } from 'lucide-react';
import { Activity } from '../types';

const Activities = () => {
    const { data: activities, isLoading, isError, error } = useQuery<Activity[], Error>({
        queryKey: ['activities'],
        queryFn: () => request({ url: '/Activities', method: 'GET' }),
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <Loader2 className="animate-spin text-primary-600" size={48} />
                <p className="text-slate-500 font-medium animate-pulse uppercase tracking-[0.2em] text-[10px]">Scanning System...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-red-500 gap-4">
                <AlertCircle size={48} />
                <h3 className="text-xl font-bold">Failed to load activities</h3>
                <p className="text-slate-500">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 mb-20">
            {/* Sticky Header Section */}
            <div className="sticky top-[104px] z-[30] bg-slate-50/90 backdrop-blur-md py-6 px-4 -mx-4 flex items-center justify-between transition-all duration-300">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-600 rounded-[1.2rem] text-white shadow-xl shadow-primary-600/20">
                        <ActivityIcon size={24} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-slate-800 tracking-tight">System Timeline</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Real-time log stream</p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-slate-800 leading-none">{activities?.length}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Logs</span>
                </div>
            </div>

            <div className="relative space-y-8 pb-10">
                {/* Timeline Line */}
                <div className="absolute left-[39px] top-10 bottom-10 w-[2px] bg-gradient-to-b from-primary-200 via-slate-100 to-transparent" />

                {activities?.map((activity) => (
                    <div key={activity.id} className="relative pl-24 group">
                        {/* Timeline Dot */}
                        <div className={`absolute left-0 top-2 w-20 flex justify-center z-10`}>
                            <div className={`w-5 h-5 rounded-full border-4 border-white shadow-md ring-2 ${activity.completed ? 'bg-primary-600 ring-primary-500/20' : 'bg-slate-200 ring-slate-100'} transition-all group-hover:scale-125 duration-500`} />
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group-hover:-translate-x-2 border-l-4 border-l-transparent group-hover:border-l-primary-600">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="text-lg font-black text-slate-800 group-hover:text-primary-700 transition-colors leading-tight tracking-tight">
                                    {activity.title}
                                </h4>
                                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${activity.completed ? 'bg-accent-50 text-accent-700 border border-accent-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                    {activity.completed ? <CircleCheck size={12} /> : <CircleDashed size={12} />}
                                    {activity.completed ? 'Success' : 'Pending'}
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-xs text-slate-400 font-bold uppercase tracking-widest">
                                <span className="flex items-center gap-2 group-hover:text-slate-600 transition-colors">
                                    <Clock size={16} className="text-primary-500" />
                                    {new Date(activity.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                <span className="group-hover:text-slate-600 transition-colors">ID: {activity.id}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Activities;
