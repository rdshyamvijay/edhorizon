
"use client";

import { useState, useEffect } from "react";
import { updateUserRole } from "@/app/(dashboard)/super-admin/users/actions";
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
import { Loader2 } from "lucide-react";

export default function UserTable({ users }: { users: any[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [optimisticUsers, setOptimisticUsers] = useState(users);

    // Sync optimistic state when users prop changes (e.g., after revalidation)
    useEffect(() => {
        setOptimisticUsers(users);
    }, [users]);

    const handleRoleChange = async (userId: string, newRole: string) => {
        // Optimistic update - update UI immediately
        const previousUsers = [...optimisticUsers];
        setOptimisticUsers(
            optimisticUsers.map(u =>
                u.id === userId ? { ...u, role: newRole } : u
            )
        );

        setLoadingId(userId);
        const result = await updateUserRole(userId, newRole);
        setLoadingId(null);

        if (result.error) {
            // Revert optimistic update on error
            setOptimisticUsers(previousUsers);
            alert("Error: " + result.error);
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {optimisticUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.full_name || "N/A"}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Select
                                    defaultValue={user.role}
                                    onValueChange={(val) => handleRoleChange(user.id, val)}
                                    disabled={loadingId === user.id}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        {loadingId === user.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <SelectValue placeholder="Select role" />
                                        )}
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="teacher">Teacher</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="super_admin">Super Admin</SelectItem>
                                        <SelectItem value="sales">Sales</SelectItem>
                                        <SelectItem value="hr">HR</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
