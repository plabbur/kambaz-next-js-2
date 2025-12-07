"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  FormControl,
  Row,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import * as enrollClient from "../Account/enrollmentsClient";
import { randomColor } from "../utils";
import { useRouter } from "next/navigation";
import * as client from "./client";

const CourseCard = ({
  course,
  deleteCourse,
  editCourse,
  isEnrolled,
  onEnrollmentClick,
  showAdminControls = false,
}: {
  course: CourseType;
  deleteCourse?: (event: any) => void;
  editCourse?: (event: any) => void;
  isEnrolled: boolean;
  onEnrollmentClick: () => void;
  showAdminControls?: boolean;
}) => {
  const router = useRouter();
  return (
    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
      <Card>
        <div className="wd-dashboard-course-link text-decoration-none text-dark">
          {course.image ? (
            <CardImg
              src="/images/reactjs.jpg"
              variant="top"
              width="100%"
              height={160}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: 160,
                backgroundColor: course.color || "#F0F0F0",
              }}
            />
          )}

          <CardBody className="card-body">
            <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
              {course.name}
            </CardTitle>
            <CardText
              className="wd-dashboard-course-description overflow-hidden"
              style={{ height: "100px" }}
            >
              {course.description}
            </CardText>
            {isEnrolled ? (
              <>
                <Button
                  variant="primary"
                  onClick={() => router.push(`/Courses/${course._id}/Home`)}
                >
                  Go
                </Button>
                <Button
                  variant="danger"
                  onClick={(e) => {
                    e.preventDefault();
                    onEnrollmentClick();
                  }}
                >
                  Unenroll
                </Button>
              </>
            ) : (
              <Button
                variant="success"
                onClick={(e) => {
                  e.preventDefault();
                  onEnrollmentClick();
                }}
              >
                Enroll
              </Button>
            )}
            {showAdminControls && (
              <>
                <Button onClick={editCourse} variant="warning">
                  Edit
                </Button>
                <Button
                  onClick={deleteCourse}
                  id="wd-delete-course-click"
                  variant="danger"
                >
                  Delete
                </Button>
              </>
            )}
          </CardBody>
        </div>
      </Card>
    </Col>
  );
};

export default function CoursesView({
  showCourseEditor = false,
}: {
  showCourseEditor?: boolean;
}) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<CourseType[]>([]);

  const emptyCourse: CourseType = {
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    color: "blue",
    description: "New Description",
    department: "New Department",
    credits: 3,
  };
  const [course, setCourse] = useState<CourseType>(emptyCourse);

  const filteredCourses = showAllCourses ? courses : enrolledCourses;

  const fetchCourses = async () => {
    try {
      const fetchedCourses = await client.fetchAllCourses();
      setCourses(fetchedCourses);
    } catch (error) {
      console.error(error);
    }
  };

  const loadEnrollments = async () => {
    if (!currentUser) return;
    try {
      const items = await enrollClient.findEnrollmentsForUser(currentUser._id);
      setEnrolledCourses(items);
    } catch (e) {
      console.error("failed to load enrollments", e);
    }
  };

  const onAddNewCourse = async () => {
    const courseWithColor = { ...course, color: randomColor() };
    const newCourse = await client.createCourse(courseWithColor);
    setCourses([...courses, newCourse]);
    setCourse(emptyCourse);
  };

  const onDeleteCourse = async (courseId: string) => {
    await client.deleteCourse(courseId);
    setCourses(courses.filter((course: CourseType) => course._id !== courseId));
    setEnrolledCourses(
      enrolledCourses.filter((course: CourseType) => course._id !== courseId)
    );
  };

  const onUpdateCourse = async () => {
    const updated = await client.updateCourse(course);
    setCourses(
      courses.map((c: CourseType) => (c._id === updated._id ? updated : c))
    );
    setEnrolledCourses(
      enrolledCourses.map((c: CourseType) =>
        c._id === updated._id ? updated : c
      )
    );
    setCourse(emptyCourse);
  };

  useEffect(() => {
    fetchCourses();
    loadEnrollments();
  }, [currentUser]);

  const isEnrolled = (courseId: string) => {
    return enrolledCourses.some((c: CourseType) => c._id === courseId);
  };

  const handleEnrollment = async (
    courseId: string,
    isCurrentlyEnrolled: boolean
  ) => {
    if (!currentUser) return;
    try {
      if (isCurrentlyEnrolled) {
        await enrollClient.unenroll(currentUser._id, courseId);
      } else {
        await enrollClient.enroll(currentUser._id, courseId);
      }
      // Reload enrollments after change
      await loadEnrollments();
    } catch (e) {
      console.error("enroll/unenroll failed", e);
    }
  };

  if (!currentUser) {
    return <div>Please log in to view courses.</div>;
  }

  return (
    <div id="wd-courses" style={{ width: "100%" }}>
      {showCourseEditor && (
        <>
          <h5>
            New Course
            <button
              onClick={onAddNewCourse}
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
            >
              Add
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={onUpdateCourse}
              id="wd-update-course-click"
            >
              Update
            </button>
          </h5>
          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            value={course.description}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
          <hr />
        </>
      )}
      <div className="d-flex justify-content-between align-items-center">
        <h2 id="wd-dashboard-published">
          {showAllCourses ? "All Courses" : "My Courses"} (
          {filteredCourses.length})
        </h2>
        <Button
          variant="primary"
          onClick={() => setShowAllCourses(!showAllCourses)}
        >
          {showAllCourses ? "Show My Enrollments" : "Show All Courses"}
        </Button>
      </div>
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {filteredCourses.map((course: CourseType) => (
            <CourseCard
              key={course._id}
              course={course}
              deleteCourse={() => onDeleteCourse(course._id)}
              editCourse={
                currentUser.role === "FACULTY" || currentUser.role === "ADMIN"
                  ? (event: Event) => {
                      event.preventDefault();
                      setCourse(course);
                    }
                  : undefined
              }
              isEnrolled={isEnrolled(course._id)}
              onEnrollmentClick={() =>
                handleEnrollment(course._id, isEnrolled(course._id))
              }
              showAdminControls={
                currentUser.role === "FACULTY" || currentUser.role === "ADMIN"
              }
            />
          ))}
        </Row>
      </div>
    </div>
  );
}
