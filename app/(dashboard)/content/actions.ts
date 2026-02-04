'use server'

import { createClient } from "@/lib/supabase/server";

export async function getModules() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('modules')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getCoursesByModule(moduleId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('module_id', moduleId)
        .order('order', { ascending: true });

    if (error) throw error;
    return data;
}

export async function getTopicsByCourse(courseId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('topics')
        .select(`
            *,
            capsules (*)
        `)
        .eq('course_id', courseId)
        .order('order', { ascending: true });

    if (error) throw error;
    return data;
}

export async function getTopics() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('topics')
        .select(`
            *,
            courses(title)
        `)
        .order('title', { ascending: true });

    if (error) throw error;
    return data;
}

export async function saveCapsule(payload: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
        .from('capsules')
        .insert({
            ...payload,
            author_id: user.id,
            status: 'published'
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}
