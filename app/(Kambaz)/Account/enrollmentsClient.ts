// import axios from "axios";

// const BASE = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";
// const axiosConfig = { withCredentials: true };

// export const findEnrollmentsForUser = async (userId: string) => {
//   const res = await axios.get(`${BASE}/api/enrollments/user/${userId}`, axiosConfig);
//   return res.data;
// };

// export const findEnrollmentsForCourse = async (courseId: string) => {
//   const res = await axios.get(`${BASE}/api/courses/${courseId}/enrollments`, axiosConfig);
//   return res.data;
// };

// export const enroll = async (userId: string, courseId: string) => {
//   const res = await axios.post(`${BASE}/api/enrollments`, { userId, courseId }, axiosConfig);
//   return res.status === 200;
// };

// export const unenroll = async (userId: string, courseId: string) => {
//   const res = await axios.delete(`${BASE}/api/enrollments`, {
//     data: { userId, courseId },
//     withCredentials: true
//   });
//   return res.status === 200;
// };

// export default { findEnrollmentsForUser, findEnrollmentsForCourse, enroll, unenroll };

import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";
const axiosConfig = { withCredentials: true };

export const findEnrollmentsForUser = async (userId: string) => {
  console.log("Finding enrollments for user:", userId);
  const res = await axios.get(
    `${BASE}/api/enrollments/user/${userId}`,
    axiosConfig
  );
  console.log("Found enrollments:", res.data);
  return res.data;
};

export const findEnrollmentsForCourse = async (courseId: string) => {
  const res = await axios.get(
    `${BASE}/api/courses/${courseId}/enrollments`,
    axiosConfig
  );
  return res.data;
};

export const enroll = async (userId: string, courseId: string) => {
  console.log("Enrolling user:", userId, "in course:", courseId);
  const res = await axios.post(
    `${BASE}/api/enrollments`,
    { userId, courseId },
    axiosConfig
  );
  console.log("Enroll response status:", res.status);
  console.log("Enroll response data:", res.data);
  const success = res.status === 201 || res.status === 200;
  console.log("Enroll success:", success);
  return success;
};

export const unenroll = async (userId: string, courseId: string) => {
  const res = await axios.delete(`${BASE}/api/enrollments`, {
    data: { userId, courseId },
    withCredentials: true,
  });
  return res.status === 200;
};

export default {
  findEnrollmentsForUser,
  findEnrollmentsForCourse,
  enroll,
  unenroll,
};
