
import { getUsers } from "./actions";
import UserTable from "@/components/features/admin/UserTable";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function AdminUsersPage() {
    const users = await getUsers();

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-serif font-bold text-primary">User Management</h1>
                <p className="text-muted-foreground">Manage platform access and roles.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>View and manage all registered users.</CardDescription>
                </CardHeader>
                <CardContent>
                    <UserTable users={users} />
                </CardContent>
            </Card>
        </div>
    );
}
