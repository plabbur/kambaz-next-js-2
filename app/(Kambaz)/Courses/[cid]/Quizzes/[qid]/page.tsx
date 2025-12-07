"use client";

import { Form, Row, Col, Button, Container } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import * as client from "../client";
import * as attemptsClient from "../attemptsClient";
import { Quiz } from "../page";

export default function QuizDetailsPage() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [quiz, setQuiz] = useState<Quiz>({
    _id: "",
    cid: cid as string,
    title: "New Quiz",
    instructions: "",
    type: "GRADED_QUIZ",
    points: 100,
    assignment_ground: "QUIZZES",
    shuffle_answers: true,
    time_limit: 20,
    multiple_attempts: false,
    show_correct_answers: false,
    access_code: "",
    one_question_at_a_time: true,
    lock_questions_after_answering: false,
    due_date: "",
    available_date: "",
    until_date: "",
    questions: [],
    published: false,
  });

  const [loading, setLoading] = useState(true);
  const [attemptCount, setAttemptCount] = useState(0);
  const [canRetake, setCanRetake] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (qid && qid !== "new") {
        try {
          const quizzes = await client.findQuizzesForCourse(cid as string);
          const existingQuiz = quizzes.find((q: any) => q._id === qid);
          if (existingQuiz) {
            setQuiz(existingQuiz);

            // Fetch attempt count for students
            if (currentUser && currentUser.role === "STUDENT") {
              try {
                const countData =
                  await attemptsClient.countAttemptsForUserAndQuiz(
                    currentUser._id,
                    qid as string
                  );
                setAttemptCount(countData.count);

                // Determine if student can retake
                if (countData.count > 0) {
                  if (existingQuiz.multiple_attempts) {
                    // Check if they haven't exhausted attempts
                    if (
                      !existingQuiz.how_many_attempts ||
                      countData.count < existingQuiz.how_many_attempts
                    ) {
                      setCanRetake(true);
                    }
                  }
                }
              } catch (e) {
                console.error("Failed to load attempts", e);
              }
            }
          }
        } catch (e) {
          console.error("Failed to load quiz", e);
        }
      }
      setLoading(false);
    };
    fetchQuiz();
  }, [qid, cid, currentUser]);

  const formatQuizType = (type: string) => {
    switch (type) {
      case "GRADED_QUIZ":
        return "Graded Quiz";
      case "PRACTICE_QUIZ":
        return "Practice Quiz";
      case "GRADED_SURVEY":
        return "Graded Survey";
      case "UNGRADED_SURVEY":
        return "Ungraded Survey";
      default:
        return type;
    }
  };

  const formatAssignmentGroup = (group: string) => {
    return group.charAt(0) + group.slice(1).toLowerCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatShowCorrectAnswers = () => {
    if (quiz.show_correct_answers) {
      return "Immediately";
    }
    return "Never";
  };

  const handlePreview = () => {
    router.push(`/Courses/${cid}/Quizzes/${qid}/preview`);
  };

  const handleEdit = () => {
    router.push(`/Courses/${cid}/Quizzes/${qid}/edit`);
  };

  const handleTakeQuiz = () => {
    router.push(`/Courses/${cid}/Quizzes/${qid}/take`);
  };

  const handleViewResults = () => {
    router.push(`/Courses/${cid}/Quizzes/${qid}/results`);
  };

  const isFaculty =
    currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";
  const isStudent = currentUser?.role === "STUDENT";

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <Container className="p-4">
      <div className="">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">{quiz.title}</h2>
          <div className="d-flex gap-2">
            {isFaculty ? (
              <>
                <Button variant="secondary" onClick={handlePreview}>
                  Preview
                </Button>
                <Button variant="secondary" onClick={handleEdit}>
                  Edit
                </Button>
              </>
            ) : isStudent ? (
              <>
                {attemptCount > 0 && (
                  <Button variant="secondary" onClick={handleViewResults}>
                    View Quiz Results
                  </Button>
                )}
                {attemptCount === 0 ? (
                  <Button variant="danger" onClick={handleTakeQuiz}>
                    Take Quiz
                  </Button>
                ) : canRetake ? (
                  <Button variant="danger" onClick={handleTakeQuiz}>
                    Retake Quiz
                  </Button>
                ) : null}
              </>
            ) : null}
          </div>
        </div>

        <Row className="mb-2">
          <Col md={6} className="text-end fw-bold">
            Quiz Type
          </Col>
          <Col md={6}>{formatQuizType(quiz.type)}</Col>
        </Row>

        <Row className="mb-2">
          <Col md={6} className="text-end fw-bold">
            Points
          </Col>
          <Col md={6}>{quiz.points}</Col>
        </Row>

        <Row className="mb-2">
          <Col md={6} className="text-end fw-bold">
            Assignment Group
          </Col>
          <Col md={6}>{formatAssignmentGroup(quiz.assignment_ground)}</Col>
        </Row>

        <Row className="mb-2">
          <Col md={6} className="text-end fw-bold">
            Shuffle Answers
          </Col>
          <Col md={6}>{quiz.shuffle_answers ? "Yes" : "No"}</Col>
        </Row>

        <Row className="mb-2">
          <Col md={6} className="text-end fw-bold">
            Time Limit
          </Col>
          <Col md={6}>{quiz.time_limit} Minutes</Col>
        </Row>

        <Row className="mb-2">
          <Col md={6} className="text-end fw-bold">
            Multiple Attempts
          </Col>
          <Col md={6}>{quiz.multiple_attempts ? "Yes" : "No"}</Col>
        </Row>

        {quiz.multiple_attempts && quiz.how_many_attempts && (
          <Row className="mb-2">
            <Col md={6} className="text-end fw-bold">
              How Many Attempts
            </Col>
            <Col md={6}>{quiz.how_many_attempts}</Col>
          </Row>
        )}

        <Row className="mb-2">
          <Col md={6} className="text-end fw-bold">
            View Responses
          </Col>
          <Col md={6}>Always</Col>
        </Row>

        <Row className="mb-2">
          <Col md={6} className="text-end fw-bold">
            Show Correct Answers
          </Col>
          <Col md={6}>{formatShowCorrectAnswers()}</Col>
        </Row>

        <Row className="mb-2">
          <Col md={6} className="text-end fw-bold">
            One Question at a Time
          </Col>
          <Col md={6}>{quiz.one_question_at_a_time ? "Yes" : "No"}</Col>
        </Row>

        <Row className="mb-2">
          <Col md={6} className="text-end fw-bold">
            Require Respondus LockDown Browser
          </Col>
          <Col md={6}>No</Col>
        </Row>

        <Row className="mb-2">
          <Col md={6} className="text-end fw-bold">
            Required to View Quiz Results
          </Col>
          <Col md={6}>No</Col>
        </Row>

        <Row className="mb-2">
          <Col md={6} className="text-end fw-bold">
            Webcam Required
          </Col>
          <Col md={6}>No</Col>
        </Row>

        <Row className="mb-2">
          <Col md={6} className="text-end fw-bold">
            Lock Questions After Answering
          </Col>
          <Col md={6}>{quiz.lock_questions_after_answering ? "Yes" : "No"}</Col>
        </Row>

        <hr className="my-4" />

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Due</th>
              <th>For</th>
              <th>Available from</th>
              <th>Until</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{formatDate(quiz.due_date)}</td>
              <td>Everyone</td>
              <td>{formatDate(quiz.available_date)}</td>
              <td>{formatDate(quiz.until_date)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Container>
  );
}
