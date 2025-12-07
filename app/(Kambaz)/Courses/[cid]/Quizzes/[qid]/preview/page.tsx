"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Container, Button, Form, Card, Alert } from "react-bootstrap";
import * as client from "../../client";

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
  questions?: Question[];
}

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizzes = await client.findQuizzesForCourse(cid as string);
        const foundQuiz = quizzes.find((q: any) => q._id === qid);
        if (foundQuiz) {
          setQuiz(foundQuiz);
        }
      } catch (error) {
        console.error("Error loading quiz:", error);
      }
      setLoading(false);
    };
    fetchQuiz();
  }, [cid, qid]);

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const checkAnswer = (question: Question, userAnswer: any): boolean => {
    if (!userAnswer) return false;

    switch (question.type) {
      case "MULTIPLE_CHOICE":
        return userAnswer === question.correct_answer;

      case "TRUE_FALSE":
        return userAnswer === question.correct_answer;

      case "FILL_IN_BLANK":
        if (!question.possible_answers) return false;
        const userAnswerLower = String(userAnswer).toLowerCase().trim();
        return question.possible_answers.some(
          (ans) => ans.toLowerCase().trim() === userAnswerLower
        );

      default:
        return false;
    }
  };

  const handleSubmit = () => {
    if (!quiz || !quiz.questions) return;

    let totalScore = 0;
    const questionResults: { [key: string]: boolean } = {};

    quiz.questions.forEach((question) => {
      const isCorrect = checkAnswer(question, answers[question._id]);
      questionResults[question._id] = isCorrect;
      if (isCorrect) {
        totalScore += question.points;
      }
    });

    setScore(totalScore);
    setResults(questionResults);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRetake = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setResults({});
    setCurrentQuestionIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextQuestion = () => {
    if (quiz?.questions && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleEditQuiz = () => {
    router.push(`/Courses/${cid}/Quizzes/${qid}/edit`);
  };

  if (loading) {
    return <Container className="p-4">Loading quiz...</Container>;
  }

  if (!quiz) {
    return <Container className="p-4">Quiz not found.</Container>;
  }

  const totalPoints =
    quiz.questions?.reduce((sum, q) => sum + q.points, 0) || 0;
  const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;

  const currentQuestion = quiz.questions?.[currentQuestionIndex];
  const totalQuestions = quiz.questions?.length || 0;

  return (
    <Container className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{quiz.title}</h2>
        <Button variant="secondary" onClick={handleEditQuiz}>
          Edit Quiz
        </Button>
      </div>

      {submitted && (
        <Alert
          variant={percentage >= 70 ? "success" : "warning"}
          className="mb-4"
        >
          <h4>Quiz Results</h4>
          <p className="mb-1">
            <strong>Score:</strong> {score} / {totalPoints} points (
            {percentage.toFixed(1)}%)
          </p>
          <Button variant="primary" size="sm" onClick={handleRetake}>
            Retake Quiz
          </Button>
        </Alert>
      )}

      {quiz.instructions && !submitted && (
        <Alert variant="info" className="mb-4">
          <strong>Instructions:</strong>
          <p className="mb-0 mt-2">{quiz.instructions}</p>
        </Alert>
      )}

      {!submitted && (
        <Alert variant="secondary" className="mb-4">
          <strong>Quiz Information:</strong>
          <p className="mb-0">
            This is a preview. Your answers will not be saved.
          </p>
          {quiz.time_limit > 0 && (
            <p className="mb-0">Time Limit: {quiz.time_limit} minutes</p>
          )}
        </Alert>
      )}

      {!quiz.questions || quiz.questions.length === 0 ? (
        <Alert variant="warning">
          This quiz has no questions yet. Click &quot;Edit Quiz&quot; to add
          questions.
        </Alert>
      ) : (
        <>
          {!submitted && currentQuestion && (
            <>
              <div className="mb-3 text-muted">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </div>
              <Card className="mb-4">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5>Question {currentQuestionIndex + 1}</h5>
                    <span className="badge bg-secondary">
                      {currentQuestion.points} pts
                    </span>
                  </div>

                  <p className="fw-bold">{currentQuestion.question}</p>

                  {/* Multiple Choice */}
                  {currentQuestion.type === "MULTIPLE_CHOICE" &&
                    currentQuestion.choices && (
                      <div>
                        {currentQuestion.choices.map((choice, i) => {
                          const isSelected =
                            answers[currentQuestion._id] === choice;

                          return (
                            <div key={i} className="mb-2 p-2 rounded">
                              <Form.Check
                                type="radio"
                                id={`${currentQuestion._id}-choice-${i}`}
                                name={`question-${currentQuestion._id}`}
                                label={choice}
                                checked={isSelected}
                                onChange={() =>
                                  handleAnswerChange(
                                    currentQuestion._id,
                                    choice
                                  )
                                }
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}

                  {/* True/False */}
                  {currentQuestion.type === "TRUE_FALSE" && (
                    <div>
                      {[true, false].map((value) => {
                        const isSelected =
                          answers[currentQuestion._id] === value;

                        return (
                          <div key={String(value)} className="mb-2 p-2 rounded">
                            <Form.Check
                              type="radio"
                              id={`${currentQuestion._id}-${value}`}
                              name={`question-${currentQuestion._id}`}
                              label={value ? "True" : "False"}
                              checked={isSelected}
                              onChange={() =>
                                handleAnswerChange(currentQuestion._id, value)
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Fill in Blank */}
                  {currentQuestion.type === "FILL_IN_BLANK" && (
                    <div>
                      <Form.Control
                        type="text"
                        value={answers[currentQuestion._id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(
                            currentQuestion._id,
                            e.target.value
                          )
                        }
                        placeholder="Enter your answer"
                      />
                    </div>
                  )}
                </Card.Body>
              </Card>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <Button
                  variant="secondary"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous Question
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === totalQuestions - 1}
                >
                  Next Question
                </Button>
              </div>
            </>
          )}

          {submitted &&
            quiz.questions.map((question, index) => (
              <Card
                key={question._id}
                className={`mb-3 ${
                  submitted
                    ? results[question._id]
                      ? "border-success"
                      : "border-danger"
                    : ""
                }`}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5>
                      Question {index + 1}
                      {submitted && (
                        <span className="ms-2">
                          {results[question._id] ? (
                            <span className="text-success">✓ Correct</span>
                          ) : (
                            <span className="text-danger">✗ Incorrect</span>
                          )}
                        </span>
                      )}
                    </h5>
                    <span className="badge bg-secondary">
                      {question.points} pts
                    </span>
                  </div>

                  <p className="fw-bold">{question.question}</p>

                  {/* Multiple Choice */}
                  {question.type === "MULTIPLE_CHOICE" && question.choices && (
                    <div>
                      {question.choices.map((choice, i) => {
                        const isSelected = answers[question._id] === choice;
                        const isCorrect = choice === question.correct_answer;

                        return (
                          <div
                            key={i}
                            className={`mb-2 p-2 rounded ${
                              submitted
                                ? isCorrect
                                  ? "bg-success bg-opacity-10"
                                  : isSelected
                                  ? "bg-danger bg-opacity-10"
                                  : ""
                                : ""
                            }`}
                          >
                            <Form.Check
                              type="radio"
                              id={`${question._id}-choice-${i}`}
                              name={`question-${question._id}`}
                              label={
                                <span>
                                  {choice}
                                  {submitted && isCorrect && (
                                    <span className="text-success ms-2">
                                      ✓ Correct Answer
                                    </span>
                                  )}
                                </span>
                              }
                              checked={isSelected}
                              onChange={() =>
                                !submitted &&
                                handleAnswerChange(question._id, choice)
                              }
                              disabled={submitted}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* True/False */}
                  {question.type === "TRUE_FALSE" && (
                    <div>
                      {[true, false].map((value) => {
                        const isSelected = answers[question._id] === value;
                        const isCorrect = value === question.correct_answer;

                        return (
                          <div
                            key={String(value)}
                            className={`mb-2 p-2 rounded ${
                              submitted
                                ? isCorrect
                                  ? "bg-success bg-opacity-10"
                                  : isSelected
                                  ? "bg-danger bg-opacity-10"
                                  : ""
                                : ""
                            }`}
                          >
                            <Form.Check
                              type="radio"
                              id={`${question._id}-${value}`}
                              name={`question-${question._id}`}
                              label={
                                <span>
                                  {value ? "True" : "False"}
                                  {submitted && isCorrect && (
                                    <span className="text-success ms-2">
                                      ✓ Correct Answer
                                    </span>
                                  )}
                                </span>
                              }
                              checked={isSelected}
                              onChange={() =>
                                !submitted &&
                                handleAnswerChange(question._id, value)
                              }
                              disabled={submitted}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Fill in Blank */}
                  {question.type === "FILL_IN_BLANK" && (
                    <div>
                      <Form.Control
                        type="text"
                        value={answers[question._id] || ""}
                        onChange={(e) =>
                          !submitted &&
                          handleAnswerChange(question._id, e.target.value)
                        }
                        placeholder="Enter your answer"
                        disabled={submitted}
                        className={
                          submitted
                            ? results[question._id]
                              ? "border-success"
                              : "border-danger"
                            : ""
                        }
                      />
                      {submitted && (
                        <div className="mt-2">
                          <small className="text-muted">
                            <strong>Acceptable answers:</strong>{" "}
                            {question.possible_answers?.join(", ")}
                          </small>
                          {answers[question._id] && (
                            <div className="mt-1">
                              <small>
                                <strong>Your answer:</strong>{" "}
                                {answers[question._id]}
                              </small>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}

          {!submitted && (
            <div className="d-flex justify-content-center gap-2 mt-4 pt-4 border-top">
              <Button variant="secondary" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleSubmit}>
                Submit Quiz
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
