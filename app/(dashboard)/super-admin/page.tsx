'use client'

import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, Activity, TrendingUp, MessageSquare, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSuperAdminAnalytics } from "./actions";

export default function SuperAdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const analytics = await getSuperAdminAnalytics();
                setData(analytics);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh] animate-pulse">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-[2rem] bg-indigo-100 flex items-center justify-center">
                        <Activity className="text-indigo-600 animate-spin" size={32} />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest text-indigo-600/40 italic">Syncing Academy Metrics...</p>
                </div>
            </div>
        );
    }

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(val);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground italic underline decoration-indigo-500/30 decoration-8 underline-offset-8">Academy Insights</h1>
                    <p className="text-muted-foreground mt-3 italic text-lg opacity-80">Empowering the CEO with real-time financial and growth analytics.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-5 py-2.5 rounded-full shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Live Intel Active</span>
                    </div>
                    <ThemeToggle />
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Students - Gradient Premium Card */}
                <Card className="rounded-[3rem] overflow-hidden border-none shadow-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-25 transition-all group-hover:scale-110">
                        <Users size={88} />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest opacity-80 italic">Total Community Size</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-6xl font-serif font-bold tracking-tighter italic">{data.totalStudents + data.totalStaff}</div>
                        <div className="mt-4 flex items-center gap-3">
                            <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black">+{Math.round(data.studentGrowth)}%</span>
                            <span className="opacity-70 text-[10px] uppercase font-black tracking-widest italic">Growth Trend</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Staff Metrics Card */}
                <Card className="rounded-[3rem] bg-card border border-border/40 shadow-xl transition-all hover:shadow-2xl group overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Academic Staff</CardTitle>
                        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:rotate-12 transition-transform">
                            <Briefcase size={20} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-serif font-bold italic">{data.totalStaff} Expert Mentors</div>
                        <div className="mt-6 flex items-center gap-2">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600">
                                        M
                                    </div>
                                ))}
                            </div>
                            <span className="text-[10px] font-black text-muted-foreground uppercase ml-2">Active now</span>
                        </div>
                    </CardContent>
                </Card>

                {/* New Joiners Card */}
                <Card className="rounded-[3rem] bg-card border border-border/40 shadow-xl transition-all hover:shadow-2xl group overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">New Registrations</CardTitle>
                        <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 group-hover:scale-110 transition-transform">
                            <TrendingUp size={20} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-serif font-bold italic">+{data.newInquiries}</div>
                        <p className="text-[10px] text-muted-foreground mt-2 font-black uppercase tracking-widest italic">Inquiries this month</p>
                        <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full w-[45%] bg-amber-500 rounded-full" />
                        </div>
                    </CardContent>
                </Card>

                {/* Net Income Card */}
                <Card className="rounded-[3rem] bg-card border border-border/40 shadow-xl transition-all hover:shadow-2xl group overflow-hidden border-b-emerald-500/50 border-b-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Monthly Net Profit</CardTitle>
                        <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform">
                            <DollarSign size={20} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-serif font-bold italic text-emerald-600">{formatCurrency(data.netRevenue)}</div>
                        <p className="text-[10px] text-muted-foreground mt-2 font-black uppercase tracking-widest italic">POST-COST VALUATION</p>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Section: Activity & Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                {/* Revenue Growth Chart */}
                <Card className="lg:col-span-2 rounded-[3.5rem] bg-card border-none shadow-2xl p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32" />

                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h3 className="text-2xl font-serif font-bold italic tracking-tight">Financial Trajectory</h3>
                            <p className="text-sm text-muted-foreground italic mt-1 font-medium">Monthly revenue growth after operational expenses.</p>
                        </div>
                        <div className="bg-muted/50 p-1.5 rounded-2xl flex gap-1">
                            <button className="px-5 py-2 text-[10px] font-black uppercase bg-white rounded-xl shadow-sm italic">6 MONTHS</button>
                            <button className="px-5 py-2 text-[10px] font-black uppercase text-muted-foreground hover:bg-white/50 rounded-xl transition-colors italic">YEARLY</button>
                        </div>
                    </div>

                    <div className="h-[300px] w-full flex items-end gap-3 px-2">
                        {data.revenueTrend.map((h: any, i: number) => (
                            <div key={i} className="flex-1 group/bar relative">
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-indigo-900 text-white text-[10px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all shadow-xl italic z-10">
                                    ${h.value}K
                                </div>
                                <div
                                    className={cn(
                                        "w-full rounded-2xl transition-all duration-1000 group-hover/bar:from-indigo-600 group-hover/bar:to-violet-500 shadow-sm",
                                        i === 6 ? "bg-gradient-to-t from-emerald-400 to-emerald-600" : "bg-gradient-to-t from-indigo-100 to-indigo-300"
                                    )}
                                    style={{ height: `${Math.max(10, Math.min(100, (h.value / (data.netRevenue / 1000)) * 80))}%` }}
                                />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-muted-foreground/60 italic uppercase tracking-widest">{h.name}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Right Area: operational decomposition */}
                <div className="space-y-8">
                    <Card className="rounded-[3rem] bg-card border border-border/40 shadow-xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Activity size={48} />
                        </div>
                        <h3 className="text-lg font-serif font-bold italic mb-8 tracking-tight uppercase">Cost Decomposition</h3>
                        <div className="space-y-8">
                            {[
                                { name: "Staff Payroll", val: "42%", color: "bg-indigo-500" },
                                { name: "Marketing Expansion", val: "28%", color: "bg-amber-500" },
                                { name: "Tech Infra & Maintenance", val: "15%", color: "bg-emerald-500" },
                                { name: "Other Overheads", val: "15%", color: "bg-slate-300" }
                            ].map((item, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest italic">
                                        <span className="text-muted-foreground">{item.name}</span>
                                        <span className="text-foreground">{item.val}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                                        <div className={cn("h-full rounded-full transition-all duration-1000", item.color)} style={{ width: item.val }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="rounded-[3rem] bg-indigo-600 p-8 text-white relative shadow-2xl overflow-hidden group hover:scale-[1.02] transition-transform">
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest opacity-80 italic mb-1">CEO Notice</CardTitle>
                        <h4 className="text-xl font-serif font-bold italic tracking-tight mb-2">Expansion Potential</h4>
                        <p className="text-[11px] text-white/70 italic leading-relaxed mb-6 font-medium">Based on current student growth of {Math.round(data.studentGrowth)}%, the academy is projected to hit $500k ARR within 14 months.</p>
                        <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl w-full hover:bg-white/20 transition-all italic">
                            Generate Q3 Report
                        </button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
