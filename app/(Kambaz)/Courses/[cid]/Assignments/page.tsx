"use client";
import Link from "next/link";
import { Button, Form, ListGroup, ListGroupItem, Modal } from "react-bootstrap";
import { BsGripVertical, BsSearch, BsPlus, BsTrash } from "react-icons/bs";
import { MdOutlineAssignment } from "react-icons/md";
import AssignmentTitleControlButtons from "./AssignmentTitleControlButtons";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { deleteAssignment } from "./reducer";
import { ParamValue } from "next/dist/server/request/params";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  course: string;
}

const AssignmentItem = ({
  assignment,
  cid,
  onDelete
}: {
  assignment: Assignment;
  cid: ParamValue;
  onDelete: (id: string) => void;
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
        <Button 
          variant="link" 
          className="text-danger p-0 border-0"
          onClick={() => onDelete(assignment._id)}
        >
          <BsTrash className="fs-4" />
        </Button>
      </div>
    </ListGroupItem>
  );
};

export default function Assignments() {
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const { cid } = useParams();
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);

  const handleDeleteClick = (assignmentId: string) => {
    setAssignmentToDelete(assignmentId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (assignmentToDelete) {
      dispatch(deleteAssignment(assignmentToDelete));
    }
    setShowDeleteModal(false);
    setAssignmentToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setAssignmentToDelete(null);
  };

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
          <Link href={`/Courses/${cid}/Assignments/new`}>
            <Button variant="danger">
              <BsPlus className="fs-4 me-1" />
              Assignment
            </Button>
          </Link>
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
              .filter((assignment: Assignment) => assignment.course === cid)
              .map((assignment: Assignment) => (
                <AssignmentItem
                  key={assignment._id}
                  assignment={assignment}
                  cid={cid}
                  onDelete={handleDeleteClick}
                />
              ))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this assignment?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
