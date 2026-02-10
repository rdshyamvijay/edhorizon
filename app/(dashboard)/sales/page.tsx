import { getLeads, getPipelineStages } from "./actions";
import PipelineBoard from "@/components/features/sales/PipelineBoard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function SalesDashboard() {
    const [leads, stages] = await Promise.all([
        getLeads(),
        getPipelineStages()
    ]);

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">Sales Pipeline</h1>
                    <p className="text-muted-foreground">Track and manage your leads.</p>
                </div>
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4" />
                    Add Lead
                </Button>
            </div>

            <PipelineBoard leads={leads} stages={stages} />
        </div>
    );
}
