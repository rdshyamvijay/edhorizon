"use client";

import LeadCard from "./LeadCard";

const COLUMNS = [
    { id: 'new', label: 'New Leads' },
    { id: 'contacted', label: 'Contacted' },
    { id: 'demo_scheduled', label: 'Demo' },
    { id: 'closed_won', label: 'Won' },
    { id: 'closed_lost', label: 'Lost' },
];

export default function PipelineBoard({ leads }: { leads: any[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
            {COLUMNS.map((col) => (
                <div key={col.id} className="min-w-[250px] space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="font-serif font-bold text-sm text-primary uppercase tracking-wider">
                            {col.label}
                        </h3>
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                            {leads.filter(l => l.status === col.id).length}
                        </span>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-2 min-h-[500px] space-y-3">
                        {leads
                            .filter(l => l.status === col.id)
                            .map(lead => (
                                <LeadCard key={lead.id} lead={lead} />
                            ))}

                        {leads.filter(l => l.status === col.id).length === 0 && (
                            <div className="h-20 flex items-center justify-center border-2 border-dashed border-muted rounded-lg text-muted-foreground/50 text-[10px]">
                                No leads
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
