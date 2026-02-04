
import { Button } from "@/components/ui/button"

export default function StudentDashboard() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-serif font-bold text-primary mb-4">Welcome back, Student!</h1>
            <p className="text-muted-foreground mb-8">Ready to continue your learning streak?</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Placeholder cards */}
                <div className="p-6 rounded-xl border bg-card shadow-sm">
                    <h3 className="font-semibold mb-2">MathHorizon</h3>
                    <p className="text-sm text-muted-foreground">Grade 1 • 60% Complete</p>
                    <Button className="mt-4 w-full" variant="secondary">Continue</Button>
                </div>
            </div>
        </div>
    )
}
