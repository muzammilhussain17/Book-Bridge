import React from 'react';
import { cn } from '../../lib/utils';

export const Table = React.forwardRef(({ className, wrapperClassName, ...props }, ref) => (
    <div className={cn("relative w-full overflow-auto rounded-[4px] border border-slate-200 bg-white shadow-sm", wrapperClassName)}>
        <table
            ref={ref}
            className={cn("w-full caption-bottom text-sm text-slate-700", className)}
            {...props}
        />
    </div>
));
Table.displayName = "Table";

export const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("[&_tr]:border-b border-slate-200 bg-slate-50", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef(({ className, ...props }, ref) => (
    <tbody
        ref={ref}
        className={cn("[&_tr:last-child]:border-0 bg-white", className)}
        {...props}
    />
));
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef(({ className, hover = true, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn(
            "border-b border-slate-100 transition-colors",
            hover && "hover:bg-slate-50/80 data-[state=selected]:bg-slate-50",
            className
        )}
        {...props}
    />
));
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={cn(
            "h-11 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0",
            className
        )}
        {...props}
    />
));
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
        {...props}
    />
));
TableCell.displayName = "TableCell";
