
import {
    BookOpen,
    LayoutDashboard,
    Users,
    Settings,
    BarChart3,
    DollarSign,
    FileText,
    GraduationCap,
    Briefcase,
    UsersRound
} from "lucide-react";

export const ROLE_REDIRECTS = {
    super_admin: "/super-admin",
    admin: "/admin",
    teacher: "/teacher",
    student: "/student",
    parent: "/student", // Parents view student dashboard (read-only)
    sales: "/sales",
    hr: "/hr",
};

export const NAV_ITEMS = [
    {
        title: "Dashboard",
        href: "/student",
        icon: LayoutDashboard,
        roles: ["student", "parent"],
    },
    {
        title: "Tutoring",
        href: "/tutoring",
        icon: UsersRound,
        roles: ["hr", "super_admin", "admin", "teacher"],
    },
    {
        title: "Learn",
        href: "/student/learn",
        icon: BookOpen,
        roles: ["student", "parent"],
    },
    {
        title: "Dashboard",
        href: "/teacher",
        icon: LayoutDashboard,
        roles: ["teacher"],
    },
    {
        title: "My Classes",
        href: "/teacher/classes",
        icon: Users,
        roles: ["teacher"],
    },
    {
        title: "Dashboard",
        href: "/super-admin",
        icon: LayoutDashboard,
        roles: ["super_admin"],
    },
    {
        title: "Users",
        href: "/super-admin/users",
        icon: Users,
        roles: ["super_admin", "admin"],
    },
    {
        title: "Content",
        href: "/content",
        icon: FileText,
        roles: ["super_admin", "admin", "teacher"],
    },
    {
        title: "Pipeline",
        href: "/sales",
        icon: DollarSign,
        roles: ["sales", "super_admin"],
    },
    {
        title: "Staff & Payroll",
        href: "/hr",
        icon: Briefcase,
        roles: ["hr", "super_admin"],
    },
    {
        title: "Staff Directory",
        href: "/hr/staff",
        icon: Users,
        roles: ["hr", "super_admin"],
    },
    {
        title: "Student Directory",
        href: "/hr/students",
        icon: GraduationCap,
        roles: ["hr", "super_admin", "admin"],
    },
    {
        title: "Payroll Pulse",
        href: "/hr/payroll",
        icon: DollarSign,
        roles: ["hr", "super_admin"],
    },
];
