import { getTopicsByCourse } from "../../actions";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Layout, ChevronRight, PlayCircle, HelpCircle, FileText, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Badge } from "@/components/ui/badge";

export default async function CourseDetail({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = await paramsPromise;
    const topics = await getTopicsByCourse(params.id);
    const supabase = await createClient();

    const { data: course } = await supabase
        .from('courses')
        .select('*, modules(id, title)')
        .eq('id', params.id)
        .single();

    if (!course) return <div>Course not found</div>;

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href={`/content/modules/${course.modules?.id}`}>
                        <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 border-border/40">
                            <ArrowLeft size={20} />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Course • Level {course.grade}</span>
                            <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">{course.title}</h1>
                        </div>
                        <p className="text-muted-foreground italic text-sm">{course.description || 'Curriculum management for this grade level.'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/content/capsules/create">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full h-12 px-8 font-black uppercase tracking-widest text-xs gap-2 shadow-lg shadow-indigo-200">
                            <Plus size={18} />
                            New Capsule
                        </Button>
                    </Link>
                    <ThemeToggle />
                </div>
            </div>

            {/* Topics Section */}
            <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-2xl font-serif font-bold">Syllabus & Topics</h2>
                    <Button variant="outline" className="rounded-2xl h-10 px-6 gap-2 border-border/40 font-bold text-xs uppercase tracking-widest bg-card">
                        <Plus size={14} />
                        Add Topic
                    </Button>
                </div>

                <div className="space-y-6">
                    {topics.map((topic) => (
                        <div key={topic.id} className="space-y-4">
                            <div className="flex items-center justify-between px-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-indigo-600" />
                                    <h3 className="text-xl font-bold text-foreground">{topic.title}</h3>
                                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black italic">
                                        {topic.capsules?.length || 0} Capsules
                                    </Badge>
                                </div>
                                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                                    <MoreHorizontal size={14} />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-4">
                                {topic.capsules?.map((capsule: any) => (
                                    <Card key={capsule.id} className="rounded-[2.5rem] border border-border/30 hover:border-indigo-500/50 hover:shadow-2xl transition-all overflow-hidden bg-card group">
                                        <CardHeader className="p-6 pb-2">
                                            <div className="flex items-start justify-between">
                                                <div className={`p-3 rounded-2xl w-fit mb-4 ${capsule.type === 'video' ? 'bg-rose-50 text-rose-600' :
                                                    capsule.type === 'quiz' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-indigo-50 text-indigo-600'
                                                    }`}>
                                                    {capsule.type === 'video' ? <PlayCircle size={20} /> :
                                                        capsule.type === 'quiz' ? <HelpCircle size={20} /> :
                                                            <FileText size={20} />}
                                                </div>
                                                <Badge variant="outline" className="capitalize text-[10px] font-bold tracking-wider rounded-full py-0.5 px-3 border-border/50">
                                                    {capsule.status}
                                                </Badge>
                                            </div>
                                            <h4 className="font-bold text-lg leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{capsule.title}</h4>
                                        </CardHeader>
                                        <CardContent className="p-6 pt-0">
                                            <div className="flex items-center justify-between mt-6">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Last Updated: {new Date(capsule.updated_at).toLocaleDateString()}</span>
                                                <Button size="icon" variant="ghost" className="rounded-full h-10 w-10 bg-muted/30 hover:bg-indigo-600 hover:text-white transition-all">
                                                    <ChevronRight size={18} />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button variant="outline" className="rounded-[2.5rem] border-2 border-dashed border-border/50 h-auto min-h-[180px] flex flex-col items-center justify-center gap-3 hover:bg-muted/30 transition-all bg-transparent">
                                    <Plus className="text-muted-foreground" size={32} />
                                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground italic">Add Capsule</span>
                                </Button>
                            </div>
                        </div>
                    ))}
                    {topics.length === 0 && (
                        <div className="py-20 bg-muted/20 rounded-[3rem] border-2 border-dashed border-border/50 flex flex-col items-center justify-center text-muted-foreground italic">
                            <Layout size={48} className="opacity-10 mb-4" />
                            <p>No topics added to this course syllabus yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
