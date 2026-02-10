import { Button } from "@/components/ui/button"
import { BookOpen, Trophy, Flame } from "lucide-react"
import Link from "next/link"

export default function StudentDashboard() {
    return (
        <div className="space-y-12">
            {/* Premium Header */}
            <div className="bg-indigo-600 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 h-80 w-80 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4 max-w-xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md">
                            <Flame size={14} className="text-amber-400" />
                            <span>7 Day Streak!</span>
                        </div>
                        <h1 className="text-5xl font-serif font-bold tracking-tight italic">Learn without limits, Student!</h1>
                        <p className="text-indigo-100 text-lg italic opacity-90">Your curious mind is the greatest tool you possess. Ready to conquer today's lessons?</p>
                    </div>
                    <Link href="/student/learn">
                        <Button className="bg-white text-indigo-600 hover:bg-white/90 rounded-[2rem] h-20 px-12 font-black uppercase tracking-widest text-sm shadow-xl flex flex-col items-center leading-none gap-1">
                            <span>Continue Journey</span>
                            <span className="text-[10px] opacity-60">Topic: Ancient Civilizations</span>
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-10 rounded-[2.5rem] border border-border/40 bg-card shadow-xl hover:shadow-2xl transition-all group">
                    <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                        <BookOpen size={28} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 italic">Curriculum Content</h3>
                    <p className="text-muted-foreground italic mb-8">Access your personalized syllabus and recorded lessons.</p>
                    <Link href="/student/learn">
                        <Button className="w-full rounded-2xl h-14 font-black uppercase tracking-widest text-xs" variant="secondary">Open Studio</Button>
                    </Link>
                </div>

                <div className="p-10 rounded-[2.5rem] border border-border/40 bg-card shadow-xl hover:shadow-2xl transition-all group">
                    <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
                        <Trophy size={28} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 italic">Achievements</h3>
                    <p className="text-muted-foreground italic mb-8">Review your mastery badges and course certificates.</p>
                    <Button className="w-full rounded-2xl h-14 font-black uppercase tracking-widest text-xs" variant="secondary" disabled>Coming Soon</Button>
                </div>
            </div>
        </div>
    )
}
