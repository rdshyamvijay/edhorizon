
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getUsers() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // Security: Check if requester is super_admin
    const { data: requesterProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (requesterProfile?.role !== "super_admin") {
        console.warn("Unauthorized access attempt to getUsers by", user.id);
        return [];
    }

    // Fetch all profiles
    const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching users:", error);
        return [];
    }

    return profiles;
}

export async function updateUserRole(userId: string, newRole: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    // Security: Check if requester is super_admin (optimized single query)
    const { data: requesterProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (requesterProfile?.role !== "super_admin") {
        return { error: "Unauthorized" };
    }

    // Update the user role
    const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

    if (error) return { error: error.message };

    // Use more specific revalidation for better performance
    revalidatePath("/super-admin/users", "page");
    return { success: true };
}
