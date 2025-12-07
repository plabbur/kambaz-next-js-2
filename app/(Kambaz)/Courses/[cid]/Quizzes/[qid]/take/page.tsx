"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Button, Form, Card, Alert, Badge } from "react-bootstrap";
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

export default function TakeQuiz() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [attemptCount, setAttemptCount] = useState(0);
  const [latestAttempt, setLatestAttempt] = useState<Attempt | null>(null);
  const [canTakeQuiz, setCanTakeQuiz] = useState(true);
  const [viewingResults, setViewingResults] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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

        // Fetch attempt count
        const countData = await attemptsClient.countAttemptsForUserAndQuiz(
          currentUser._id,
          qid as string
        );
        setAttemptCount(countData.count);

        // Fetch latest attempt
        const attempt = await attemptsClient.findLatestAttemptForUserAndQuiz(
          currentUser._id,
          qid as string
        );

        if (attempt) {
          setLatestAttempt(attempt);
          // Check if can take quiz again
          // Case 1: Multiple attempts is disabled and student already took the quiz
          if (!foundQuiz.multiple_attempts && countData.count >= 1) {
            setCanTakeQuiz(false);
            setViewingResults(true);
            setSubmitted(true);
            setAnswers(attempt.answers);
            setScore(attempt.score);
            calculateResults(foundQuiz, attempt.answers);
          }
          // Case 2: Multiple attempts is enabled but limit is reached
          else if (
            foundQuiz.multiple_attempts &&
            foundQuiz.how_many_attempts &&
            countData.count >= foundQuiz.how_many_attempts
          ) {
            setCanTakeQuiz(false);
            setViewingResults(true);
            setSubmitted(true);
            setAnswers(attempt.answers);
            setScore(attempt.score);
            calculateResults(foundQuiz, attempt.answers);
          }
        }
      } catch (error) {
        console.error("Error loading quiz:", error);
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

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
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

  const calculateScore = () => {
    let totalScore = 0;
    const newResults: { [key: string]: boolean } = {};

    quiz?.questions?.forEach((question) => {
      const isCorrect = checkAnswer(question, answers[question._id]);
      newResults[question._id] = isCorrect;
      if (isCorrect) {
        totalScore += question.points;
      }
    });

    setResults(newResults);
    setScore(totalScore);
    return totalScore;
  };

  const handleSubmit = async () => {
    if (!quiz || !currentUser) return;

    const finalScore = calculateScore();
    setSubmitted(true);

    try {
      // Save attempt to database
      const attempt = {
        user: currentUser._id,
        attempt_number: attemptCount + 1,
        answers: answers,
        score: finalScore,
        submitted_at: new Date().toISOString(),
      };

      await attemptsClient.createAttempt(qid as string, attempt);
      setAttemptCount(attemptCount + 1);
      setViewingResults(true);

      // Check if attempts exhausted after submission
      // Case 1: Multiple attempts is disabled - no more attempts allowed
      if (!quiz.multiple_attempts) {
        setCanTakeQuiz(false);
      }
      // Case 2: Multiple attempts enabled but limit reached
      else if (
        quiz.multiple_attempts &&
        quiz.how_many_attempts &&
        attemptCount + 1 >= quiz.how_many_attempts
      ) {
        setCanTakeQuiz(false);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleRetake = () => {
    if (!quiz) return;

    if (!quiz.multiple_attempts) {
      alert("Multiple attempts are not allowed for this quiz.");
      return;
    }

    if (quiz.how_many_attempts && attemptCount >= quiz.how_many_attempts) {
      alert(`You have exhausted all ${quiz.how_many_attempts} attempts.`);
      return;
    }

    setAnswers({});
    setSubmitted(false);
    setResults({});
    setScore(0);
    setViewingResults(false);
    setCurrentQuestionIndex(0);
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

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!quiz) {
    return <div className="p-4">Quiz not found</div>;
  }

  if (!currentUser) {
    return <div className="p-4">Please sign in to take this quiz.</div>;
  }

  const totalPoints = quiz.questions?.reduce((sum, q) => sum + q.points, 0) || 0;
  const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;

  const currentQuestion = quiz.questions?.[currentQuestionIndex];
  const totalQuestions = quiz.questions?.length || 0;

  return (
    <Container className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{quiz.title}</h2>
          {attemptCount > 0 && (
            <Badge bg="info">
              Attempt {viewingResults ? attemptCount : attemptCount + 1}
              {quiz.how_many_attempts && ` of ${quiz.how_many_attempts}`}
            </Badge>
          )}
        </div>
      </div>

      {quiz.instructions && (
        <Alert variant="info" className="mb-4">
          <strong>Instructions:</strong> {quiz.instructions}
        </Alert>
      )}

      {viewingResults && submitted && (
        <Alert variant={percentage >= 70 ? "success" : "warning"} className="mb-4">
          <h4>Quiz Results</h4>
          <p className="mb-1">
            <strong>Score:</strong> {score} / {totalPoints} points ({percentage.toFixed(1)}%)
          </p>
          <p className="mb-1">
            <strong>Submitted:</strong>{" "}
            {latestAttempt
              ? new Date(latestAttempt.submitted_at).toLocaleString()
              : new Date().toLocaleString()}
          </p>
          <div className="d-flex gap-2 mt-3">
            <Button
              variant="secondary"
              onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/results`)}
            >
              View All Attempts
            </Button>
            {canTakeQuiz && quiz.multiple_attempts && (
              <Button variant="primary" onClick={handleRetake}>
                Take Quiz Again
              </Button>
            )}
          </div>
          {!canTakeQuiz && (
            <p className="mb-0 mt-2">
              <strong>
                {!quiz.multiple_attempts
                  ? "Multiple attempts are not allowed for this quiz."
                  : "You have used all available attempts for this quiz."}
              </strong>
            </p>
          )}
        </Alert>
      )}

      {!viewingResults && currentQuestion && (
        <>
          <div className="mb-3 text-muted">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
          <Card
            className="mb-4"
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5>Question {currentQuestionIndex + 1}</h5>
                <Badge bg="secondary">{currentQuestion.points} pts</Badge>
              </div>

              <p className="mb-3">{currentQuestion.question}</p>

              {currentQuestion.type === "MULTIPLE_CHOICE" && (
                <div>
                  {currentQuestion.choices?.map((choice, idx) => (
                    <Form.Check
                      key={idx}
                      type="radio"
                      id={`q-${currentQuestion._id}-choice-${idx}`}
                      label={choice}
                      name={`question-${currentQuestion._id}`}
                      value={choice}
                      checked={answers[currentQuestion._id] === choice}
                      onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                    />
                  ))}
                </div>
              )}

              {currentQuestion.type === "TRUE_FALSE" && (
                <div>
                  <Form.Check
                    type="radio"
                    id={`q-${currentQuestion._id}-true`}
                    label="True"
                    name={`question-${currentQuestion._id}`}
                    value="true"
                    checked={answers[currentQuestion._id] === true}
                    onChange={() => handleAnswerChange(currentQuestion._id, true)}
                  />
                  <Form.Check
                    type="radio"
                    id={`q-${currentQuestion._id}-false`}
                    label="False"
                    name={`question-${currentQuestion._id}`}
                    value="false"
                    checked={answers[currentQuestion._id] === false}
                    onChange={() => handleAnswerChange(currentQuestion._id, false)}
                  />
                </div>
              )}

              {currentQuestion.type === "FILL_IN_BLANK" && (
                <div>
                  <Form.Control
                    type="text"
                    placeholder="Type your answer here"
                    value={answers[currentQuestion._id] || ""}
                    onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
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

      {viewingResults && quiz.questions?.map((question, index) => (
        <Card
          key={question._id}
          className={`mb-4 ${
            submitted && results[question._id]
              ? "border-success"
              : submitted && !results[question._id]
              ? "border-danger"
              : ""
          }`}
        >
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h5>
                Question {index + 1}{" "}
                {submitted && (
                  <>
                    {results[question._id] ? (
                      <FaCheckCircle className="text-success ms-2" />
                    ) : (
                      <FaTimesCircle className="text-danger ms-2" />
                    )}
                  </>
                )}
              </h5>
              <Badge bg="secondary">{question.points} pts</Badge>
            </div>

            <p className="mb-3">{question.question}</p>

            {question.type === "MULTIPLE_CHOICE" && (
              <div>
                {question.choices?.map((choice, idx) => (
                  <Form.Check
                    key={idx}
                    type="radio"
                    id={`q-${question._id}-choice-${idx}`}
                    label={choice}
                    name={`question-${question._id}`}
                    value={choice}
                    checked={answers[question._id] === choice}
                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                    disabled={viewingResults}
                    className={
                      submitted && quiz.show_correct_answers
                        ? choice === question.correct_answer
                          ? "text-success fw-bold"
                          : ""
                        : ""
                    }
                  />
                ))}
              </div>
            )}

            {question.type === "TRUE_FALSE" && (
              <div>
                <Form.Check
                  type="radio"
                  id={`q-${question._id}-true`}
                  label="True"
                  name={`question-${question._id}`}
                  value="true"
                  checked={answers[question._id] === true}
                  onChange={() => handleAnswerChange(question._id, true)}
                  disabled={viewingResults}
                  className={
                    submitted && quiz.show_correct_answers && question.correct_answer === true
                      ? "text-success fw-bold"
                      : ""
                  }
                />
                <Form.Check
                  type="radio"
                  id={`q-${question._id}-false`}
                  label="False"
                  name={`question-${question._id}`}
                  value="false"
                  checked={answers[question._id] === false}
                  onChange={() => handleAnswerChange(question._id, false)}
                  disabled={viewingResults}
                  className={
                    submitted && quiz.show_correct_answers && question.correct_answer === false
                      ? "text-success fw-bold"
                      : ""
                  }
                />
              </div>
            )}

            {question.type === "FILL_IN_BLANK" && (
              <div>
                <Form.Control
                  type="text"
                  placeholder="Type your answer here"
                  value={answers[question._id] || ""}
                  onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                  disabled={viewingResults}
                />
                {submitted && quiz.show_correct_answers && question.possible_answers && (
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

      {!viewingResults && (
        <div className="d-flex justify-content-center gap-2 mt-4 pt-4 border-top">
          <Button
            variant="secondary"
            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSubmit}>
            Submit Quiz
          </Button>
        </div>
      )}

      {viewingResults && (
        <div className="d-flex justify-content-end">
          <Button
            variant="secondary"
            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}
          >
            Back to Quiz Details
          </Button>
        </div>
      )}
    </Container>
  );
}
