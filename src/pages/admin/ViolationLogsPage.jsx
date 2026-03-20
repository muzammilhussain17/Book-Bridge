import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, AlertOctagon, Terminal, FileText } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { adminApi } from '../../services/api';

export const ViolationLogsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setIsLoading(true);
                const res = await adminApi.getViolations({ size: 100 });
                setLogs(res.data.content || []);
                setError('');
            } catch (err) {
                console.error("Failed to fetch logs:", err);
                setError("Failed to load security incident logs.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => {
        const idStr = log.id ? log.id.toString() : '';
        const userStr = log.targetIdentifier || '';
        const typeStr = log.violationType || '';

        return idStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
            userStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
            typeStr.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Helper to get severity based on type (example logic)
    const getSeverity = (type) => {
        if (!type) return 'Medium';
        const t = type.toLowerCase();
        if (t.includes('spam') || t.includes('fraud') || t.includes('scam')) return 'Critical';
        if (t.includes('prohibited') || t.includes('abusive')) return 'High';
        return 'Medium';
    };

    if (isLoading && logs.length === 0) {
        return <div className="p-8 text-center text-slate-500">Loading incident logs...</div>;
    }

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div className="border-b border-slate-200 pb-5">
                <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase flex items-center gap-3">
                    <AlertOctagon className="w-6 h-6 text-amber-600" />
                    Security Incident Logs
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-2">Immutable audit trail of all security violations and administrative actions.</p>
            </div>

            {error && (
                <div className="bg-rose-50 text-rose-600 border border-rose-200 p-4 rounded-[4px] text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="flex items-center gap-4 mb-2">
                <Input
                    placeholder="Query logs by incident ID, target, or type..."
                    className="w-[400px] bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 font-mono text-sm"
                    leftIcon={<Terminal className="w-4 h-4 text-slate-400" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="flex gap-2">
                    <Button variant="secondary" size="md" className="font-semibold text-xs text-slate-700">
                        Export CSV
                    </Button>
                </div>
            </div>

            <Card className="shadow-sm border-slate-200">
                <CardContent className="p-0">
                    <Table className="border-0 shadow-none">
                        <TableHeader className="bg-slate-50 border-b border-slate-200">
                            <TableRow className="border-0">
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12 w-32">Timestamp</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12 w-24">Incident ID</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12">Target / Actor</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12 w-48">Violation Type</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12 w-48">Resolution / Status</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12 text-right w-24">Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLogs.map((log) => {
                                const severity = getSeverity(log.violationType);
                                return (
                                    <TableRow key={log.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <TableCell>
                                            <span className="font-mono text-xs text-slate-500 tracking-widest">
                                                {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-mono text-xs text-amber-600 font-bold tracking-widest">VLOG-{log.id}</span>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-bold text-slate-900 text-sm">{log.targetIdentifier}</p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className={`w-1.5 h-1.5 rounded-full ${severity === 'Critical' ? 'bg-rose-500' :
                                                    severity === 'High' ? 'bg-amber-500' :
                                                        'bg-blue-500'
                                                    }`}></span>
                                                <span className="text-xs font-semibold text-slate-700">{log.violationType || 'Unknown'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-block border border-slate-200 text-slate-600 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-[2px] bg-slate-100">
                                                {log.status || 'RECORDED'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="secondary" size="icon" className="w-8 h-8 rounded-[4px] text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border-slate-200" title={log.description || "View Full Trace"}>
                                                <FileText className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {filteredLogs.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
                    <ShieldAlert className="w-12 h-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-500">No Logs Found</h3>
                    <p className="text-sm text-slate-400 mt-2">No security incidents match your search query.</p>
                </div>
            )}
        </div>
    );
};
