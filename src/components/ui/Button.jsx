import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const buttonVariants = {
    primary: 'bg-[#4338ca] text-white hover:bg-[#3730a3] shadow-sm font-medium border border-transparent',
    secondary: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm font-medium',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm font-medium border border-transparent',
    ghost: 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium',
};

const buttonSizes = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    icon: 'p-2',
};

export const Button = React.forwardRef(({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
}, ref) => {
    return (
        <motion.button
            whileHover={{ scale: disabled || isLoading ? 1 : 1.01 }}
            whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
            ref={ref}
            disabled={disabled || isLoading}
            className={cn(
                'inline-flex items-center justify-center rounded-[4px] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#4338ca] focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                buttonVariants[variant],
                buttonSizes[size],
                className
            )}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </motion.button>
    );
});

Button.displayName = 'Button';
