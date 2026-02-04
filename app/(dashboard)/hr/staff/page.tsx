import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreHorizontal, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function StaffDirectory() {
    const supabase = await createClient();

    // Fetch staff with profile and staff_details info
    const { data: staff, error } = await supabase
        .from('profiles')
        .select(`
            *,
            staff_details (*)
        `)
        .neq('role', 'student')
        .order('full_name', { ascending: true });

    if (error) {
        console.error("Error fetching staff:", error);
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">Staff Directory</h1>
                    <p className="text-muted-foreground mt-1">Full registry of academy educators and administrators.</p>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-[2rem] shadow-sm border border-border/40">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-12 bg-muted/20 border-none rounded-full h-12 outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button variant="outline" className="rounded-full gap-2 text-xs font-bold uppercase tracking-widest h-12 px-6">
                        <Filter h-4 w-4 />
                        Filters
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full h-12 px-8 font-bold text-xs uppercase tracking-widest ml-auto md:ml-0">
                        Add New Staff
                    </Button>
                </div>
            </div>

            {/* Staff Table */}
            <div className="bg-card rounded-[2.5rem] shadow-xl overflow-hidden border border-border/30">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="border-b-border/30">
                            <TableHead className="py-6 pl-8 font-bold uppercase tracking-widest text-[10px] text-muted-foreground italic">Name & Role</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground italic text-center">Contact</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground italic text-center">Status</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground italic text-center">Joined Date</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground italic text-right pr-8">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staff?.map((person) => (
                            <TableRow key={person.id} className="hover:bg-muted/20 transition-colors border-b-border/20">
                                <TableCell className="py-5 pl-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 flex items-center justify-center text-indigo-600 font-bold">
                                            {person.full_name?.charAt(0) || person.email.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">{person.full_name || 'No Name Set'}</p>
                                            <p className="text-[10px] text-indigo-600 font-black uppercase tracking-tighter">{person.role}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                            <Mail size={12} className="text-indigo-500" />
                                            {person.email}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge
                                        variant="secondary"
                                        className={`rounded-full border-none font-bold text-[10px] uppercase tracking-wider px-3 py-1 ${person.staff_details?.status === 'active'
                                            ? 'bg-emerald-500/10 text-emerald-600'
                                            : 'bg-amber-500/10 text-amber-600'
                                            }`}
                                    >
                                        {person.staff_details?.status || 'Active'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500">
                                        <Calendar size={12} />
                                        {person.staff_details?.joining_date ? new Date(person.staff_details.joining_date).toLocaleDateString() : 'N/A'}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {(!staff || staff.length === 0) && (
                    <div className="py-20 flex flex-col items-center justify-center text-muted-foreground italic">
                        <Users size={48} className="opacity-20 mb-4" />
                        <p>No staff records found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
