import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Activity, Server, Database, Network } from 'lucide-react';
import { motion } from 'framer-motion';

export const SystemStatsPage = () => {
    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div className="border-b border-slate-200 pb-5">
                <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase flex items-center gap-3">
                    <Activity className="w-6 h-6 text-emerald-600" />
                    Infrastructure Telemetry
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-2">Real-time performance metrics and historical system load.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="shadow-sm border-slate-200 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Server className="w-16 h-16 text-emerald-600" />
                    </div>
                    <CardContent className="p-6 relative z-10">
                        <p className="text-xs font-bold text-emerald-600 font-mono uppercase tracking-widest mb-2">API Uptime (30d)</p>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tight">99.99%</h3>
                        <p className="text-[10px] font-semibold text-slate-500 mt-2 uppercase">Region: US-EAST-1</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Database className="w-16 h-16 text-indigo-600" />
                    </div>
                    <CardContent className="p-6 relative z-10">
                        <p className="text-xs font-bold text-indigo-600 font-mono uppercase tracking-widest mb-2">DB Query Latency</p>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tight">12<span className="text-xl text-indigo-500 ml-1">ms</span></h3>
                        <p className="text-[10px] font-semibold text-slate-500 mt-2 uppercase">Avg over last 1h</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500"></div>
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Network className="w-16 h-16 text-cyan-600" />
                    </div>
                    <CardContent className="p-6 relative z-10">
                        <p className="text-xs font-bold text-cyan-600 font-mono uppercase tracking-widest mb-2">Active WebSockets</p>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tight">1,248</h3>
                        <p className="text-[10px] font-semibold text-slate-500 mt-2 uppercase">Live Connections</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-fuchsia-500"></div>
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Activity className="w-16 h-16 text-fuchsia-600" />
                    </div>
                    <CardContent className="p-6 relative z-10">
                        <p className="text-xs font-bold text-fuchsia-600 font-mono uppercase tracking-widest mb-2">Error Rate</p>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tight">0.01%</h3>
                        <p className="text-[10px] font-semibold text-slate-500 mt-2 uppercase">5xx responses</p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-4">
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">CPU Utilization Trace (Real-time Mock)</h4>
                        <div className="w-full flex items-end justify-between h-40 gap-1 opacity-100">
                            {Array.from({ length: 40 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-full bg-emerald-100 border border-emerald-300 rounded-t-[2px]"
                                    initial={{ height: `${((i * 17) % 30) + 10}%` }}
                                    animate={{ height: `${((i * 23) % 60) + 20}%` }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        delay: i * 0.1
                                    }}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
