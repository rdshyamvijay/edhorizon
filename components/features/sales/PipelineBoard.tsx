
"use client";

import { useState } from "react";
import LeadCard from "./LeadCard";
import { updateLeadStatus, addPipelineStage } from "@/app/(dashboard)/sales/actions";
import { Plus, Loader2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

export default function PipelineBoard({ leads, stages }: { leads: any[], stages: any[] }) {
    const [draggingOver, setDraggingOver] = useState<string | null>(null);
    const [isAddingStage, setIsAddingStage] = useState(false);
    const [newStageLabel, setNewStageLabel] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    const handleDragOverContainer = (e: React.DragEvent) => {
        e.preventDefault();
        if (!scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const scrollThreshold = 100;
        const scrollSpeed = 15;

        if (x < scrollThreshold) {
            container.scrollLeft -= scrollSpeed;
        } else if (x > rect.width - scrollThreshold) {
            container.scrollLeft += scrollSpeed;
        }
    };

    const handleDragOverStage = (e: React.DragEvent, stageSlug: string) => {
        e.preventDefault();
        setDraggingOver(stageSlug);
    };

    const handleDragLeave = () => {
        setDraggingOver(null);
    };

    const handleDrop = async (e: React.DragEvent, stageSlug: string) => {
        e.preventDefault();
        setDraggingOver(null);
        const leadId = e.dataTransfer.getData("leadId");

        if (!leadId) return;

        // Find the lead to check if it's already in this stage
        const lead = leads.find(l => l.id === leadId);
        if (lead?.status === stageSlug) return;

        // Optimistic update could be added here, but for now just call the action
        await updateLeadStatus(leadId, stageSlug);
    };

    const handleAddStage = async () => {
        if (!newStageLabel.trim()) return;
        setIsLoading(true);
        await addPipelineStage(newStageLabel);
        setIsLoading(false);
        setIsAddingStage(false);
        setNewStageLabel("");
    };

    return (
        <div
            ref={scrollContainerRef}
            onDragOver={handleDragOverContainer}
            className="flex gap-4 overflow-x-auto pb-6 -mx-8 px-8 items-start min-h-[calc(100vh-250px)] scroll-smooth"
        >
            {stages.map((stage) => (
                <div
                    key={stage.slug}
                    className="min-w-[280px] w-[280px] flex flex-col group/column h-full"
                    onDragOver={(e) => handleDragOverStage(e, stage.slug)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, stage.slug)}
                >
                    <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-serif font-black text-[11px] text-primary uppercase tracking-[0.2em]">
                                {stage.label}
                            </h3>
                            <span className="text-[10px] bg-muted/60 px-2.5 py-0.5 rounded-full font-bold text-muted-foreground/70">
                                {leads.filter(l => l.status === stage.slug).length}
                            </span>
                        </div>
                    </div>

                    <div className={`
                        flex-1 bg-muted/20 rounded-[1.5rem] p-3 transition-all duration-200 min-h-[400px] border-2 border-transparent
                        ${draggingOver === stage.slug ? 'bg-indigo-500/5 border-dashed border-indigo-400/30 scale-[1.01]' : 'group-hover/column:bg-muted/30'}
                    `}>
                        <div className="space-y-3">
                            {leads
                                .filter(l => l.status === stage.slug)
                                .map(lead => (
                                    <LeadCard key={lead.id} lead={lead} />
                                ))}

                            {leads.filter(l => l.status === stage.slug).length === 0 && (
                                <div className="h-24 flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/10 rounded-2xl text-muted-foreground/30 text-[10px] uppercase font-bold tracking-widest gap-2">
                                    Drop here
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Add Stage Column */}
            <div className="min-w-[280px] w-[280px]">
                {isAddingStage ? (
                    <div className="bg-card rounded-[1.5rem] p-4 border border-border/50 shadow-sm animate-in fade-in slide-in-from-right-4">
                        <Input
                            placeholder="Stage Name..."
                            value={newStageLabel}
                            onChange={(e) => setNewStageLabel(e.target.value)}
                            className="h-9 text-xs mb-3 font-bold uppercase tracking-tight"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <Button size="sm" className="flex-1 bg-indigo-600 hover:bg-indigo-700 h-8 text-[10px] uppercase font-bold" onClick={handleAddStage} disabled={isLoading}>
                                {isLoading ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Plus className="h-3 w-3 mr-2" />}
                                Create
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 text-[10px] uppercase font-bold" onClick={() => setIsAddingStage(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAddingStage(true)}
                        className="w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed border-muted-foreground/10 rounded-[1.5rem] text-muted-foreground/40 hover:text-indigo-500 hover:border-indigo-400/30 hover:bg-indigo-50/50 transition-all group"
                    >
                        <Plus className="h-4 w-4 transition-transform group-hover:scale-125" />
                        <span className="text-[10px] font-black uppercase tracking-widest">New Stage</span>
                    </button>
                )}
            </div>
        </div>
    );
}
