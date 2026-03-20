import React, { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';

const FAQ_DATA = [
    {
        category: "Getting Started",
        questions: [
            {
                q: "Who can use Book Bridges?",
                a: "Book Bridges is exclusively designed for verified university students. You must sign up using a valid .edu academic email address to access the trading network."
            },
            {
                q: "Is it free to use?",
                a: "Yes! Creating an account and listing your materials is 100% free. We don't take any cuts or transaction fees. You keep exactly what you negotiate."
            }
        ]
    },
    {
        category: "Trading & Logistics",
        questions: [
            {
                q: "How do I facilitate a transaction?",
                a: "Once you agree to a trade or sale via our secure messaging system, you and the other student should arrange a safe, public meetup location on campus (e.g., the student union or main library) to complete the exchange."
            },
            {
                q: "What if a user doesn't show up?",
                a: "If a user fails to attend a planned handover without prior notice, you can report them. Accruing 3 strikes will result in a permanent ban from the network."
            },
            {
                q: "How do payments work?",
                a: "Book Bridges does not handle payment processing natively. Students are encouraged to use Cash, Venmo, or other peer-to-peer payment apps during the in-person handover."
            }
        ]
    },
    {
        category: "Safety & Account",
        questions: [
            {
                q: "Are my details public?",
                a: "Only your name, major, and graduation year are visible to verified users. Your contact details remain private until you explicitly share them in a direct message."
            },
            {
                q: "What items are prohibited?",
                a: "Illegal materials, non-academic literature that violates code of conduct, and access codes previously redeemed cannot be sold on Book Bridges. All listings pass through an AI Auto-Moderation queue."
            }
        ]
    }
];

export const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState(`0-0`);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="flex flex-col flex-1 w-full max-w-4xl mx-auto px-4 lg:px-8 py-12 lg:py-20">
            <div className="text-center mb-16">
                <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-6">Frequently Asked Questions</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Everything you need to know about navigating the Book Bridges academic network.
                </p>
            </div>

            <div className="space-y-12">
                {FAQ_DATA.map((section, sectionIdx) => (
                    <div key={sectionIdx}>
                        <h2 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">
                            {section.category}
                        </h2>
                        <div className="space-y-4">
                            {section.questions.map((faq, faqIdx) => {
                                const index = `${sectionIdx}-${faqIdx}`;
                                const isOpen = openIndex === index;
                                return (
                                    <div
                                        key={faqIdx}
                                        className={`border rounded-xl transition-all duration-300 ${isOpen ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                    >
                                        <button
                                            onClick={() => toggleFaq(index)}
                                            className="flex items-center justify-between w-full p-6 text-left focus:outline-none"
                                        >
                                            <span className={`font-semibold text-base ${isOpen ? 'text-indigo-900' : 'text-slate-800'}`}>
                                                {faq.q}
                                            </span>
                                            <div className={`ml-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`}>
                                                {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                            </div>
                                        </button>
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                        >
                                            <div className="p-6 pt-0 text-slate-600 leading-relaxed">
                                                {faq.a}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
