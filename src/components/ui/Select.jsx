import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

export const Select = React.forwardRef(({ className, label, error, helperText, options = [], ...props }, ref) => {
    return (
        <div className="w-full flex flex-col gap-1.5">
            {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
            <div className="relative">
                <select
                    ref={ref}
                    className={cn(
                        'flex w-full appearance-none rounded-[4px] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-colors shadow-sm',
                        'focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600',
                        'hover:border-slate-300 cursor-pointer',
                        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
                        error && 'border-rose-500 focus:ring-rose-500 focus:border-rose-500',
                        className
                    )}
                    {...props}
                >
                    {options.map((opt, i) => (
                        <option key={i} value={opt.value} className="bg-white text-slate-900">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                </div>
            </div>
            {error && <span className="text-xs text-rose-600 font-medium">{error}</span>}
            {helperText && !error && <span className="text-xs text-slate-500">{helperText}</span>}
        </div>
    );
});

Select.displayName = 'Select';
