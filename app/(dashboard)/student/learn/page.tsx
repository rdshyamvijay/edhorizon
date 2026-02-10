import { getStudentCourses } from "./actions"
import { StudentLearnClient } from "./StudentLearnClient"

export default async function LearnPage() {
    const courses = await getStudentCourses();

    return (
        <div className="py-8">
            <StudentLearnClient courses={courses as any[]} />
        </div>
    )
}
