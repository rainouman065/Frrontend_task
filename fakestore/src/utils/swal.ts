import Swal from 'sweetalert2';

const basePopup = {
    popup: 'rounded-[1.5rem] shadow-2xl border border-slate-100 p-8',
    title: 'text-xl font-black text-slate-800 tracking-tight',
    htmlContainer: 'text-sm font-medium text-slate-500',
    actions: 'gap-3',
    cancelButton: 'bg-white text-slate-500 border border-slate-200 px-6 py-2.5 rounded-xl text-[10px] font-black hover:bg-slate-50 transition-all uppercase tracking-widest',
};

// For success / info / general actions
export const CustomSwal = Swal.mixin({
    customClass: {
        ...basePopup,
        confirmButton: 'bg-primary-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black hover:bg-primary-700 transition-all uppercase tracking-widest shadow-lg shadow-primary-600/20',
    },
    buttonsStyling: false,
});

// For delete / destructive actions
export const DangerSwal = Swal.mixin({
    customClass: {
        ...basePopup,
        confirmButton: 'bg-rose-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black hover:bg-rose-700 transition-all uppercase tracking-widest shadow-lg shadow-rose-600/20',
    },
    buttonsStyling: false,
});
