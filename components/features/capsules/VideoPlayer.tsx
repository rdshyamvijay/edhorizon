
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
    content: {
        videoUrl: string;
        description: string;
    };
    onComplete?: () => void;
}

export default function VideoPlayer({ content, onComplete }: VideoPlayerProps) {
    // Simple parser for YouTube/Vimeo
    const getEmbedUrl = (url: string) => {
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            const id = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
            return `https://www.youtube.com/embed/${id}`;
        }
        if (url.includes("vimeo.com")) {
            const id = url.split("/").pop();
            return `https://player.vimeo.com/video/${id}`;
        }
        return url;
    };

    return (
        <div className="space-y-4">
            <div className="aspect-video w-full overflow-hidden rounded-xl border bg-black shadow-lg">
                <iframe
                    src={getEmbedUrl(content.videoUrl)}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Notes</CardTitle>
                    <CardDescription>{content.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={onComplete} className="w-full gap-2" size="lg">
                        <CheckCircle className="h-4 w-4" />
                        Mark as Complete
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
