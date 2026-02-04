
import { getTeacherCapsules } from "./actions";
import StatsCard from "@/components/features/teacher/StatsCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TeacherDashboard() {
    const capsules = await getTeacherCapsules();

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">Teacher Studio</h1>
                    <p className="text-muted-foreground">Manage your classroom and content.</p>
                </div>
                <Link href="/teacher/create">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Capsule
                    </Button>
                </Link>
            </div>

            <StatsCard />

            <Card>
                <CardHeader>
                    <CardTitle>Recent Drafts & Capsules</CardTitle>
                    <CardDescription>Your latest content contributions.</CardDescription>
                </CardHeader>
                <CardContent>
                    {capsules.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No capsules found. Create your first one above!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {capsules.map((capsule: any) => (
                                <div key={capsule.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                    <div>
                                        <h3 className="font-semibold">{capsule.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {capsule.topics?.courses?.title} • {capsule.topics?.title}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${capsule.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {capsule.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
