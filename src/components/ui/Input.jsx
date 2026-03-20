import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(({ className, label, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
    return (
        <div className="w-full flex flex-col gap-1.5">
            {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
            <div className="relative flex items-center group">
                {leftIcon && (
                    <div className="absolute left-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors flex items-center justify-center pointer-events-none">
                        {leftIcon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'flex w-full rounded-[4px] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors shadow-sm',
                        'focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600',
                        'hover:border-slate-300',
                        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
                        leftIcon && 'pl-9',
                        rightIcon && 'pr-9',
                        error && 'border-rose-500 focus:ring-rose-500 focus:border-rose-500',
                        className
                    )}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-3 text-slate-400 flex items-center justify-center">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && <span className="text-xs text-rose-600 font-medium">{error}</span>}
            {helperText && !error && <span className="text-xs text-slate-500">{helperText}</span>}
        </div>
    );
});

Input.displayName = 'Input';
