'use client'

import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, Activity, TrendingUp, MessageSquare } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function SuperAdminDashboard() {
    return (
        <div className="space-y-10">
            {/* Header section with Theme Toggle */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">Analytics</h1>
                    <p className="text-muted-foreground mt-1">Global performance overview and academy metrics.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 bg-card border px-4 py-2 rounded-full shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live Database Sync</span>
                    </div>
                    <ThemeToggle />
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Users Card - Gradient Style */}
                <Card className="rounded-[2.5rem] overflow-hidden border-none shadow-[0_20px_50px_rgba(79,70,229,0.15)] bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 text-white relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users size={80} />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold uppercase tracking-widest opacity-80">Total Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-bold tracking-tighter">23.400K</div>
                        <div className="mt-4 flex items-center gap-2 text-xs">
                            <span className="bg-white/20 px-2 py-1 rounded-full">+12.5%</span>
                            <span className="opacity-70 italic relative bottom-0.5">vs last month</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Courses Card */}
                <Card className="rounded-[2.5rem] bg-card/60 backdrop-blur-xl border border-border/50 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Active Modules</CardTitle>
                        <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
                            <BookOpen size={20} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-foreground">1,204</div>
                        <div className="mt-6 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full w-[70%] bg-gradient-to-r from-indigo-400 to-violet-500 rounded-full" />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2 font-medium">70% MODULE UTILIZATION</p>
                    </CardContent>
                </Card>

                {/* Performance Card */}
                <Card className="rounded-[2.5rem] bg-card/60 backdrop-blur-xl border border-border/50 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">System Health</CardTitle>
                        <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                            <Activity size={20} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-foreground">99.9%</div>
                        <div className="mt-4 flex items-center gap-2 text-xs text-emerald-500 font-bold bg-emerald-500/5 px-2 py-1 rounded-full w-fit">
                            <TrendingUp size={14} />
                            <span>UPTIME SECURED</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Inquiries Card */}
                <Card className="rounded-[2.5rem] bg-card/60 backdrop-blur-xl border border-border/50 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">New Inquiries</CardTitle>
                        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                            <MessageSquare size={20} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-foreground">42</div>
                        <div className="flex -space-x-3 mt-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                                    <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-400" />
                                </div>
                            ))}
                            <div className="h-8 w-8 rounded-full border-2 border-background bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">
                                +38
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Section: Activity & Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                {/* Simulated Chart Area */}
                <Card className="lg:col-span-2 rounded-[3rem] bg-card border-none shadow-2xl p-8 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-foreground">Revenue Growth</h3>
                            <p className="text-sm text-muted-foreground italic">Academy financial trajectory</p>
                        </div>
                        <select className="bg-muted/50 border-none text-xs font-bold rounded-full px-4 py-2 outline-none">
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    {/* Visual Placeholder for a Chart */}
                    <div className="h-[250px] w-full flex items-end gap-2 px-4 pb-4">
                        {[40, 65, 45, 90, 75, 100, 80].map((h, i) => (
                            <div key={i} className="flex-1 group relative">
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    ${h}k
                                </div>
                                <div
                                    className="w-full bg-gradient-to-t from-indigo-500/20 to-indigo-500 rounded-t-2xl transition-all duration-1000 group-hover:from-indigo-600 group-hover:to-violet-500"
                                    style={{ height: `${h}%` }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest pt-4">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
                    </div>
                </Card>

                {/* Right Area: Top Courses / Recent Activity */}
                <div className="space-y-8">
                    <Card className="rounded-[2.5rem] bg-card border-none shadow-xl p-8 transform rotate-1">
                        <h3 className="text-lg font-bold mb-6">Course Engagement</h3>
                        <div className="space-y-6">
                            {[
                                { name: "Classical History", color: "bg-indigo-500", progress: 85 },
                                { name: "Latin Grammar", color: "bg-rose-500", progress: 62 },
                                { name: "Philosophy 101", color: "bg-amber-500", progress: 40 }
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span>{item.name}</span>
                                        <span>{item.progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full">
                                        <div className={cn("h-full rounded-full transition-all duration-1000", item.color)} style={{ width: `${item.progress}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Premium Call-to-action */}
                    <Card className="rounded-[2.5rem] bg-gradient-to-br from-indigo-900 to-black p-8 text-white relative h-40 flex flex-col justify-end shadow-2xl overflow-hidden -rotate-1 transition-transform hover:rotate-0">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
                        <h4 className="text-lg font-bold">New Module?</h4>
                        <p className="text-xs text-white/60 mb-4">Expand the horizon of knowledge.</p>
                        <button className="bg-white text-indigo-900 text-xs font-black uppercase tracking-widest px-6 py-2 rounded-full w-fit hover:bg-indigo-50 transition-colors">
                            Launch Builder
                        </button>
                    </Card>
                </div>
            </div>
        </div>
    )
}
