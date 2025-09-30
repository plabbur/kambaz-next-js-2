"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CourseNavigation() {
    const pathname = usePathname();

    const getLinkClasses = (path: string) => {
        const isActive = pathname === path || pathname.startsWith(path + '/');
        return `list-group-item border-0 ${isActive ? 'active' : 'text-danger'}`;
    };

    return (
        <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
            <Link href="/Courses/1234/Home" id="wd-course-home-link"
                className={getLinkClasses('/Courses/1234/Home')}> Home </Link><br />
            <Link href="/Courses/1234/Modules" id="wd-course-modules-link"
                className={getLinkClasses('/Courses/1234/Modules')}> Modules </Link><br />
            <Link href="/Courses/1234/Piazza" id="wd-course-piazza-link"
                className={getLinkClasses('/Courses/1234/Piazza')}> Piazza </Link><br />
            <Link href="/Courses/1234/Zoom" id="wd-course-zoom-link"
                className={getLinkClasses('/Courses/1234/Zoom')}> Zoom </Link><br />
            <Link href="/Courses/1234/Assignments" id="wd-course-assignments-link"
                className={getLinkClasses('/Courses/1234/Assignments')}> Assignments </Link><br />
            <Link href="/Courses/1234/Quizzes" id="wd-course-quizzes-link"
                className={getLinkClasses('/Courses/1234/Quizzes')}> Quizzes </Link><br />
            <Link href="/Courses/1234/People/Table" id="wd-course-people-link"
                className={getLinkClasses('/Courses/1234/People')}> People </Link><br />
        </div>
    );
}
