import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });

const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export const findAssignmentsForCourse = async (courseId: string) => {
  const res = await axiosWithCredentials.get(
    `${BASE}/api/courses/${courseId}/assignments`
  );
  return res.data;
};

export const createAssignment = async (assignment: any) => {
  const res = await axiosWithCredentials.post(
    `${BASE}/api/assignments`,
    assignment
  );
  return res.data;
};

export const deleteAssignment = async (aid: string) => {
  const res = await axiosWithCredentials.delete(
    `${BASE}/api/assignments/${aid}`
  );
  return res.status === 200;
};

export const updateAssignment = async (assignment: any) => {
  const res = await axiosWithCredentials.put(
    `${BASE}/api/assignments/${assignment._id}`,
    assignment
  );
  return res.data;
};

export default {
  findAssignmentsForCourse,
  createAssignment,
  deleteAssignment,
  updateAssignment,
};
