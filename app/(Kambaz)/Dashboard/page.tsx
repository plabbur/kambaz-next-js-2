"use client";

import { useState } from "react";
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, FormControl, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { enroll, unenroll } from "../Account/enrollmentsReducer";
import { addNewCourse, deleteCourse, updateCourse } from "../Courses/reducer";
import { randomColor } from "../utils";
import { useRouter } from "next/navigation";

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
        <div
          className="wd-dashboard-course-link text-decoration-none text-dark"
        >
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
                <Button variant="primary" onClick={() => router.push(`/Courses/${course._id}/Home`)}>
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
  const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);
  const dispatch = useDispatch();
  const [showAllCourses, setShowAllCourses] = useState(false);

  const [course, setCourse] = useState<CourseType>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    color: "blue",
    description: "New Description",
    department: "New Department",
    credits: 3,
  });

  const isEnrolled = (courseId: string) => {
    return enrollments.some(
      (enrollment: any) =>
        enrollment.user === currentUser._id && 
        enrollment.course === courseId
    );
  };

  const handleEnrollment = (courseId: string, isCurrentlyEnrolled: boolean) => {
    if (isCurrentlyEnrolled) {
      dispatch(unenroll({ userId: currentUser._id, courseId }));
    } else {
      dispatch(enroll({ userId: currentUser._id, courseId }));
    }
  };

  // const { currentUser } = useSelector((state: any) => state.accountReducer);
  // const { enrollments } = db;

  function uuidv4() {
    throw new Error("Function not implemented.");
  }

  // const addNewCourse = () => {
  //   const newColor = randomColor();
  //   const newCourse = { ...course, _id: uuidv4(), color: newColor };
  //   setCourses([...courses, newCourse]);
  // };

  // const deleteCourse = (courseId: string) => {
  //   setCourses(courses.filter((course) => course._id !== courseId));
  // };

  // const updateCourse = () => {
  //   setCourses(
  //     courses.map((c) => {
  //       if (c._id === course._id) {
  //         return course;
  //       } else {
  //         return c;
  //       }
  //     })
  //   );
  // };

  return (
    <div id="wd-dashboard" style={{width: "100%"}}>
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h5>
        New Course
        <button
          className="btn btn-primary float-end"
          id="wd-add-new-course-click"
          onClick={() =>
            dispatch(
              addNewCourse({ ...course, _id: uuidv4(), color: randomColor() })
            )
          }
        >
          Add
        </button>
        <button
          className="btn btn-warning float-end me-2"
          onClick={() => dispatch(updateCourse(course))}
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
          {showAllCourses ? "All Courses" : "My Courses"} ({courses.length})
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
          {courses
            .filter((course: CourseType) => 
              showAllCourses || isEnrolled(course._id)
            )
            .map((course: CourseType) => (
              <CourseCard
                key={course._id}
                course={course}
                deleteCourse={currentUser.role === 'FACULTY' ? (event: Event) => {
                  event.preventDefault();
                  dispatch(deleteCourse(course._id));
                } : undefined}
                editCourse={currentUser.role === 'FACULTY' ? (event: Event) => {
                  event.preventDefault();
                  setCourse(course);
                } : undefined}
                isEnrolled={isEnrolled(course._id)}
                onEnrollmentClick={() => handleEnrollment(course._id, isEnrolled(course._id))}
                showAdminControls={currentUser.role === 'FACULTY'}
              />
            ))}
        </Row>
      </div>
    </div>
  );
}
