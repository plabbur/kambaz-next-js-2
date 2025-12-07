"use client";

import { useSelector } from "react-redux";
import { useParams } from "next/navigation";

import { ReactNode, useState } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import Breadcrumb from "./Breadcrumb";

export default function CoursesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { cid } = useParams();
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const course = courses.find((course: any) => course._id === cid);

  const [showNav, setShowNav] = useState(true);

  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <button
          onClick={() => setShowNav(!showNav)}
          className="btn btn-link border-0 text-danger p-0 text-decoration-none"
        >
          <FaAlignJustify className="me-4 fs-4 mb-1" />
        </button>

        <Breadcrumb course={course} />
      </h2>
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          {showNav && <CourseNavigation />}
        </div>
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}
