"use client";

import CoursesView from "./CoursesView";

export default function CoursesPage() {
  return (
    <div id="wd-courses-page" style={{ width: "100%" }}>
      <h1>Courses</h1>
      <hr />
      <CoursesView showCourseEditor={false} />
    </div>
  );
}
