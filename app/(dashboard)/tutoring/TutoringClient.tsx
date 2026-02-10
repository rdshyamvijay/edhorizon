
"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, UserMinus, UserPlus, ChevronRight, GraduationCap, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateStudentAssignment } from "./actions";
import { useSearchParams } from "next/navigation";

interface Profile {
    id: string;
    full_name: string | null;
    email: string;
    role: string;
}

interface Student extends Profile {
    student_details?: {
        assigned_teacher_id: string | null;
        status: string;
        grade_level: string | null;
    } | null;
}

interface Teacher extends Profile {
    student_count?: number;
}

export default function TutoringClient({
    initialTeachers,
    initialStudents
}: {
    initialTeachers: Teacher[],
    initialStudents: Student[]
}) {
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(searchParams.get("teacherId"));
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const filteredStudents = initialStudents.filter(student => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = (
            (student.full_name?.toLowerCase().includes(searchLower)) ||
            (student.email?.toLowerCase().includes(searchLower))
        );

        if (selectedTeacherId === "unassigned") {
            return matchesSearch && !student.student_details?.assigned_teacher_id;
        }

        if (selectedTeacherId) {
            return matchesSearch && student.student_details?.assigned_teacher_id === selectedTeacherId;
        }

        return matchesSearch;
    });

    const unassignedCount = initialStudents.filter(s => !s.student_details?.assigned_teacher_id).length;

    const handleReassign = async (studentId: string, teacherId: string | null) => {
        setIsUpdating(studentId);
        const result = await updateStudentAssignment(studentId, teacherId);
        setIsUpdating(null);
        if (result.error) {
            alert(result.error);
        }
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">Tutoring Management</h1>
                    <p className="text-muted-foreground mt-1">Manage 1:1 teacher-student pairings and assignments.</p>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Sidebar: Teachers List */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-card rounded-[2rem] border border-border/40 p-6 shadow-sm overflow-hidden">
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                            <Users size={14} className="text-indigo-500" />
                            Select Teacher
                        </h3>

                        <div className="space-y-2">
                            <button
                                onClick={() => setSelectedTeacherId(null)}
                                className={cn(
                                    "w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-sm",
                                    selectedTeacherId === null
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                                        : "hover:bg-muted/50 text-foreground"
                                )}
                            >
                                <span>All Students</span>
                                <Badge className={selectedTeacherId === null ? "bg-white/20 text-white border-none" : "bg-muted text-muted-foreground border-none"}>
                                    {initialStudents.length}
                                </Badge>
                            </button>

                            <button
                                onClick={() => setSelectedTeacherId("unassigned")}
                                className={cn(
                                    "w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-sm",
                                    selectedTeacherId === "unassigned"
                                        ? "bg-amber-500 text-white shadow-lg shadow-amber-200"
                                        : "hover:bg-muted/50 text-foreground"
                                )}
                            >
                                <span className="flex items-center gap-2">
                                    Unassigned
                                    {unassignedCount > 0 && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
                                </span>
                                <Badge className={selectedTeacherId === "unassigned" ? "bg-white/20 text-white border-none" : "bg-muted text-muted-foreground border-none"}>
                                    {unassignedCount}
                                </Badge>
                            </button>

                            <div className="my-4 border-t border-border/20" />

                            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                                {initialTeachers.map(teacher => (
                                    <button
                                        key={teacher.id}
                                        onClick={() => setSelectedTeacherId(teacher.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left group",
                                            selectedTeacherId === teacher.id
                                                ? "bg-indigo-50 border-indigo-200 text-indigo-900 border"
                                                : "hover:bg-muted/30 text-muted-foreground border border-transparent"
                                        )}
                                    >
                                        <div className={cn(
                                            "h-10 w-10 shrink-0 rounded-full flex items-center justify-center font-bold text-xs transition-colors",
                                            selectedTeacherId === teacher.id ? "bg-indigo-600 text-white" : "bg-muted text-muted-foreground group-hover:bg-indigo-100"
                                        )}>
                                            {teacher.full_name?.charAt(0) || teacher.email.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn("text-xs font-bold truncate", selectedTeacherId === teacher.id ? "text-indigo-900" : "text-foreground")}>
                                                {teacher.full_name || teacher.email.split('@')[0]}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Teacher</p>
                                        </div>
                                        <ChevronRight size={14} className={cn("transition-transform", selectedTeacherId === teacher.id ? "rotate-90 text-indigo-600" : "opacity-0 group-hover:opacity-100")} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main View: Students Assignment */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-[2rem] shadow-sm border border-border/40">
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Filter students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 bg-muted/20 border-none rounded-full h-12 outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredStudents.map(student => {
                            const assignedTeacher = initialTeachers.find(t => t.id === student.student_details?.assigned_teacher_id);

                            return (
                                <div key={student.id} className="bg-card p-6 rounded-[2rem] border border-border/40 shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                                {student.full_name?.charAt(0) || student.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-foreground leading-tight">{student.full_name || 'No Name'}</h4>
                                                <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                                                    <GraduationCap size={10} />
                                                    {student.student_details?.grade_level || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="rounded-full text-[10px] px-2 border-none bg-emerald-500/10 text-emerald-600 font-black">
                                            {student.student_details?.status || 'Active'}
                                        </Badge>
                                    </div>

                                    <div className="bg-muted/20 rounded-2xl p-4 mb-4">
                                        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground mb-2">Assigned Tutor</p>
                                        {assignedTeacher ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">
                                                    {assignedTeacher.full_name?.charAt(0) || assignedTeacher.email.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-bold text-foreground">{assignedTeacher.full_name}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={isUpdating === student.id}
                                                    onClick={() => handleReassign(student.id, null)}
                                                    className="ml-auto h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-full"
                                                >
                                                    <UserMinus size={14} />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between italic text-muted-foreground text-xs py-1">
                                                <span>No personal tutor assigned</span>
                                                <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-2">
                                        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground mb-3">Assign New Tutor</p>
                                        <div className="flex flex-wrap gap-2">
                                            {initialTeachers
                                                .filter(t => t.id !== student.student_details?.assigned_teacher_id)
                                                .slice(0, 3) // Show top 3 or recommendations
                                                .map(teacher => (
                                                    <Button
                                                        key={teacher.id}
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={isUpdating === student.id}
                                                        onClick={() => handleReassign(student.id, teacher.id)}
                                                        className="h-8 rounded-full border-dashed border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50 text-[10px] font-bold group/btn"
                                                    >
                                                        <UserPlus size={12} className="mr-1 group-hover/btn:text-indigo-600" />
                                                        {teacher.full_name?.split(' ')[0]}
                                                    </Button>
                                                ))
                                            }
                                            <Button variant="ghost" size="sm" className="h-8 rounded-full text-[10px] font-bold text-muted-foreground underline">
                                                More...
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredStudents.length === 0 && (
                            <div className="col-span-full py-20 bg-card rounded-[2.5rem] border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground italic">
                                <Users size={40} className="opacity-20 mb-4" />
                                <p>No students match the current criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
