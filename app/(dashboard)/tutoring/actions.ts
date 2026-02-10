
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateStudentAssignment(studentId: string, teacherId: string | null) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    // Security check
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!["super_admin", "admin", "hr"].includes(profile?.role || "")) {
        return { error: "Unauthorized" };
    }

    const { error } = await supabase
        .from("student_details")
        .update({ assigned_teacher_id: teacherId })
        .eq("id", studentId);

    if (error) {
        console.error("Error updating assignment:", error);
        return { error: error.message };
    }

    revalidatePath("/tutoring");
    revalidatePath("/hr/students");
    return { success: true };
}
