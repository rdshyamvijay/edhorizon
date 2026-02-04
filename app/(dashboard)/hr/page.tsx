import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, UserPlus, TrendingUp, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Badge } from "@/components/ui/badge";

export default async function HRDashboard() {
    const supabase = await createClient();

    // Fetch some basic stats
    const { count: totalStaff } = await supabase
        .from('staff_details')
        .select('*', { count: 'exact', head: true });

    const { data: recentStaff } = await supabase
        .from('profiles')
        .select('*, staff_details(*)')
        .neq('role', 'student')
        .order('created_at', { ascending: false })
        .limit(4);

    return (
        <div className="space-y-10">
            {/* Header section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">HR Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage staff, payroll, and academy personnel.</p>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Staff Card */}
                <Card className="rounded-[2.5rem] bg-card border border-border/50 shadow-xl overflow-hidden relative group">
                    <div className="absolute -right-4 -top-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Users size={120} />
                    </div>
                    <CardHeader className="pb-2">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl w-fit text-indigo-500 mb-2">
                            <Users size={24} />
                        </div>
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Active Staff</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-bold tracking-tighter text-foreground">{totalStaff || 0}</div>
                        <p className="text-xs text-muted-foreground mt-2 italic">Teachers, Sales, and Admins</p>
                    </CardContent>
                </Card>

                {/* Payroll Pulse Card */}
                <Card className="rounded-[2.5rem] bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl overflow-hidden relative group">
                    <CardHeader className="pb-2">
                        <div className="p-3 bg-white/20 rounded-2xl w-fit mb-2">
                            <CreditCard size={24} />
                        </div>
                        <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-80">Payroll Pulse</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold tracking-tighter">Feb 2026</div>
                        <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full w-fit">
                            <Clock size={14} />
                            <span>PROCESSING DRAFT</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Hiring Card */}
                <Card className="rounded-[2.5rem] bg-card border border-border/50 shadow-xl overflow-hidden relative group">
                    <CardHeader className="pb-2">
                        <div className="p-3 bg-amber-500/10 rounded-2xl w-fit text-amber-500 mb-2">
                            <UserPlus size={24} />
                        </div>
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Onboarding</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-bold tracking-tighter text-foreground">0</div>
                        <p className="text-xs text-muted-foreground mt-2 italic">New staff join requests</p>
                    </CardContent>
                </Card>
            </div>

            {/* Staff Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                <Card className="lg:col-span-2 rounded-[3rem] bg-card border-none shadow-2xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-foreground font-serif">Staff Directory</h3>
                            <p className="text-sm text-muted-foreground italic">Recently active profiles</p>
                        </div>
                        <button className="text-indigo-600 font-bold text-xs uppercase tracking-widest hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        {recentStaff?.map((staff: any) => (
                            <div key={staff.id} className="flex items-center justify-between p-4 rounded-[1.5rem] bg-muted/30 hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg">
                                        {staff.full_name?.charAt(0) || staff.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground">{staff.full_name || staff.email.split('@')[0]}</p>
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{staff.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-none font-bold">
                                        {staff.staff_details?.status || 'Active'}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                        {(!recentStaff || recentStaff.length === 0) && (
                            <p className="text-center py-8 text-muted-foreground italic">No staff profiles found.</p>
                        )}
                    </div>
                </Card>

                <div className="space-y-8">
                    {/* Retention Card */}
                    <Card className="rounded-[2.5rem] bg-indigo-900 p-8 text-white relative shadow-2xl overflow-hidden transform rotate-1 transition-transform hover:rotate-0">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <TrendingUp size={60} />
                        </div>
                        <h4 className="text-lg font-bold">Staff Stats</h4>
                        <div className="mt-6 space-y-4">
                            <div className="flex justify-between items-end">
                                <p className="text-xs opacity-60">Retention Rate</p>
                                <p className="text-2xl font-bold">98%</p>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '98%' }} />
                            </div>
                        </div>
                    </Card>

                    {/* Quick Action */}
                    <div className="p-8 rounded-[2.5rem] bg-card border border-border/50 shadow-xl flex flex-col gap-4 -rotate-1 transition-transform hover:rotate-0">
                        <h4 className="font-bold text-foreground">Quick Actions</h4>
                        <button className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-colors">
                            Add New Staff
                        </button>
                        <button className="w-full py-3 bg-muted text-foreground rounded-2xl font-bold text-sm hover:bg-muted/80 transition-colors">
                            Generate Payouts
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
