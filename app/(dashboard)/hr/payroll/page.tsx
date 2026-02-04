import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Plus, Clock, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function PayrollManagement() {
    const supabase = await createClient();

    // Fetch payroll runs
    const { data: runs, error } = await supabase
        .from('payroll_runs')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground text-emerald-600 dark:text-emerald-500">Payroll Pulse</h1>
                    <p className="text-muted-foreground mt-1">Academy financial operations and payout management.</p>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                </div>
            </div>

            {/* Top Bar Actions */}
            <div className="flex flex-col md:flex-row gap-6 items-stretch">
                <Card className="flex-1 rounded-[2.5rem] bg-emerald-500 text-white shadow-2xl border-none p-8 overflow-hidden relative group">
                    <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CreditCard size={120} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Next Scheduled Payout</p>
                            <h2 className="text-4xl font-bold tracking-tighter">March 1, 2026</h2>
                        </div>
                        <Button className="mt-8 bg-white text-emerald-600 hover:bg-emerald-50 rounded-2xl h-14 font-black uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-lg">
                            <Plus className="mr-2 h-5 w-5" /> Generate Run
                        </Button>
                    </div>
                </Card>

                <div className="md:w-1/3 grid grid-cols-1 gap-6">
                    <Card className="rounded-[2.5rem] bg-card border border-border/40 shadow-xl p-8 flex flex-col justify-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Payout (YTD)</p>
                        <p className="text-3xl font-bold text-foreground tracking-tighter">$142,500.00</p>
                    </Card>
                    <Card className="rounded-[2.5rem] bg-card border border-border/40 shadow-xl p-8 flex flex-col justify-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Active Staff</p>
                        <p className="text-3xl font-bold text-foreground tracking-tighter">18 Members</p>
                    </Card>
                </div>
            </div>

            {/* Runs History */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold font-serif px-2">Payroll History</h3>
                    <Badge variant="outline" className="rounded-full border-muted-foreground/30 text-muted-foreground px-4 py-1">LAST 12 MONTHS</Badge>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {runs?.map((run) => (
                        <Card key={run.id} className="rounded-[2rem] bg-card border border-border/30 hover:shadow-lg transition-all p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${run.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                                        }`}>
                                        {run.status === 'completed' ? <CheckCircle2 size={28} /> : <Clock size={28} />}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-foreground">{run.month}</h4>
                                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                                            <Calendar size={12} /> FY {run.year}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-12">
                                    <div className="text-center md:text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                                        <Badge className={`rounded-full px-4 py-1.5 font-bold uppercase text-[9px] ${run.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                                            }`}>
                                            {run.status}
                                        </Badge>
                                    </div>
                                    <div className="text-center md:text-right min-w-[120px]">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Actions</p>
                                        <Button variant="ghost" className="text-indigo-600 font-bold text-xs uppercase tracking-widest hover:bg-indigo-50 rounded-xl">View Details</Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {(!runs || runs.length === 0) && (
                        <div className="py-20 flex flex-col items-center justify-center bg-card rounded-[3rem] border border-dashed border-border/50 text-muted-foreground italic">
                            <AlertCircle size={48} className="opacity-20 mb-4" />
                            <p>No payroll history found yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
