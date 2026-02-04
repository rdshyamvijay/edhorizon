"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getLeads() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // Fetch leads based on role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    let query = supabase.from("leads").select("*, assigned_to(full_name, email)");

    // If not super_admin or admin, only show assigned leads
    if (profile?.role !== "super_admin" && profile?.role !== "admin") {
        query = query.eq("assigned_to", user.id);
    }

    const { data: leads, error } = await query.order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching leads:", error);
        return [];
    }

    return leads;
}

export async function updateLeadStatus(leadId: string, status: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase
        .from("leads")
        .update({ status })
        .eq("id", leadId);

    if (error) {
        console.error("Error updating lead status:", error);
        return { error: error.message };
    }

    revalidatePath("/sales");
    return { success: true };
}

export async function addLead(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const valueInput = formData.get("value") as string;
    const value = valueInput ? parseFloat(valueInput) : 0;
    const notes = formData.get("notes") as string;

    const { error } = await supabase.from("leads").insert({
        name,
        email,
        phone,
        value,
        notes,
        assigned_to: user.id, // Assign to creator by default
        status: "new",
    });

    if (error) {
        console.error("Error adding lead:", error);
        return { error: error.message };
    }

    revalidatePath("/sales");
    return { success: true };
}
