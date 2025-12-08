"use client";
import { ParamValue } from "next/dist/server/request/params";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Form,
  ListGroup,
  ListGroupItem,
  Dropdown,
} from "react-bootstrap";
import { BsGripVertical, BsPlus, BsSearch } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { MdOutlineAssignment } from "react-icons/md";
import { FaBan, FaCheckCircle } from "react-icons/fa";
import * as client from "./client";

export interface Quiz {
  _id: string;
  cid: string;
  title: string;
  instructions?: string;
  type: "GRADED_QUIZ" | "PRACTICE_QUIZ" | "GRADED_SURVEY" | "UNGRADED_SURVEY";
  points: number;
  assignment_ground: "QUIZZES" | "EXAMS" | "ASSIGNMENTS" | "PROJECT";
  shuffle_answers: boolean;
  time_limit: number;
  multiple_attempts: boolean;
  how_many_attempts?: number;
  show_correct_answers: boolean;
  access_code: string;
  one_question_at_a_time: boolean;
  lock_questions_after_answering: boolean;
  due_date: string;
  available_date: string;
  until_date: string;
  questions?: any[];
  published?: boolean;
}

const getQuizAvailability = (
  quiz: Quiz
): { status: string; isClosed: boolean } => {
  const currentDate = new Date();
  const availableDate = new Date(quiz.available_date);
  const untilDate = new Date(quiz.until_date);

  if (currentDate < availableDate) {
    return {
      status: `Not available until ${availableDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`,
      isClosed: false,
    };
  } else if (currentDate >= availableDate && currentDate <= untilDate) {
    return { status: "Available", isClosed: false };
  } else {
    return { status: "Closed", isClosed: true };
  }
};

const QuizItem = ({
  quiz,
  cid,
  handleEdit,
  handleDelete,
  handlePublish,
  onPublishToggle,
  isFaculty,
}: {
  quiz: Quiz;
  cid: ParamValue;
  handleEdit: () => void;
  handleDelete: () => void;
  handlePublish: () => void;
  onPublishToggle: (id: string) => void;
  isFaculty: boolean;
}) => {
  const { status: availabilityStatus, isClosed } = getQuizAvailability(quiz);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <ListGroupItem className="p-3 ps-1 border-start-0 border-end-0">
      <div className="d-flex align-items-start justify-content-between">
        <div className="d-flex align-items-start flex-grow-1">
          <BsGripVertical className="me-2 fs-3 text-muted" />
          <MdOutlineAssignment className="me-3 fs-3 text-success" />
          <div className="flex-grow-1">
            <Link
              href={`/Courses/${cid}/Quizzes/${quiz._id}`}
              className="text-decoration-none text-dark fw-bold"
            >
              {quiz.title}
            </Link>
            <div className="text-muted small">
              <span className="fw-bold">{availabilityStatus}</span>
              {" | "}
              <span>Due {formatDate(quiz.due_date)}</span>
              {" | "}
              <span>{quiz.points} pts</span>
              {" | "}
              <span>{quiz.questions?.length || 0} Questions</span>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          {isClosed && <span className="text-success fs-4">✓</span>}

          {isFaculty && (
            <>
              {/* Published/Unpublished Icon */}
              <Button
                variant="link"
                className="p-0 border-0"
                onClick={() => onPublishToggle(quiz._id)}
              >
                {quiz.published ? (
                  <FaCheckCircle className="text-success fs-5" />
                ) : (
                  <FaBan className="text-muted fs-5" />
                )}
              </Button>

              {/* Context Menu */}
              <Dropdown>
                <Dropdown.Toggle
                  variant="link"
                  className="text-muted p-0 border-0"
                  id={`dropdown-${quiz._id}`}
                >
                  <IoEllipsisVertical className="fs-4" />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleEdit}>Edit</Dropdown.Item>
                  <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
                  <Dropdown.Item onClick={handlePublish}>
                    {quiz.published ? "Unpublish" : "Publish"}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          )}
        </div>
      </div>
    </ListGroupItem>
  );
};

