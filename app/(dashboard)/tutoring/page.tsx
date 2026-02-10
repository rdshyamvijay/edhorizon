
import { createClient } from "@/lib/supabase/server";
import TutoringClient from "./TutoringClient";

export default async function TutoringPage() {
    const supabase = await createClient();

    const { data: students, error: studentError } = await supabase
        .from('profiles')
        .select(`
            id,
            full_name,
            email,
            role,
            student_details!student_details_id_fkey (
                assigned_teacher_id,
                status,
                grade_level
            )
        `)
        .eq('role', 'student')
        .order('full_name', { ascending: true });

    if (studentError) {
        console.error("Error fetching students in TutoringPage:", studentError);
    }

    // Handle array case for joins
    const processedStudents = (students as any)?.map((s: any) => ({
        ...s,
        student_details: Array.isArray(s.student_details) ? s.student_details[0] : s.student_details
    })) || [];

    // Fetch teachers
    const { data: teachers, error: teacherError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .eq('role', 'teacher')
        .order('full_name', { ascending: true });

    if (teacherError) {
        console.error("Error fetching teachers in TutoringPage:", teacherError);
    }

    return (
        <TutoringClient
            initialStudents={processedStudents}
            initialTeachers={(teachers as any) || []}
        />
    );
}
