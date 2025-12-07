import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER =
  process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;

export const findQuizzesForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/quizzes`);
  return data;
};

export const createQuiz = async (quiz: any) => {
  const payload = { ...quiz, cid: quiz.cid?.toString() };
  const { data } = await axios.post(QUIZZES_API, payload);
  return data;
};

export const deleteQuiz = async (qid: string) => {
  try {
    console.log("DELETE request to:", `${QUIZZES_API}/${qid}`);
    const response = await axios.delete(`${QUIZZES_API}/${qid}`);
    console.log("DELETE response status:", response.status);
    console.log("DELETE response data:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "DELETE error:",
      error.response?.status,
      error.response?.data
    );
    throw error;
  }
};

export const updateQuiz = async (quiz: any) => {
  const payload = { ...quiz, cid: quiz.cid?.toString() };
  const { data } = await axios.put(`${QUIZZES_API}/${quiz._id}`, payload);
  return data;
};

export default {
  findQuizzesForCourse,
  createQuiz,
  deleteQuiz,
  updateQuiz,
};
