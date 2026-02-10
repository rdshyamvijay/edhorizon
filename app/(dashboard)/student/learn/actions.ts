'use server'

import { createClient } from "@/lib/supabase/server";

export async function getStudentCourses() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Get courses along with topics and capsules
    const { data, error } = await supabase
        .from('courses')
        .select(`
            *,
            topics (
                *,
                capsules (
                    *,
                    quiz_completions (score)
                )
            )
        `)
        .order('order', { ascending: true });

    if (error) throw error;

    // Process to calculate progress per topic
    return data.map(course => ({
        ...course,
        topics: course.topics.map((topic: any) => {
            const totalCapsules = topic.capsules.length;
            const completedCapsules = topic.capsules.filter((c: any) =>
                c.quiz_completions && (c.quiz_completions.length > 0 || c.type === 'video') // Video might need a separate completion tracker
            ).length;

            return {
                ...topic,
                progress: totalCapsules > 0 ? (completedCapsules / totalCapsules) * 100 : 0,
                totalCapsules,
                completedCapsules
            };
        })
    }));
}

export async function saveQuizResult(capsuleId: string, score: number, totalQuestions: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('quiz_completions')
        .upsert({
            student_id: user.id,
            capsule_id: capsuleId,
            score,
            total_questions: totalQuestions,
            completed_at: new Date().toISOString()
        }, {
            onConflict: 'student_id,capsule_id'
        });

    if (error) throw error;
    return { success: true };
}
