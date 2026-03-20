import React from 'react';
import { cn } from '../../lib/utils';
import { FileQuestion } from 'lucide-react';

export const EmptyState = ({
    icon = <FileQuestion className="w-12 h-12 text-gray-300" />,
    title = "No data available",
    description = "There is nothing to show here at the moment.",
    action,
    className
}) => {
    return (
        <div className={cn("flex flex-col items-center justify-center p-8 text-center min-h-[300px] border border-dashed rounded-xl border-border bg-gray-50/30", className)}>
            <div className="mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
            <p className="text-sm text-text-secondary max-w-sm mb-6">{description}</p>
            {action && (
                <div className="mt-2">
                    {action}
                </div>
            )}
        </div>
    );
};
