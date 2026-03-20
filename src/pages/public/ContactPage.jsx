import React from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';

export const ContactPage = () => {
    return (
        <div className="flex flex-col flex-1 w-full max-w-6xl mx-auto px-4 lg:px-8 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                {/* Left Column: Info */}
                <div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-6">Let's start a conversation.</h1>
                    <p className="text-lg text-slate-600 mb-12">
                        Whether you have a question about a transaction, need to report a violation, or want to suggest a new feature, our administrative team is listening.
                    </p>

                    <div className="space-y-8">
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                <Mail className="w-6 h-6 text-indigo-700" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Email Us</h3>
                                <p className="text-sm text-slate-500 mb-2">For general inquiries and support.</p>
                                <a href="mailto:support@bookbridges.edu" className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
                                    support@bookbridges.edu
                                </a>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                                <MapPin className="w-6 h-6 text-emerald-700" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Visit Our Office</h3>
                                <p className="text-sm text-slate-500 mb-2">Student Union, Room 402</p>
                                <p className="text-sm text-slate-700 font-medium">
                                    Main Campus<br />
                                    University Ave<br />
                                    Open Mon-Fri, 9am - 4pm
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                                <Phone className="w-6 h-6 text-amber-700" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Urgent Matters</h3>
                                <p className="text-sm text-slate-500 mb-2">For critical transactional disputes.</p>
                                <a href="tel:555-0198" className="text-amber-600 font-semibold hover:text-amber-800 transition-colors">
                                    (555) 012-3498
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Form */}
                <div>
                    <Card className="shadow-lg border-slate-200">
                        <CardContent className="p-8 lg:p-10 space-y-6">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Send a Message</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Input label="First Name" placeholder="Alex" />
                                <Input label="Last Name" placeholder="Student" />
                            </div>

                            <Input label="Academic Email" type="email" placeholder="alex@campus.edu" />

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700 block mb-1">Inquiry Type</label>
                                <select className="w-full h-11 px-3 py-2 bg-white border border-slate-300 rounded-[4px] text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow">
                                    <option>General Question</option>
                                    <option>Transaction Dispute</option>
                                    <option>Account Issue</option>
                                    <option>Feedback & Suggestions</option>
                                    <option>Report a Violation</option>
                                </select>
                            </div>

                            <Textarea
                                label="Message"
                                placeholder="How can we help you today?"
                                className="min-h-[150px]"
                            />

                            <Button className="w-full" shadow="md" leftIcon={<Send className="w-4 h-4" />}>
                                Send Message
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
