"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, Nav, Tab } from "react-bootstrap";
import * as client from "../../client";
import { Quiz } from "../../page";

interface Question {
  _id: string;
  type: "TRUE_FALSE" | "MULTIPLE_CHOICE" | "FILL_IN_BLANK";
  title: string;
  points: number;
  question: string;
  choices?: string[];
  correct_answer?: string | boolean;
  possible_answers?: string[];
  isEditing?: boolean;
}

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();

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

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (qid && qid !== "new") {
        try {
          const quizzes = await client.findQuizzesForCourse(cid as string);
          const existingQuiz = quizzes.find((q: any) => q._id === qid);
          if (existingQuiz) {
            setQuiz(existingQuiz);
            // Load questions if they exist
            if (existingQuiz.questions && Array.isArray(existingQuiz.questions)) {
              setQuestions(existingQuiz.questions);
            }
          }
        } catch (e) {
          console.error("Failed to load quiz", e);
        }
      }
      setLoading(false);
    };
    fetchQuiz();
  }, [qid, cid]);

  const handleChange = (field: string, value: any) => {
    setQuiz({ ...quiz, [field]: value });
  };

  const handleSave = async () => {
    try {
      const quizWithQuestions = {
        ...quiz,
        questions: questions,
        points: calculateTotalPoints(),
      };
      if (qid === "new" || !quiz._id) {
        const created = await client.createQuiz(quizWithQuestions);
        router.push(`/Courses/${cid}/Quizzes/${created._id}`);
      } else {
        await client.updateQuiz(quizWithQuestions);
        router.push(`/Courses/${cid}/Quizzes/${qid}`);
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };

  const handleSaveAndPublish = async () => {
    try {
      const publishedQuiz = {
        ...quiz,
        questions: questions,
        points: calculateTotalPoints(),
        published: true,
      };
      if (qid === "new" || !quiz._id) {
        await client.createQuiz(publishedQuiz);
      } else {
        await client.updateQuiz(publishedQuiz);
      }
      router.push(`/Courses/${cid}/Quizzes`);
    } catch (error) {
      console.error("Error saving and publishing quiz:", error);
    }
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Quizzes`);
  };

  // Question handlers
  const addNewQuestion = () => {
    const newQuestion: Question = {
      _id: `q${Date.now()}`,
      type: "MULTIPLE_CHOICE",
      title: `Question ${questions.length + 1}`,
      points: 1,
      question: "",
      choices: [""],
      correct_answer: "",
      possible_answers: [""],
      isEditing: true,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(
      questions.map((q) => (q._id === id ? { ...q, [field]: value } : q))
    );
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q._id !== id));
  };

  const toggleEditMode = (id: string) => {
    setQuestions(
      questions.map((q) =>
        q._id === id ? { ...q, isEditing: !q.isEditing } : q
      )
    );
  };

  const addChoice = (questionId: string) => {
    const question = questions.find((q) => q._id === questionId);
    if (question) {
      const newChoices = [...(question.choices || []), ""];
      updateQuestion(questionId, "choices", newChoices);
    }
  };

  const removeChoice = (questionId: string, index: number) => {
    const question = questions.find((q) => q._id === questionId);
    if (question && question.choices && question.choices.length > 1) {
      const newChoices = question.choices.filter((_, i) => i !== index);
      updateQuestion(questionId, "choices", newChoices);
    }
  };

  const updateChoice = (questionId: string, index: number, value: string) => {
    const question = questions.find((q) => q._id === questionId);
    if (question && question.choices) {
      const newChoices = [...question.choices];
      newChoices[index] = value;
      updateQuestion(questionId, "choices", newChoices);
    }
  };

  const addPossibleAnswer = (questionId: string) => {
    const question = questions.find((q) => q._id === questionId);
    if (question) {
      const newAnswers = [...(question.possible_answers || []), ""];
      updateQuestion(questionId, "possible_answers", newAnswers);
    }
  };

  const removePossibleAnswer = (questionId: string, index: number) => {
    const question = questions.find((q) => q._id === questionId);
    if (
      question &&
      question.possible_answers &&
      question.possible_answers.length > 1
    ) {
      const newAnswers = question.possible_answers.filter(
        (_, i) => i !== index
      );
      updateQuestion(questionId, "possible_answers", newAnswers);
    }
  };

  const updatePossibleAnswer = (
    questionId: string,
    index: number,
    value: string
  ) => {
    const question = questions.find((q) => q._id === questionId);
    if (question && question.possible_answers) {
      const newAnswers = [...question.possible_answers];
      newAnswers[index] = value;
      updateQuestion(questionId, "possible_answers", newAnswers);
    }
  };

  const calculateTotalPoints = () => {
    return questions.reduce((sum, q) => sum + q.points, 0);
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <Container className="p-4">
      <h3>Points: {calculateTotalPoints()}</h3>
      <p className="text-muted">
        {quiz.published ? "Published" : "Not Published"}
      </p>

      <Tab.Container defaultActiveKey="details">
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="details">Details</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="questions">Questions</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="details">
            <Form>
              {/* Title */}
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={quiz.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </Form.Group>

              {/* Quiz Instructions */}
              <Form.Group className="mb-3">
                <Form.Label>Quiz Instructions:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={quiz.instructions || ""}
                  onChange={(e) => handleChange("instructions", e.target.value)}
                  placeholder="Enter quiz instructions here..."
                />
              </Form.Group>

              {/* Quiz Type */}
              <Form.Group className="mb-3">
                <Form.Label>Quiz Type</Form.Label>
                <Form.Select
                  value={quiz.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                >
                  <option value="GRADED_QUIZ">Graded Quiz</option>
                  <option value="PRACTICE_QUIZ">Practice Quiz</option>
                  <option value="GRADED_SURVEY">Graded Survey</option>
                  <option value="UNGRADED_SURVEY">Ungraded Survey</option>
                </Form.Select>
              </Form.Group>

              {/* Assignment Group */}
              <Form.Group className="mb-3">
                <Form.Label>Assignment Group</Form.Label>
                <Form.Select
                  value={quiz.assignment_ground}
                  onChange={(e) =>
                    handleChange("assignment_ground", e.target.value)
                  }
                >
                  <option value="QUIZZES">Quizzes</option>
                  <option value="EXAMS">Exams</option>
                  <option value="ASSIGNMENTS">Assignments</option>
                  <option value="PROJECT">Project</option>
                </Form.Select>
              </Form.Group>

              <h5 className="mt-4">Options</h5>

              {/* Shuffle Answers */}
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Shuffle Answers"
                  checked={quiz.shuffle_answers}
                  onChange={(e) =>
                    handleChange("shuffle_answers", e.target.checked)
                  }
                />
              </Form.Group>

              {/* Time Limit */}
              <Row className="mb-3">
                <Col md={2}>
                  <Form.Check
                    type="checkbox"
                    label="Time Limit"
                    checked={quiz.time_limit > 0}
                    onChange={(e) =>
                      handleChange("time_limit", e.target.checked ? 20 : 0)
                    }
                  />
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="number"
                    value={quiz.time_limit}
                    onChange={(e) =>
                      handleChange("time_limit", parseInt(e.target.value) || 0)
                    }
                    disabled={quiz.time_limit === 0}
                  />
                </Col>
                <Col md={2}>
                  <span>Minutes</span>
                </Col>
              </Row>

              {/* Multiple Attempts */}
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Allow Multiple Attempts"
                  checked={quiz.multiple_attempts}
                  onChange={(e) =>
                    handleChange("multiple_attempts", e.target.checked)
                  }
                />
              </Form.Group>

              {/* How Many Attempts */}
              {quiz.multiple_attempts && (
                <Form.Group className="mb-3">
                  <Form.Label>How Many Attempts</Form.Label>
                  <Form.Control
                    type="number"
                    value={quiz.how_many_attempts || 1}
                    onChange={(e) =>
                      handleChange(
                        "how_many_attempts",
                        parseInt(e.target.value) || 1
                      )
                    }
                  />
                </Form.Group>
              )}

              {/* Show Correct Answers */}
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Show Correct Answers"
                  checked={quiz.show_correct_answers}
                  onChange={(e) =>
                    handleChange("show_correct_answers", e.target.checked)
                  }
                />
              </Form.Group>

              {/* Access Code */}
              <Form.Group className="mb-3">
                <Form.Label>Access Code</Form.Label>
                <Form.Control
                  type="text"
                  value={quiz.access_code}
                  onChange={(e) => handleChange("access_code", e.target.value)}
                  placeholder="Optional access code"
                />
              </Form.Group>

              {/* One Question at a Time */}
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="One Question at a Time"
                  checked={quiz.one_question_at_a_time}
                  onChange={(e) =>
                    handleChange("one_question_at_a_time", e.target.checked)
                  }
                />
              </Form.Group>

              {/* Webcam Required */}
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Webcam Required"
                  checked={false}
                  disabled
                />
              </Form.Group>

              {/* Lock Questions After Answering */}
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Lock Questions After Answering"
                  checked={quiz.lock_questions_after_answering}
                  onChange={(e) =>
                    handleChange(
                      "lock_questions_after_answering",
                      e.target.checked
                    )
                  }
                />
              </Form.Group>

              <h5 className="mt-4">Assign</h5>

              {/* Assign to */}
              <Form.Group className="mb-3">
                <Form.Label>Assign to</Form.Label>
                <div className="border p-2 bg-light">
                  <span className="badge bg-secondary me-2">Everyone ×</span>
                </div>
              </Form.Group>

              {/* Due Date */}
              <Form.Group className="mb-3">
                <Form.Label>Due</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={quiz.due_date ? quiz.due_date.slice(0, 16) : ""}
                  onChange={(e) => handleChange("due_date", e.target.value)}
                />
              </Form.Group>

              {/* Available from / Until */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Available from</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={
                        quiz.available_date
                          ? quiz.available_date.slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        handleChange("available_date", e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Until</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={
                        quiz.until_date ? quiz.until_date.slice(0, 16) : ""
                      }
                      onChange={(e) =>
                        handleChange("until_date", e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleSaveAndPublish}>
                  Save & Publish
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  Save
                </Button>
              </div>
            </Form>
          </Tab.Pane>

          <Tab.Pane eventKey="questions">
            <div className="text-center mb-4">
              <Button variant="secondary" onClick={addNewQuestion}>
                + New Question
              </Button>
            </div>

            <hr />

            {questions.length === 0 ? (
              <div className="text-center p-5 text-muted">
                <p>No questions yet. Click "New Question" to add one.</p>
              </div>
            ) : (
              questions.map((question, index) => (
                <div key={question._id} className="border p-3 mb-3">
                  {question.isEditing ? (
                    // Edit mode
                    <div>
                      <Row className="mb-3">
                        <Col md={8}>
                          <Form.Group>
                            <Form.Label>Question Title</Form.Label>
                            <Form.Control
                              type="text"
                              value={question.title}
                              onChange={(e) =>
                                updateQuestion(
                                  question._id,
                                  "title",
                                  e.target.value
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>Question Type</Form.Label>
                            <Form.Select
                              value={question.type}
                              onChange={(e) =>
                                updateQuestion(
                                  question._id,
                                  "type",
                                  e.target.value
                                )
                              }
                            >
                              <option value="MULTIPLE_CHOICE">
                                Multiple Choice
                              </option>
                              <option value="TRUE_FALSE">True/False</option>
                              <option value="FILL_IN_BLANK">
                                Fill in the Blank
                              </option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Points</Form.Label>
                        <Form.Control
                          type="number"
                          value={question.points}
                          onChange={(e) =>
                            updateQuestion(
                              question._id,
                              "points",
                              parseInt(e.target.value) || 0
                            )
                          }
                          style={{ width: "100px" }}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Question</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={question.question}
                          onChange={(e) =>
                            updateQuestion(
                              question._id,
                              "question",
                              e.target.value
                            )
                          }
                          placeholder="Enter your question here"
                        />
                      </Form.Group>

                      {/* Multiple Choice Options */}
                      {question.type === "MULTIPLE_CHOICE" && (
                        <div>
                          <Form.Label className="fw-bold">Choices</Form.Label>
                          <p className="text-muted small">
                            Enter your choices below. Select the radio button
                            next to the correct answer.
                          </p>
                          {question.choices?.map((choice, i) => (
                            <div
                              key={i}
                              className="d-flex mb-2 align-items-center gap-2"
                            >
                              <Form.Check
                                type="radio"
                                name={`correct-${question._id}`}
                                checked={question.correct_answer === choice}
                                onChange={() =>
                                  updateQuestion(
                                    question._id,
                                    "correct_answer",
                                    choice
                                  )
                                }
                                title="Mark as correct answer"
                              />
                              <Form.Control
                                as="textarea"
                                rows={2}
                                value={choice}
                                onChange={(e) =>
                                  updateChoice(question._id, i, e.target.value)
                                }
                                placeholder={`Choice ${i + 1}`}
                              />
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removeChoice(question._id, i)}
                                disabled={(question.choices?.length || 0) <= 1}
                              >
                                ✕
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => addChoice(question._id)}
                          >
                            + Add Another Answer
                          </Button>
                        </div>
                      )}

                      {/* True/False Options */}
                      {question.type === "TRUE_FALSE" && (
                        <Form.Group>
                          <Form.Label className="fw-bold">
                            Correct Answer
                          </Form.Label>
                          <div>
                            <Form.Check
                              type="radio"
                              label="True"
                              name={`tf-${question._id}`}
                              checked={question.correct_answer === true}
                              onChange={() =>
                                updateQuestion(
                                  question._id,
                                  "correct_answer",
                                  true
                                )
                              }
                            />
                            <Form.Check
                              type="radio"
                              label="False"
                              name={`tf-${question._id}`}
                              checked={question.correct_answer === false}
                              onChange={() =>
                                updateQuestion(
                                  question._id,
                                  "correct_answer",
                                  false
                                )
                              }
                            />
                          </div>
                        </Form.Group>
                      )}

                      {/* Fill in Blank */}
                      {question.type === "FILL_IN_BLANK" && (
                        <div>
                          <Form.Label className="fw-bold">
                            Possible Answers
                          </Form.Label>
                          <p className="text-muted small">
                            Students must match one of these answers (case
                            insensitive).
                          </p>
                          {question.possible_answers?.map((answer, i) => (
                            <div
                              key={i}
                              className="d-flex mb-2 align-items-center gap-2"
                            >
                              <Form.Control
                                type="text"
                                value={answer}
                                onChange={(e) =>
                                  updatePossibleAnswer(
                                    question._id,
                                    i,
                                    e.target.value
                                  )
                                }
                                placeholder={`Answer ${i + 1}`}
                              />
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() =>
                                  removePossibleAnswer(question._id, i)
                                }
                                disabled={
                                  (question.possible_answers?.length || 0) <= 1
                                }
                              >
                                ✕
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => addPossibleAnswer(question._id)}
                          >
                            + Add Another Answer
                          </Button>
                        </div>
                      )}

                      <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                        <Button
                          variant="outline-secondary"
                          onClick={() => deleteQuestion(question._id)}
                        >
                          Delete Question
                        </Button>
                        <div className="d-flex gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => toggleEditMode(question._id)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => toggleEditMode(question._id)}
                          >
                            Update Question
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Preview mode
                    <div>
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h5>
                            {index + 1}. {question.title}
                          </h5>
                          <p className="text-muted">
                            {question.type === "MULTIPLE_CHOICE" &&
                              "Multiple Choice"}
                            {question.type === "TRUE_FALSE" && "True/False"}
                            {question.type === "FILL_IN_BLANK" &&
                              "Fill in the Blank"}{" "}
                            | {question.points} pts
                          </p>
                          <p>{question.question}</p>

                          {question.type === "MULTIPLE_CHOICE" &&
                            question.choices?.map((choice, i) => (
                              <div key={i} className="ms-3">
                                {question.correct_answer === choice
                                  ? "✓ "
                                  : "○ "}
                                {choice}
                              </div>
                            ))}

                          {question.type === "TRUE_FALSE" && (
                            <div className="ms-3">
                              <div>
                                {question.correct_answer === true ? "✓" : "○"}{" "}
                                True
                              </div>
                              <div>
                                {question.correct_answer === false ? "✓" : "○"}{" "}
                                False
                              </div>
                            </div>
                          )}

                          {question.type === "FILL_IN_BLANK" && (
                            <div className="ms-3 text-muted">
                              <p className="mb-1 fw-bold">Possible Answers:</p>
                              {question.possible_answers?.map((answer, i) => (
                                <div key={i}>• {answer}</div>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="link"
                          onClick={() => toggleEditMode(question._id)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}

            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleSave}>
                Save
              </Button>
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}
