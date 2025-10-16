"use client";
import Link from "next/link";
import { Button, Form, ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical, BsSearch, BsPlus } from "react-icons/bs";
import LessonControlButtons from "../Modules/LessonControlButtons";
import { MdOutlineAssignment } from "react-icons/md";
import AssignmentTitleControlButtons from "./AssignmentTitleControlButtons";
import * as db from "../../../Database";
import { useParams } from "next/navigation";
import { ParamValue } from "next/dist/server/request/params";

const AssignmentItem = ({
  assignment,
  cid,
}: {
  assignment: AssignmentType;
  cid: ParamValue;
}) => {
  return (
    <ListGroupItem className="wd-lesson p-3 ps-1">
      <div className="d-flex align-items-center">
        <BsGripVertical className="me-2 fs-3" />
        <MdOutlineAssignment className="me-2 fs-3" />
        <div className="flex-fill">
          <Link
            href={`/Courses/${cid}/Assignments/${assignment._id}`}
            className="wd-assignment-details text-decoration-none text-black"
          >
            <div>
              {assignment.title}
              <br />
              <span className="text-muted small">{assignment.description}</span>
            </div>
          </Link>
        </div>
        <LessonControlButtons />
      </div>
    </ListGroupItem>
  );
};

export default function Assignments() {
  const assignments = db.assignments;
  const { cid } = useParams();

  return (
    <div id="wd-assignments" className="p-4">
      {/* Top Control Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="position-relative" style={{ width: "300px" }}>
          <BsSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
          <Form.Control
            type="text"
            placeholder="Search for Assignment"
            className="ps-5"
          />
        </div>
        <div>
          <Button variant="secondary" className="me-2">
            <BsPlus className="fs-4 me-1" />
            Group
          </Button>
          <Button variant="danger">
            <BsPlus className="fs-4 me-1" />
            Assignment
          </Button>
        </div>
      </div>

      <ListGroup className="rounded-0">
        <ListGroupItem className="p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" />
            Assignments
            <AssignmentTitleControlButtons />
          </div>
          <ListGroup className="wd-assignment-list rounded-0">
            {assignments
              .filter((assignment, course) => assignment.course === cid)
              .map((assignment) => {
                return (
                  <AssignmentItem
                    key={assignment._id}
                    assignment={assignment}
                    cid={cid}
                  />
                );
              })}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
