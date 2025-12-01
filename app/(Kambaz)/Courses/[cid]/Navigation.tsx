"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CourseNavigation() {
  const pathname = usePathname();
  // Extract the course ID from the pathname
  const courseId = pathname.split("/Courses/")[1]?.split("/")[0];
  const links = [
    { label: "Home", path: "/Home" },
    { label: "Modules", path: "/Modules" },
    { label: "Piazza", path: "/Piazza" },
    { label: "Zoom", path: "/Zoom" },
    { label: "Assignments", path: "/Assignments" },
    { label: "Quizzes", path: "/Quizzes" },
    { label: "Grades", path: "/Grades" },
    { label: "People", path: "/People" },
  ];

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path || pathname.startsWith(path + "/");
    return `list-group-item border-0 ${isActive ? "active" : "text-danger"}`;
  };

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link, index) => {
        return (
          <div key={index}>
            <Link
              key={link.label}
              href={`/Courses/${courseId}${link.path}`}
              id="wd-course-home-link"
              className={getLinkClasses(`/Courses/${courseId}${link.path}`)}
            >
              {link.label}
            </Link>
            <br />
          </div>
        );
      })}
    </div>
  );
}
