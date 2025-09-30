import { Form, Row, Col } from "react-bootstrap";

export default function AssignmentEditor() {
    return (
        <div id="wd-assignments-editor" className="d-flex">
            <Form className="flex-fill">
                <div className="mb-3">
                    <Form.Label id="wd-name">Assignment Name</Form.Label>
                    <Form.Control type="text" placeholder="Assignment Name" defaultValue="A1 - ENV + HTML" />
                </div>
                <div className="mb-3">
                    <Form.Control id="wd-description" as="textarea" placeholder="Assignment description" defaultValue="The assignment is available online Submit a link to the landing page of" />
                </div>

                <Row className="mb-3">
                    <Form.Label column sm={4}>Points</Form.Label>
                    <Col sm={8}>
                        <Form.Control type="text" placeholder="000" defaultValue="100" />
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Form.Label column sm={4}>Assignment Group</Form.Label>
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
                    <Form.Label column sm={4}>Display grade as</Form.Label>
                    <Col sm={8}>
                        <Form.Select defaultValue="Percentage">
                            <option value="Percentage">Percentage</option>
                            <option value="Letter">Letter</option>
                        </Form.Select>
                    </Col>
                </Row>

                {/* Submission Type Section */}
                <Row className="mb-3">
                    <Form.Label column sm={4}>Submission Type</Form.Label>
                    <Col sm={8}>
                        <div className="border p-2 rounded-2">
                            <Form.Select className="mb-3" defaultValue="ONLINE">
                                <option value="ONLINE">Online</option>
                                <option value="IN_PERSON">In person</option>
                            </Form.Select>

                            <Form.Label className="fw-bold">Online Entry Options</Form.Label>
                            <div>
                                <Form.Check type="checkbox" id="wd-text-entry" label="Text Entry" className="mb-2" />
                                <Form.Check type="checkbox" id="wd-website-url" label="Website URL" defaultChecked className="mb-2" />
                                <Form.Check type="checkbox" id="wd-media-recordings" label="Media Recordings" className="mb-2" />
                                <Form.Check type="checkbox" id="wd-student-annotation" label="Student Annotation" className="mb-2" />
                                <Form.Check type="checkbox" id="wd-file-upload" label="File Uploads" className="mb-2" />
                            </div>
                        </div>
                    </Col>
                </Row>



                {/* Assignments Section */}
                <Row className="mb-3">
                    <Form.Label column sm={4}>Assignments</Form.Label>
                    <Col sm={8}>
                        <div className="border p-2 rounded-2">
                            {/* Assign To Section */}
                            <div className="mb-3">
                                <Form.Label className="fw-bold">Assign to</Form.Label>
                                <div className="border rounded p-2">
                                    <span className="bg-secondary me-2 mb-1 d-inline-flex align-items-center rounded-1 p-2">
                                        Everyone
                                        <button type="button" className="btn-close ms-2" style={{ fontSize: "14px" }}></button>
                                    </span>
                                </div>
                            </div>

                            {/* Due Date Section */}
                            <div className="mb-3">
                                <Form.Label>Due</Form.Label>
                                <Form.Control id="wd-due-date" type="date" />
                            </div>

                            {/* Available Dates Section */}
                            <Row className="mb-3">
                                <Col sm={6}>
                                    <Form.Label>Available from</Form.Label>
                                    <Form.Control id="wd-available-from" type="date" />
                                </Col>
                                <Col sm={6}>
                                    <Form.Label>Available until</Form.Label>
                                    <Form.Control id="wd-available-until" type="date" />
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>


            </Form>
        </div>
    );
}