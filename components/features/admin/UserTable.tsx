
"use client";

import { useState, useEffect } from "react";
import { updateUserRoles } from "@/app/(dashboard)/super-admin/users/actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Save, X, RotateCcw, CheckCircle2, AlertCircle } from "lucide-react";

export default function UserTable({ users }: { users: any[] }) {
    const [isSaving, setIsSaving] = useState(false);
    const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Auto-hide notification after 5 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleRoleChange = (userId: string, newRole: string) => {
        const originalUser = users.find(u => u.id === userId);
        if (originalUser?.role === newRole) {
            const newPending = { ...pendingChanges };
            delete newPending[userId];
            setPendingChanges(newPending);
        } else {
            setPendingChanges(prev => ({
                ...prev,
                [userId]: newRole
            }));
        }
    };

    const handleSave = async () => {
        if (Object.keys(pendingChanges).length === 0) return;

        const changes = Object.entries(pendingChanges).map(([userId, newRole]) => ({
            userId,
            newRole
        }));

        setIsSaving(true);
        const result = await updateUserRoles(changes);
        setIsSaving(false);

        if (result.success) {
            setNotification({ type: 'success', message: "User roles updated successfully" });
            setPendingChanges({});
        } else {
            setNotification({ type: 'error', message: result.error || "Failed to update user roles" });
            if (result.details) {
                console.error("Update details:", result.details);
            }
        }
    };

    const handleCancel = () => {
        setPendingChanges({});
    };

    const hasChanges = Object.keys(pendingChanges).length > 0;

    return (
        <div className="space-y-4">
            {/* Notifications */}
            {notification && (
                <div className={`flex items-center justify-between p-4 rounded-xl border animate-in fade-in slide-in-from-top-4 duration-300 ${notification.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200'
                        : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 text-red-800 dark:text-red-200'
                    }`}>
                    <div className="flex items-center gap-3">
                        {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <p className="text-sm font-medium">{notification.message}</p>
                    </div>
                    <button onClick={() => setNotification(null)} className="opacity-50 hover:opacity-100">
                        <X size={16} />
                    </button>
                </div>
            )}

            {hasChanges && (
                <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 p-4 rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                            {Object.keys(pendingChanges).length}
                        </div>
                        <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                            Unsaved role changes
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-full"
                        >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reset
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6"
                        >
                            {isSaving ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            Save All Changes
                        </Button>
                    </div>
                </div>
            )}

            <div className="rounded-[1.5rem] border border-border/40 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="border-b-border/30">
                            <TableHead className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground italic pl-6 py-4">Full Name</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground italic">Email</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground italic">Role</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground italic pr-6">Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => {
                            const isPending = pendingChanges[user.id] !== undefined;
                            const currentRole = pendingChanges[user.id] || user.role;

                            return (
                                <TableRow
                                    key={user.id}
                                    className={`transition-colors h-16 ${isPending ? 'bg-indigo-50/50 dark:bg-indigo-950/10' : ''}`}
                                >
                                    <TableCell className="font-medium pl-6">
                                        <div className="flex items-center gap-3">
                                            {isPending && (
                                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
                                            )}
                                            {user.full_name || "N/A"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={currentRole}
                                            onValueChange={(val) => handleRoleChange(user.id, val)}
                                            disabled={isSaving}
                                        >
                                            <SelectTrigger className={`w-[140px] h-9 rounded-lg border-muted-foreground/20 ${isPending ? 'ring-1 ring-indigo-500 border-indigo-500' : ''}`}>
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-border/50">
                                                <SelectItem value="student">Student</SelectItem>
                                                <SelectItem value="teacher">Teacher</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="super_admin">Super Admin</SelectItem>
                                                <SelectItem value="sales">Sales</SelectItem>
                                                <SelectItem value="hr">HR</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground pr-6">
                                        {new Date(user.created_at).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
