
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

export async function updateUserRoles(changes: { userId: string, newRole: string }[]) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    // Security: Check if requester is super_admin
    const { data: requesterProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (requesterProfile?.role !== "super_admin") {
        return { error: "Unauthorized" };
    }

    // Process all changes
    const results = await Promise.all(
        changes.map(async ({ userId, newRole }) => {
            console.log(`Attempting to update user ${userId} to role ${newRole}...`);
            const { error, count } = await supabase
                .from("profiles")
                .update({ role: newRole })
                .eq("id", userId)
                .select(); // Returning data to ensure update happened

            if (error) {
                console.error(`Error updating user ${userId} to role ${newRole}:`, error.message);
                return { userId, error: error.message };
            }

            console.log(`Successfully updated user ${userId} to ${newRole}`);
            return { userId, success: true };
        })
    );

    const errors = results.filter(r => 'error' in r);

    revalidatePath("/super-admin/users", "page");

    if (errors.length > 0) {
        return {
            error: "Some updates failed. Check logs for details.",
            details: errors
        };
    }

    return { success: true };
}
