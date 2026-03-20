import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50/50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md text-center"
            >
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-blue-100 rounded-full">
                        <AlertCircle className="w-12 h-12 text-primary" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-text-primary mb-4">
                    Page not found
                </h1>
                <p className="text-text-secondary mb-8 leading-relaxed">
                    Sorry, we couldn’t find the page you’re looking for. It might have been removed, renamed, or didn’t exist in the first place.
                </p>
                <Link to="/">
                    <Button size="lg" className="inline-flex items-center group">
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to homepage
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
};
