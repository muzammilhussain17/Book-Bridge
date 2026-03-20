import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export const Card = React.forwardRef(({ className, children, hoverEffect = false, ...props }, ref) => {
    return (
        <motion.div
            ref={ref}
            whileHover={hoverEffect ? { y: -2, transition: { duration: 0.15 } } : {}}
            className={cn(
                "bg-white rounded-[4px] border border-slate-200 shadow-sm overflow-hidden",
                hoverEffect && "hover:shadow-md transition-all duration-200 cursor-pointer",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
});
Card.displayName = "Card";

export const CardHeader = React.forwardRef(({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white", className)} {...props}>
        {children}
    </div>
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-base font-semibold text-slate-900 leading-none", className)} {...props}>
        {children}
    </h3>
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef(({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-slate-500 mt-1.5", className)} {...props}>
        {children}
    </p>
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef(({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 text-slate-700 text-sm", className)} {...props}>
        {children}
    </div>
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef(({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center", className)} {...props}>
        {children}
    </div>
));
CardFooter.displayName = "CardFooter";
