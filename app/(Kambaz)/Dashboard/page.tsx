import Link from "next/link";
import Image from "next/image";
import { CardText, Card, CardBody, CardImg, CardTitle, Col, Row, Button } from "react-bootstrap";
export default function Dashboard() {
    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
            <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
            <div id="wd-dashboard-courses">
                <Row xs={1} md={5} className="g-4">
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/1234/Home"
                                className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg variant="top" src="/images/reactjs.jpg" width="100%" height={160} />
                                <CardBody>
                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1234 React JS</CardTitle>
                                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                        Full Stack software developer</CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/1234/Home"
                                className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg variant="top" src="/images/nodejs.png" width="100%" height={160} />
                                <CardBody>
                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS5678 Node JS</CardTitle>
                                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                        Backend Development with Node
                                    </CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/1234/Home"
                                className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg variant="top" src="/images/python.png" width="100%" height={160} />
                                <CardBody>
                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS9101 Python</CardTitle>
                                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                        Programming Fundamentals
                                    </CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/1234/Home"
                                className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg variant="top" src="/images/java.svg" width="100%" height={160} />
                                <CardBody>
                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1121 Java</CardTitle>
                                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                        Object-Oriented Programming
                                    </CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/1234/Home"
                                className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg variant="top" src="/images/htmlcss.webp" width="100%" height={160} />
                                <CardBody>
                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS3141 Web Dev</CardTitle>
                                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                        HTML, CSS & Responsive Design
                                    </CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/1234/Home"
                                className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg variant="top" src="/images/database.png" width="100%" height={160} />
                                <CardBody>
                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS5161 Databases</CardTitle>
                                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                        SQL & Data Management
                                    </CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                        <Card>
                            <Link href="/Courses/1234/Home"
                                className="wd-dashboard-course-link text-decoration-none text-dark">
                                <CardImg variant="top" src="/images/machinelearning.jpg" width="100%" height={160} />
                                <CardBody>
                                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS7181 Machine Learning</CardTitle>
                                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                                        AI & Predictive Models
                                    </CardText>
                                    <Button variant="primary">Go</Button>
                                </CardBody>
                            </Link>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
