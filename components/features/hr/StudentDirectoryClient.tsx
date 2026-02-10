
"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreHorizontal, Mail, Calendar, Users, GraduationCap, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Student {
    id: string;
    full_name: string | null;
    email: string;
    student_details?: {
        status: string;
        enrollment_date: string;
        grade_level: string | null;
        assigned_teacher?: { full_name: string | null } | null;
    } | null;
}

import { createStudentMember } from "@/app/(dashboard)/hr/staff/actions";
import { cn } from "@/lib/utils";

export default function StudentDirectoryClient({ initialStudents }: { initialStudents: Student[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        grade_level: "9th Grade"
    });

    const filteredStudents = initialStudents.filter(student => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = (
            (student.full_name?.toLowerCase().includes(searchLower)) ||
            (student.email?.toLowerCase().includes(searchLower))
        );
        const matchesStatus = selectedStatus === "all" || student.student_details?.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const handleEnrollStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const result = await createStudentMember(formData);
        setIsSubmitting(false);
        if (result.success) {
            setIsAddModalOpen(false);
            setFormData({ full_name: "", email: "", grade_level: "9th Grade" });
        } else {
            alert(result.error);
        }
    };

    return (
        <div className="space-y-10">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-[2rem] shadow-sm border border-border/40">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 bg-muted/20 border-none rounded-full h-12 outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto relative">
                    <div className="relative">
                        <Button
                            variant="outline"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={cn(
                                "rounded-full gap-2 text-xs font-bold uppercase tracking-widest h-12 px-6 transition-all",
                                selectedStatus !== "all" && "border-indigo-500 text-indigo-600 bg-indigo-50"
                            )}
                        >
                            <Filter className="h-4 w-4" />
                            {selectedStatus === "all" ? "Filters" : selectedStatus}
                        </Button>

                        {isFilterOpen && (
                            <div className="absolute top-14 right-0 z-50 w-48 bg-card border border-border/40 rounded-2xl shadow-xl p-2 animate-in fade-in zoom-in duration-200">
                                <button
                                    onClick={() => { setSelectedStatus("all"); setIsFilterOpen(false); }}
                                    className={cn("w-full text-left px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tighter hover:bg-muted/30", selectedStatus === "all" && "text-indigo-600 bg-indigo-50")}
                                >
                                    All Statuses
                                </button>
                                <button
                                    onClick={() => { setSelectedStatus("active"); setIsFilterOpen(false); }}
                                    className={cn("w-full text-left px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tighter hover:bg-muted/30", selectedStatus === "active" && "text-indigo-600 bg-indigo-50")}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => { setSelectedStatus("inactive"); setIsFilterOpen(false); }}
                                    className={cn("w-full text-left px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tighter hover:bg-muted/30", selectedStatus === "inactive" && "text-indigo-600 bg-indigo-50")}
                                >
                                    Inactive
                                </button>
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full h-12 px-8 font-bold text-xs uppercase tracking-widest ml-auto md:ml-0"
                    >
                        Enroll New Student
                    </Button>
                </div>
            </div>

            {/* Enroll Student Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-card rounded-[2rem] shadow-2xl overflow-hidden border border-border/40 animate-in zoom-in-95 duration-200">
                        <div className="bg-muted/30 p-6 flex items-center justify-between border-b border-border/20">
                            <h2 className="text-xl font-serif font-bold tracking-tight">Enroll Student</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <form onSubmit={handleEnrollStudent} className="p-8 space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                <Input
                                    required
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    className="h-12 rounded-2xl bg-muted/20 border-none outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                                    placeholder="Jane Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                <Input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="h-12 rounded-2xl bg-muted/20 border-none outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                                    placeholder="jane@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Grade Level</label>
                                <Input
                                    required
                                    value={formData.grade_level}
                                    onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
                                    className="h-12 rounded-2xl bg-muted/20 border-none outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                                    placeholder="e.g. 10th Grade"
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 rounded-2xl h-12 uppercase text-[10px] font-bold tracking-widest"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 uppercase text-[10px] font-bold tracking-widest"
                                >
                                    {isSubmitting ? "Enrolling..." : "Enroll Student"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Student Table */}
            <div className="bg-card rounded-[2.5rem] shadow-xl overflow-hidden border border-border/30">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="border-b-border/30">
                            <TableHead className="py-6 pl-8 font-bold uppercase tracking-widest text-[10px] text-muted-foreground italic">Student Name</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground italic text-center">Grade Level</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground italic text-center">Contact</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground italic text-center">Status</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground italic text-center">Assigned Tutor</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground italic text-center">Enrollment Date</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground italic text-right pr-8">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStudents.map((student) => (
                            <TableRow key={student.id} className="hover:bg-muted/20 transition-colors border-b-border/20">
                                <TableCell className="py-5 pl-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 flex items-center justify-center text-indigo-600 font-bold">
                                            {student.full_name?.charAt(0) || student.email.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">{student.full_name || 'No Name Set'}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full w-fit mx-auto uppercase tracking-tighter">
                                        <GraduationCap size={12} />
                                        {student.student_details?.grade_level || 'Not Set'}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                            <Mail size={12} className="text-indigo-500" />
                                            {student.email}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge
                                        variant="secondary"
                                        className={`rounded-full border-none font-bold text-[10px] uppercase tracking-wider px-3 py-1 ${student.student_details?.status === 'active'
                                            ? 'bg-emerald-500/10 text-emerald-600'
                                            : 'bg-amber-500/10 text-amber-600'
                                            }`}
                                    >
                                        {student.student_details?.status || 'Active'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500">
                                        <Users size={12} className="text-indigo-500" />
                                        {student.student_details?.assigned_teacher?.full_name || 'Unassigned'}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500">
                                        <Calendar size={12} />
                                        {student.student_details?.enrollment_date ? new Date(student.student_details.enrollment_date).toLocaleDateString() : 'N/A'}
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
                {filteredStudents.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-muted-foreground italic">
                        <Users size={48} className="opacity-20 mb-4" />
                        <p>No student records found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
