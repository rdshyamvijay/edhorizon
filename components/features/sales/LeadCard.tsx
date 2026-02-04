"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateLeadStatus } from "@/app/(dashboard)/sales/actions";
import { useState } from "react";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

const STATUS_ORDER = ['new', 'contacted', 'demo_scheduled', 'closed_won', 'closed_lost'];

export default function LeadCard({ lead }: { lead: any }) {
    const [loading, setLoading] = useState(false);

    const currentIndex = STATUS_ORDER.indexOf(lead.status);

    const moveLead = async (direction: 'next' | 'prev') => {
        const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex < 0 || nextIndex >= STATUS_ORDER.length) return;

        setLoading(true);
        const result = await updateLeadStatus(lead.id, STATUS_ORDER[nextIndex]);
        setLoading(false);

        if (result.error) {
            alert("Error updating status: " + result.error);
        }
    };

    return (
        <Card className="shadow-sm border-muted-foreground/10">
            <CardHeader className="p-4 pb-2 space-y-0">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-semibold truncate max-w-[150px]">
                        {lead.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-[10px] capitalize">
                        {lead.status.replace('_', ' ')}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-primary">${lead.value.toLocaleString()}</p>
                {lead.email && <p>{lead.email}</p>}
            </CardContent>
            <CardFooter className="p-2 border-t flex justify-between gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={currentIndex === 0 || loading}
                    onClick={() => moveLead('prev')}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={currentIndex >= STATUS_ORDER.length - 1 || loading}
                    onClick={() => moveLead('next')}
                >
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
