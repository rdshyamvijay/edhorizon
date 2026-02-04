
"use client";

import { createCapsule } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CreateCapsulePage() {
    const [loading, setLoading] = useState(false);

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-6">
            <Link href="/teacher" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Studio
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Create New Video Capsule</CardTitle>
                    <CardDescription>Share your knowledge with a new video lesson.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={async (formData) => {
                        setLoading(true);
                        await createCapsule(formData);
                        // Action handles redirect
                    }} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" placeholder="Introduction to Calculus" required />
                        </div>

                        <div className="grid gap-2">
                            <Label>Context (Locked for V1)</Label>
                            <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
                                MathHorizon &gt; Grade 1 &gt; Counting to 10
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="videoUrl">Video URL (YouTube/Vimeo)</Label>
                            <Input id="videoUrl" name="videoUrl" placeholder="https://youtube.com/..." required />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" name="description" placeholder="Brief summary of this lesson..." />
                        </div>

                        <div className="pt-4">
                            <Button className="w-full" disabled={loading}>
                                {loading ? "Creating..." : "Create Draft"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
