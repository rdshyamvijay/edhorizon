
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getTeacherCapsules() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("capsules")
        .select("*, topics(title, courses(title))")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching capsules:", error);
        return [];
    }

    return data;
}

export async function createCapsule(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const videoUrl = formData.get("videoUrl") as string;

    // Hardcoded for V1 MVP: MathHorizon -> Grade 1 -> Counting to 10
    // In real app, these would come from select dropdowns or context
    // We need to fetch the Topic ID based on our seed data
    const { data: topic } = await supabase
        .from("topics")
        .select("id")
        .eq("title", "Counting to 10")
        .single();

    if (!topic) {
        // Fallback if seed data missing
        return { error: "Topic not found. Please run seed." };
    }

    const payload = {
        title,
        topic_id: topic.id,
        type: "video",
        status: "draft",
        author_id: user.id,
        content: {
            videoUrl,
            description,
        },
    };

    const { error } = await supabase.from("capsules").insert(payload);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/teacher");
    return { success: true };
}
