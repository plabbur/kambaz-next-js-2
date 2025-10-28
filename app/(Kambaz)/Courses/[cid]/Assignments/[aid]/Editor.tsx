"use client";

import { Form, Row, Col, Button } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { addAssignment, updateAssignment } from "../reducer";

interface Assignment {
  _id?: string;
  title: string;
  description: string;
  points: number;
  course: string;
  dueDate: string;
  availableDate: string;
  availableUntilDate: string;
}

export default function AssignmentEditor() {
  const { aid, cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  
  // Get existing assignment if we're editing
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const existingAssignment = assignments.find((a: any) => a._id === aid);
  
  const [assignment, setAssignment] = useState(
    existingAssignment || {
      title: "",
      description: "",
      points: 100,
      course: cid,
      dueDate: "",
      availableDate: "",
      availableUntilDate: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setAssignment((prev: Assignment) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSave = () => {
    // Ensure we have at least a title
    if (!assignment.title.trim()) {
      alert("Please enter an assignment name");
      return;
    }

    // Prepare the assignment data
    const assignmentData = {
      ...assignment,
      course: cid,
      points: Number(assignment.points) || 100,
    };

    if (aid && aid !== 'new') {
      // Update existing assignment
      console.log("Updating assignment:", assignmentData);
      dispatch(updateAssignment(assignmentData));
    } else {
      // Create new assignment
      console.log("Creating new assignment:", assignmentData);
      dispatch(addAssignment(assignmentData));
    }

    router.push(`/Courses/${cid}/Assignments`);
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Assignments`);
  };

  return (
    <div id="wd-assignments-editor" className="d-flex">
      <Form className="flex-fill">
        <div className="mb-3">
          <Form.Label>Assignment Name</Form.Label>
          <Form.Control
            id="title"
            type="text"
            placeholder={assignment.title ? assignment.title : "Assignment Name"}
            value={assignment.title}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            id="description"
            as="textarea"
            placeholder="Assignment description"
            value={assignment.description}
            onChange={handleChange}
          />
        </div>

        <Row className="mb-3">
          <Form.Label column sm={4}>
            Points
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              id="points"
              type="number"
              placeholder="100"
              value={assignment.points}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={4}>
            Assignment Group
          </Form.Label>
          <Col sm={8}>
            <Form.Select defaultValue="ASSIGNMENTS">
              <option value="ASSIGNMENTS">ASSIGNMENTS</option>
              <option value="QUIZZES">QUIZZES</option>
              <option value="EXAMS">EXAMS</option>
              <option value="PROJECT">PROJECT</option>
            </Form.Select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={4}>
            Display grade as
          </Form.Label>
          <Col sm={8}>
            <Form.Select defaultValue="Percentage">
              <option value="Percentage">Percentage</option>
              <option value="Letter">Letter</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Submission Type Section */}
        <Row className="mb-3">
          <Form.Label column sm={4}>
            Submission Type
          </Form.Label>
          <Col sm={8}>
            <div className="border p-2 rounded-2">
              <Form.Select className="mb-3" defaultValue="ONLINE">
                <option value="ONLINE">Online</option>
                <option value="IN_PERSON">In person</option>
              </Form.Select>

              <Form.Label className="fw-bold">Online Entry Options</Form.Label>
              <div>
                <Form.Check
                  type="checkbox"
                  id="wd-text-entry"
                  label="Text Entry"
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="wd-website-url"
                  label="Website URL"
                  defaultChecked
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="wd-media-recordings"
                  label="Media Recordings"
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="wd-student-annotation"
                  label="Student Annotation"
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="wd-file-upload"
                  label="File Uploads"
                  className="mb-2"
                />
              </div>
            </div>
          </Col>
        </Row>

        {/* Assignments Section */}
        <Row className="mb-3">
          <Form.Label column sm={4}>
            Assignments
          </Form.Label>
          <Col sm={8}>
            <div className="border p-2 rounded-2">
              {/* Assign To Section */}
              <div className="mb-3">
                <Form.Label className="fw-bold">Assign to</Form.Label>
                <div className="border rounded p-2">
                  <span className="bg-secondary me-2 mb-1 d-inline-flex align-items-center rounded-1 p-2">
                    Everyone
                    <button
                      type="button"
                      className="btn-close ms-2"
                      style={{ fontSize: "14px" }}
                    ></button>
                  </span>
                </div>
              </div>

              {/* Due Date Section */}
              <div className="mb-3">
                <Form.Label>Due</Form.Label>
                <Form.Control
                  id="dueDate"
                  type="date"
                  value={assignment.dueDate}
                  onChange={handleChange}
                />
              </div>

              {/* Available Dates Section */}
              <Row className="mb-3">
                <Col sm={6}>
                  <Form.Label>Available from</Form.Label>
                  <Form.Control
                    id="availableDate"
                    type="date"
                    value={assignment.availableDate}
                    onChange={handleChange}
                  />
                </Col>
                <Col sm={6}>
                  <Form.Label>Available until</Form.Label>
                  <Form.Control
                    id="availableUntilDate"
                    type="date"
                    value={assignment.availableUntilDate}
                    onChange={handleChange}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Col className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSave}>
            Save
          </Button>
        </Col>
      </Form>
    </div>
  );
}
