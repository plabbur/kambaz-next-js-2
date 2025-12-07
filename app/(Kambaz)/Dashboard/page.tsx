"use client";

import CoursesView from "../Courses/CoursesView";

export default function Dashboard() {
  return (
    <div id="wd-dashboard" style={{ width: "100%" }}>
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <CoursesView showCourseEditor={true} />
    </div>
  );
}
