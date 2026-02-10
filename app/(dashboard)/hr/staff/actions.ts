
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";

export async function createStaffMember(data: { full_name: string; email: string; role: string }) {
    const supabase = await createClient();
    const adminClient = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    // Security: Check if requester is authorized (HR or Admin)
    const { data: requesterProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!["super_admin", "admin", "hr"].includes(requesterProfile?.role || "")) {
        return { error: "Unauthorized" };
    }

    // Use Admin API to invite user - this will create the auth.user and trigger profile creation
    const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
        data.email,
        {
            data: {
                full_name: data.full_name,
                role: data.role
            },
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
        }
    );

    if (inviteError) {
        console.error("Error inviting staff:", inviteError);
        return { error: inviteError.message };
    }

    revalidatePath("/hr/staff");
    return { success: true };
}

export async function createStudentMember(data: { full_name: string; email: string; grade_level: string }) {
    const supabase = await createClient();
    const adminClient = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const { data: requesterProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!["super_admin", "admin", "hr"].includes(requesterProfile?.role || "")) {
        return { error: "Unauthorized" };
    }

    // Invite student - triggers handle_new_user -> profile creation -> student_details creation
    const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
        data.email,
        {
            data: {
                full_name: data.full_name,
                role: "student"
            },
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
        }
    );

    if (inviteError) {
        console.error("Error inviting student:", inviteError);
        return { error: inviteError.message };
    }

    // Update grade_level in student_details (which was created by trigger)
    if (inviteData?.user) {
        const { error: updateError } = await adminClient
            .from("student_details")
            .update({ grade_level: data.grade_level })
            .eq("id", inviteData.user.id);

        if (updateError) {
            console.error("Error updating student grade level:", updateError);
        }
    }

    revalidatePath("/hr/students");
    return { success: true };
}
