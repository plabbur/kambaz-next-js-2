import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";
const axiosConfig = { withCredentials: true };

export const findEnrollmentsForUser = async (userId: string) => {
  const res = await axios.get(`${BASE}/api/enrollments/user/${userId}`, axiosConfig);
  return res.data;
};

export const findEnrollmentsForCourse = async (courseId: string) => {
  const res = await axios.get(`${BASE}/api/courses/${courseId}/enrollments`, axiosConfig);
  return res.data;
};

export const enroll = async (userId: string, courseId: string) => {
  const res = await axios.post(`${BASE}/api/enrollments`, { userId, courseId }, axiosConfig);
  return res.status === 200;
};

export const unenroll = async (userId: string, courseId: string) => {
  const res = await axios.delete(`${BASE}/api/enrollments`, { 
    data: { userId, courseId },
    withCredentials: true 
  });
  return res.status === 200;
};

export default { findEnrollmentsForUser, findEnrollmentsForCourse, enroll, unenroll };
