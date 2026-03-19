import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

/**
 * Reusable Edit + Delete action buttons for table rows.
 * Props:
 *  - onEdit   : fn — called when Edit button is clicked
 *  - onDelete : fn — called when Delete button is clicked
 */
import { RowActionsProps } from '../types';

const RowActions: React.FC<RowActionsProps> = ({ onEdit, onDelete }) => {
    return (
        <div className="flex justify-end gap-2">
            <button
                onClick={onEdit}
                className="p-3 bg-white hover:bg-slate-900 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-100 hover:border-slate-800 shadow-sm"
            >
                <Edit3 size={18} />
            </button>
            <button
                onClick={onDelete}
                className="p-3 bg-white hover:bg-rose-600 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-100 hover:border-rose-500 shadow-sm"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
};

export default RowActions;
