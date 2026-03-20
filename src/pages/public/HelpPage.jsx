import React from 'react';
import { BookOpen, LifeBuoy, FileQuestion, MessageCircle, ShieldCheck, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export const HelpPage = () => {
    return (
        <div className="flex flex-col flex-1 w-full max-w-5xl mx-auto px-4 lg:px-8 py-12 lg:py-20">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-50 text-indigo-700 rounded-full mb-6">
                    <LifeBuoy className="w-8 h-8" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-6">How can we help?</h1>
                <p className="text-lg text-slate-600">
                    Find comprehensive guides, policies, and support resources for navigating the Book Bridges campus exchange network.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                <Link to="/faqs" className="group">
                    <Card className="h-full border border-slate-200 hover:border-indigo-200 shadow-sm hover:shadow-md transition-all duration-300">
                        <CardContent className="p-8">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <FileQuestion className="w-6 h-6 text-indigo-700" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">General FAQs</h3>
                            <p className="text-sm text-slate-600">Common questions about accounts, listing materials, and network rules.</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link to="/contact" className="group">
                    <Card className="h-full border border-slate-200 hover:border-emerald-200 shadow-sm hover:shadow-md transition-all duration-300">
                        <CardContent className="p-8">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <MessageCircle className="w-6 h-6 text-emerald-700" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Contact Support</h3>
                            <p className="text-sm text-slate-600">Get in touch with the student administrative team for specific issues.</p>
                        </CardContent>
                    </Card>
                </Link>

                <div className="group cursor-pointer">
                    <Card className="h-full border border-slate-200 hover:border-amber-200 shadow-sm hover:shadow-md transition-all duration-300">
                        <CardContent className="p-8">
                            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <ShieldCheck className="w-6 h-6 text-amber-700" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Safety & Trust</h3>
                            <p className="text-sm text-slate-600">Guidelines for secure on-campus exchanges and dispute resolution.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 lg:p-12 text-center">
                <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Still need assistance?</h3>
                <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                    If you can't find what you're looking for, our student support team is ready to help you with your exchange needs.
                </p>
                <Link to="/contact">
                    <Button shadow="md" className="px-8">Reach Out to Us</Button>
                </Link>
            </div>
        </div>
    );
};