export default function Quizzes() {
  const { cid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const isFaculty =
    currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";
  useEffect(() => {
    if (cid) {
      client.findQuizzesForCourse(cid as string).then((data) => {
        // Sort quizzes by available date (earliest to latest)
        const sortedQuizzes = data.sort((a: Quiz, b: Quiz) => {
          const dateA = new Date(a.available_date).getTime();
          const dateB = new Date(b.available_date).getTime();
          return dateA - dateB;
        });
        setQuizzes(sortedQuizzes);
      });
    }
  }, [cid]);

  const handleEdit = (quizId: string) => {
    router.push(`/Courses/${cid}/Quizzes/${quizId}`);
  };

  const handleDelete = async (quizId: string) => {
    try {
      await client.deleteQuiz(quizId);
      setQuizzes(quizzes.filter((q) => q._id !== quizId));
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const handlePublish = async (quizId: string) => {
    const quiz = quizzes.find((q) => q._id === quizId);
    if (quiz) {
      const updatedQuiz = { ...quiz, published: !quiz.published };
      await client.updateQuiz(updatedQuiz);
      setQuizzes(quizzes.map((q) => (q._id === quizId ? updatedQuiz : q)));
    }
  };

  const handlePublishToggle = async (quizId: string) => {
    const quiz = quizzes.find((q) => q._id === quizId);
    if (quiz) {
      const updatedQuiz = { ...quiz, published: !quiz.published };
      await client.updateQuiz(updatedQuiz);
      setQuizzes(quizzes.map((q) => (q._id === quizId ? updatedQuiz : q)));
    }
  };

  const handleAddQuiz = async () => {
    const currentDate = new Date();
    const oneWeekLater = new Date(currentDate);
    oneWeekLater.setDate(currentDate.getDate() + 7);

    const newQuiz = {
      cid: cid as string,
      title: "New Quiz",
      type: "GRADED_QUIZ" as const,
      points: 100,
      assignment_ground: "QUIZZES" as const,
      shuffle_answers: true,
      time_limit: 20,
      multiple_attempts: false,
      show_correct_answers: false,
      access_code: "",
      one_question_at_a_time: true,
      lock_questions_after_answering: false,
      due_date: oneWeekLater.toISOString(),
      available_date: currentDate.toISOString(),
      until_date: oneWeekLater.toISOString(),
      questions: [],
      published: false,
    };

    try {
      const createdQuiz = await client.createQuiz(newQuiz);
      router.push(`/Courses/${cid}/Quizzes/${createdQuiz._id}/edit`);
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  return (
    <div className="w-full p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="position-relative" style={{ width: "300px" }}>
          <BsSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
          <Form.Control
            type="text"
            placeholder="Search for Quiz"
            className="ps-5"
          />
        </div>
        <div>
          {isFaculty && (
            <>
              <Button variant="danger" onClick={handleAddQuiz}>
                <BsPlus className="fs-4 me-1" />
                Quiz
              </Button>
              <Button className="p-2 bg-secondary border-0 text-dark">
                <IoEllipsisVertical className="fs-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      <ListGroup className="rounded-0">
        <ListGroupItem className="p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" />
            Quizzes
          </div>
          <div style={{ display: quizzes.length > 0 ? "none" : "block" }}>
            Add a quiz
          </div>
          <ListGroup className="wd-assignment-list rounded-0">
            {quizzes.map((quiz: Quiz) => (
              <QuizItem
                key={quiz._id}
                quiz={quiz}
                cid={cid}
                handleEdit={() => handleEdit(quiz._id)}
                handleDelete={() => handleDelete(quiz._id)}
                handlePublish={() => handlePublish(quiz._id)}
                onPublishToggle={handlePublishToggle}
                isFaculty={isFaculty}
              />
            ))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
