import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Full-page centered loading spinner.
 * Props:
 *  - message : string — optional loading text (default: "Loading...")
 */
const LoadingSpinner = ({ message = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <Loader2 className="animate-spin text-primary-600" size={48} />
            <p className="text-slate-500 font-medium animate-pulse uppercase tracking-[0.2em] text-[10px]">
                {message}
            </p>
        </div>
    );
};

export default LoadingSpinner;
