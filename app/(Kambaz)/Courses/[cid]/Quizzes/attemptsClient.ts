import axios from "axios";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";
const QUIZ_ATTEMPTS_API = `${HTTP_SERVER}/api`;

export const findAttemptsForQuiz = async (quizId: string) => {
  const response = await axios.get(`${QUIZ_ATTEMPTS_API}/quizzes/${quizId}/attempts`);
  return response.data;
};

export const findAttemptsForUserAndQuiz = async (userId: string, quizId: string) => {
  const response = await axios.get(`${QUIZ_ATTEMPTS_API}/quizzes/${quizId}/attempts/user/${userId}`);
  return response.data;
};

export const findLatestAttemptForUserAndQuiz = async (userId: string, quizId: string) => {
  const response = await axios.get(`${QUIZ_ATTEMPTS_API}/quizzes/${quizId}/attempts/user/${userId}/latest`);
  return response.data;
};

export const countAttemptsForUserAndQuiz = async (userId: string, quizId: string) => {
  const response = await axios.get(`${QUIZ_ATTEMPTS_API}/quizzes/${quizId}/attempts/user/${userId}/count`);
  return response.data;
};

export const createAttempt = async (quizId: string, attempt: any) => {
  const response = await axios.post(`${QUIZ_ATTEMPTS_API}/quizzes/${quizId}/attempts`, attempt);
  return response.data;
};

export const updateAttempt = async (attemptId: string, updates: any) => {
  const response = await axios.put(`${QUIZ_ATTEMPTS_API}/attempts/${attemptId}`, updates);
  return response.data;
};

export const deleteAttempt = async (attemptId: string) => {
  const response = await axios.delete(`${QUIZ_ATTEMPTS_API}/attempts/${attemptId}`);
  return response.data;
};

export const findAttemptById = async (attemptId: string) => {
  const response = await axios.get(`${QUIZ_ATTEMPTS_API}/attempts/${attemptId}`);
  return response.data;
};
