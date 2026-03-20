import React from 'react';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { BookOpen, Star, RefreshCcw, ShieldCheck, ArrowRight } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-140px)] bg-slate-50">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-white border border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Campus Network Online
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
            The intelligent way to <br className="hidden sm:block" />
            <span className="text-indigo-700">share knowledge.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            A secure, organized platform for students and academics to buy, sell, exchange, and review literature. Built for clarity. Engineered for trust.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto px-10">
                Join Network
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-24 border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Academic Infrastructure</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Everything you need to manage your personal library and connect with peers.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <RefreshCcw className="w-6 h-6 text-indigo-700" />,
                title: "Structured Exchanges",
                description: "Trade textbooks efficiently. Our system ensures you find the exact edition you need without the noise of generic marketplaces."
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
                title: "Verified Integrity",
                description: "Every user operates under their verified academic identity. Transactions are logged and secured to prevent fraud."
              },
              {
                icon: <Star className="w-6 h-6 text-amber-500" />,
                title: "Peer Reviews",
                description: "Access high-quality evaluations of materials from other students. Make informed decisions on your academic investments."
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group flex flex-col items-start p-6 rounded-[4px] bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className="w-12 h-12 rounded-[4px] bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 text-slate-700">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
