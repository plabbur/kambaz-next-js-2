"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Card, Table, Button, Badge, Alert } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import * as quizClient from "../../client";
import * as attemptsClient from "../../attemptsClient";

interface Question {
  _id: string;
  type: "TRUE_FALSE" | "MULTIPLE_CHOICE" | "FILL_IN_BLANK";
  title: string;
  points: number;
  question: string;
  choices?: string[];
  correct_answer?: string | boolean;
  possible_answers?: string[];
}

interface Quiz {
  _id: string;
  title: string;
  instructions?: string;
  points: number;
  time_limit: number;
  multiple_attempts: boolean;
  how_many_attempts?: number;
  show_correct_answers: boolean;
  questions?: Question[];
}

interface Attempt {
  _id: string;
  quiz: string;
  user: string;
  attempt_number: number;
  answers: { [key: string]: any };
  score: number;
  submitted_at: string;
}

export default function QuizResults() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);
  const [results, setResults] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        router.push("/Account/Signin");
        return;
      }

      try {
        // Fetch quiz
        const quizzes = await quizClient.findQuizzesForCourse(cid as string);
        const foundQuiz = quizzes.find((q: any) => q._id === qid);
        if (foundQuiz) {
          setQuiz(foundQuiz);
        }

        // Fetch all attempts for this user and quiz
        const userAttempts = await attemptsClient.findAttemptsForUserAndQuiz(
          currentUser._id,
          qid as string
        );
        setAttempts(userAttempts);

        // Select the latest attempt by default
        if (userAttempts.length > 0) {
          const latestAttempt = userAttempts[0]; // Already sorted by attempt_number desc
          setSelectedAttempt(latestAttempt);
          if (foundQuiz) {
            calculateResults(foundQuiz, latestAttempt.answers);
          }
        }
      } catch (error) {
        console.error("Error loading quiz results:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [cid, qid, currentUser, router]);

  const calculateResults = (quizData: Quiz, userAnswers: { [key: string]: any }) => {
    const newResults: { [key: string]: boolean } = {};
    quizData.questions?.forEach((q) => {
      newResults[q._id] = checkAnswer(q, userAnswers[q._id]);
    });
    setResults(newResults);
  };

  const checkAnswer = (question: Question, userAnswer: any): boolean => {
    if (!userAnswer && userAnswer !== false) return false;

    switch (question.type) {
      case "MULTIPLE_CHOICE":
        return userAnswer === question.correct_answer;
      case "TRUE_FALSE":
        return userAnswer === question.correct_answer;
      case "FILL_IN_BLANK":
        if (!question.possible_answers) return false;
        const normalizedAnswer = String(userAnswer).toLowerCase().trim();
        return question.possible_answers.some(
          (ans) => ans.toLowerCase().trim() === normalizedAnswer
        );
      default:
        return false;
    }
  };

  const handleAttemptSelect = (attempt: Attempt) => {
    setSelectedAttempt(attempt);
    if (quiz) {
      calculateResults(quiz, attempt.answers);
    }
  };

  const handleTakeQuiz = () => {
    router.push(`/Courses/${cid}/Quizzes/${qid}/take`);
  };

  const handleBackToQuiz = () => {
    router.push(`/Courses/${cid}/Quizzes/${qid}`);
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!quiz) {
    return <div className="p-4">Quiz not found</div>;
  }

  if (!currentUser) {
    return <div className="p-4">Please sign in to view quiz results.</div>;
  }

  if (attempts.length === 0) {
    return (
      <Container className="p-4">
        <h2>{quiz.title} - Results</h2>
        <Alert variant="info" className="mt-4">
          You have not taken this quiz yet.
        </Alert>
        <Button variant="danger" onClick={handleTakeQuiz}>
          Take Quiz
        </Button>
      </Container>
    );
  }

  const totalPoints = quiz.questions?.reduce((sum, q) => sum + q.points, 0) || 0;
  const percentage =
    selectedAttempt && totalPoints > 0
      ? (selectedAttempt.score / totalPoints) * 100
      : 0;

  // Check if user can take quiz again
  const canRetake =
    quiz.multiple_attempts &&
    (!quiz.how_many_attempts || attempts.length < quiz.how_many_attempts);

  return (
    <Container className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{quiz.title} - Results</h2>
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={handleBackToQuiz}>
            Back to Quiz
          </Button>
          {canRetake && (
            <Button variant="danger" onClick={handleTakeQuiz}>
              Retake Quiz
            </Button>
          )}
        </div>
      </div>

      {/* Attempts Summary */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Quiz Attempts</h5>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Attempt</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Submitted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt) => {
                const attemptPercentage =
                  totalPoints > 0 ? (attempt.score / totalPoints) * 100 : 0;
                return (
                  <tr
                    key={attempt._id}
                    className={selectedAttempt?._id === attempt._id ? "table-active" : ""}
                  >
                    <td>
                      <Badge bg="info">Attempt {attempt.attempt_number}</Badge>
                    </td>
                    <td>
                      {attempt.score} / {totalPoints}
                    </td>
                    <td>
                      <Badge bg={attemptPercentage >= 70 ? "success" : "warning"}>
                        {attemptPercentage.toFixed(1)}%
                      </Badge>
                    </td>
                    <td>{new Date(attempt.submitted_at).toLocaleString()}</td>
                    <td>
                      <Button
                        size="sm"
                        variant={
                          selectedAttempt?._id === attempt._id ? "primary" : "outline-primary"
                        }
                        onClick={() => handleAttemptSelect(attempt)}
                      >
                        {selectedAttempt?._id === attempt._id ? "Viewing" : "View Details"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {quiz.multiple_attempts && quiz.how_many_attempts && (
            <p className="mb-0 text-muted">
              <small>
                You have used {attempts.length} of {quiz.how_many_attempts} allowed attempts.
              </small>
            </p>
          )}
        </Card.Body>
      </Card>

      {/* Selected Attempt Details */}
      {selectedAttempt && (
        <>
          <Alert variant={percentage >= 70 ? "success" : "warning"} className="mb-4">
            <h4>Attempt {selectedAttempt.attempt_number} Results</h4>
            <p className="mb-1">
              <strong>Score:</strong> {selectedAttempt.score} / {totalPoints} points (
              {percentage.toFixed(1)}%)
            </p>
            <p className="mb-0">
              <strong>Submitted:</strong>{" "}
              {new Date(selectedAttempt.submitted_at).toLocaleString()}
            </p>
          </Alert>

          {quiz.questions?.map((question, index) => (
            <Card
              key={question._id}
              className={`mb-4 ${
                results[question._id] ? "border-success" : "border-danger"
              }`}
            >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5>
                    Question {index + 1}{" "}
                    {results[question._id] ? (
                      <FaCheckCircle className="text-success ms-2" />
                    ) : (
                      <FaTimesCircle className="text-danger ms-2" />
                    )}
                  </h5>
                  <Badge bg="secondary">{question.points} pts</Badge>
                </div>

                <p className="mb-3">{question.question}</p>

                {question.type === "MULTIPLE_CHOICE" && (
                  <div>
                    {question.choices?.map((choice, idx) => {
                      const isUserAnswer = selectedAttempt.answers[question._id] === choice;
                      const isCorrectAnswer =
                        quiz.show_correct_answers && choice === question.correct_answer;

                      return (
                        <div
                          key={idx}
                          className={`p-2 mb-2 rounded ${
                            isUserAnswer && results[question._id]
                              ? "bg-success-subtle border border-success"
                              : isUserAnswer && !results[question._id]
                              ? "bg-danger-subtle border border-danger"
                              : isCorrectAnswer
                              ? "bg-success-subtle border border-success"
                              : "bg-light"
                          }`}
                        >
                          <div className="d-flex align-items-center">
                            {isUserAnswer && (
                              <span className="me-2">
                                {results[question._id] ? (
                                  <FaCheckCircle className="text-success" />
                                ) : (
                                  <FaTimesCircle className="text-danger" />
                                )}
                              </span>
                            )}
                            <span>
                              {choice}
                              {isUserAnswer && " (Your Answer)"}
                              {isCorrectAnswer &&
                                !isUserAnswer &&
                                quiz.show_correct_answers &&
                                " (Correct Answer)"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {question.type === "TRUE_FALSE" && (
                  <div>
                    {[true, false].map((value) => {
                      const isUserAnswer = selectedAttempt.answers[question._id] === value;
                      const isCorrectAnswer =
                        quiz.show_correct_answers && value === question.correct_answer;

                      return (
                        <div
                          key={value.toString()}
                          className={`p-2 mb-2 rounded ${
                            isUserAnswer && results[question._id]
                              ? "bg-success-subtle border border-success"
                              : isUserAnswer && !results[question._id]
                              ? "bg-danger-subtle border border-danger"
                              : isCorrectAnswer
                              ? "bg-success-subtle border border-success"
                              : "bg-light"
                          }`}
                        >
                          <div className="d-flex align-items-center">
                            {isUserAnswer && (
                              <span className="me-2">
                                {results[question._id] ? (
                                  <FaCheckCircle className="text-success" />
                                ) : (
                                  <FaTimesCircle className="text-danger" />
                                )}
                              </span>
                            )}
                            <span>
                              {value ? "True" : "False"}
                              {isUserAnswer && " (Your Answer)"}
                              {isCorrectAnswer &&
                                !isUserAnswer &&
                                quiz.show_correct_answers &&
                                " (Correct Answer)"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {question.type === "FILL_IN_BLANK" && (
                  <div>
                    <div
                      className={`p-3 rounded ${
                        results[question._id]
                          ? "bg-success-subtle border border-success"
                          : "bg-danger-subtle border border-danger"
                      }`}
                    >
                      <p className="mb-1">
                        <strong>Your Answer:</strong>{" "}
                        {selectedAttempt.answers[question._id] || "(No answer provided)"}
                      </p>
                      {results[question._id] ? (
                        <p className="mb-0 text-success">
                          <FaCheckCircle className="me-2" />
                          Correct!
                        </p>
                      ) : (
                        <p className="mb-0 text-danger">
                          <FaTimesCircle className="me-2" />
                          Incorrect
                        </p>
                      )}
                    </div>
                    {quiz.show_correct_answers && question.possible_answers && (
                      <div className="mt-2 text-muted">
                        <small>
                          <strong>Acceptable answers:</strong>{" "}
                          {question.possible_answers.join(", ")}
                        </small>
                      </div>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
        </>
      )}
    </Container>
  );
}
