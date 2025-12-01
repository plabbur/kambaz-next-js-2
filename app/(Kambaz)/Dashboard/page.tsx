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
import { useDispatch, useSelector } from "react-redux";
import {
  enroll,
  unenroll,
  setEnrollments,
} from "../Account/enrollmentsReducer";
import * as enrollClient from "../Account/enrollmentsClient";
import {
  addNewCourse,
  deleteCourse,
  updateCourse,
  setCourses,
} from "../Courses/reducer";
import { randomColor } from "../utils";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import * as client from "../Courses/client";

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
          <div
            className=""
            style={{
              width: "100%",
              height: 160,
              backgroundColor: course.color ? course.color : "#FFFFFF",
            }}
          >
            {course.image && (
              <CardImg
                src="/images/reactjs.jpg"
                variant="top"
                width="100%"
                height={160}
              />
            )}
          </div>

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

export default function Dashboard() {
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  // After enrollments API refactor, enrollments is now an array of enrolled course objects
  const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);
  const dispatch = useDispatch();
  const [showAllCourses, setShowAllCourses] = useState(false);

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

  const filteredCourses = showAllCourses
    ? courses
    : enrollments;

  const fetchCourses = async () => {
    try {
      // load the full course catalog; "My Courses" is computed by filtering
      const courses = await client.fetchAllCourses();
      dispatch(setCourses(courses));
    } catch (error) {
      console.error(error);
    }
  };

  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    dispatch(setCourses([...courses, newCourse]));
    setCourse(emptyCourse);
  };

  const onDeleteCourse = async (courseId: string) => {
    const status = await client.deleteCourse(courseId);
    dispatch(
      setCourses(
        courses.filter((course: CourseType) => course._id !== courseId)
      )
    );
  };

  const onUpdateCourse = async () => {
    const updated = await client.updateCourse(course);
    dispatch(
      setCourses(
        courses.map((c: CourseType) =>
          c._id === updated._id ? updated : c
        )
      )
    );
    setCourse(emptyCourse);
  };

  useEffect(() => {
    fetchCourses();
    const loadEnrollments = async () => {
      if (!currentUser) return;
      try {
        // items is now an array of enrolled course objects
        const items = await enrollClient.findEnrollmentsForUser(currentUser._id);
        dispatch(setEnrollments(items));
      } catch (e) {
        console.error("failed to load enrollments", e);
      }
    };
    loadEnrollments();
  }, [currentUser]);

  const isEnrolled = (courseId: string) => {
    // enrollments is now an array of course objects
    return enrollments.some((c: CourseType) => c._id === courseId);
  };

  const handleEnrollment = async (courseId: string, isCurrentlyEnrolled: boolean) => {
    if (!currentUser) return;
    try {
      if (isCurrentlyEnrolled) {
        await enrollClient.unenroll(currentUser._id, courseId);
      } else {
        await enrollClient.enroll(currentUser._id, courseId);
      }
      // Always reload enrollments after change
      const items = await enrollClient.findEnrollmentsForUser(currentUser._id);
      dispatch(setEnrollments(items));
    } catch (e) {
      console.error('enroll/unenroll failed', e);
    }
  };

  if (!currentUser) {
    return <div>Please log in to view the dashboard.</div>;
  }

  return (
    <div id="wd-dashboard" style={{ width: "100%" }}>
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
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
        onChange={(e) => setCourse({ ...course, description: e.target.value })}
      />
      <hr />
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
