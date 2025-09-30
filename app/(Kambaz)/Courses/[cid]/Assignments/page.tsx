import Link from "next/link";
import { Button, Form, ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical, BsSearch, BsPlus } from "react-icons/bs";
import LessonControlButtons from "../Modules/LessonControlButtons";
import { MdOutlineAssignment } from "react-icons/md";
import AssignmentTitleControlButtons from "./AssignmentTitleControlButtons";

const assignments = [
    {
        cid: "1234",
        aid: "123",
        name: "A1 - ENV + HTML",
        description: "Multiple Modules | Not available until May 6 at 12:00am | Due May 13 at 11:59pm | 100 points",
        points: 100
    },
    {
        cid: "1234",
        aid: "124",
        name: "A2 - CSS + BOOTSTRAP",
        description: "Multiple Modules | Not available until May 13 at 12:00am | Due May 20 at 11:59pm | 100 points",
        points: 100
    },
    {
        cid: "1234",
        aid: "125",
        name: "A3 - JAVASCRIPT + REACT",
        description: "Multiple Modules | Not available until May 20 at 12:00am | Due May 27 at 11:59pm | 100 points",
        points: 100
    }
]

const AssignmentItem = ({ assignment }: { assignment: typeof assignments[0] }) => {
    return (
        <ListGroupItem className="wd-lesson p-3 ps-1">
            <div className="d-flex align-items-center">
                <BsGripVertical className="me-2 fs-3" />
                <MdOutlineAssignment className="me-2 fs-3" />
                <div className="flex-fill">
                    <Link href={`/Courses/${assignment.cid}/Assignments/${assignment.aid}`} className="wd-assignment-details text-decoration-none text-black">
                        <div>
                            {assignment.name}
                            <br />
                            <span className="text-muted small">{assignment.description}</span>
                        </div>
                    </Link>
                </div>
                <LessonControlButtons />
            </div>
        </ListGroupItem>
    )
}

export default function Assignments() {
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
                        {assignments.map((assignment) => {
                            return (
                                <AssignmentItem key={assignment.aid} assignment={assignment} />
                            )
                        })}
                    </ListGroup>
                </ListGroupItem>
            </ListGroup>
        </div>
    );
}
