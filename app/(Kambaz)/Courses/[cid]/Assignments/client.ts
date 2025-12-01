
import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const ASSIGNMENTS_API = `${HTTP_SERVER}/api/assignments`;

export const findAssignmentsForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/assignments`);
  return data;
};

export const createAssignment = async (assignment: any) => {
  const payload = { ...assignment, course: assignment.course?.toString() };
  const { data } = await axios.post(ASSIGNMENTS_API, payload);
  return data;
};

export const deleteAssignment = async (aid: string) => {
  try {
    console.log('DELETE request to:', `${ASSIGNMENTS_API}/${aid}`);
    const response = await axios.delete(`${ASSIGNMENTS_API}/${aid}`);
    console.log('DELETE response status:', response.status);
    console.log('DELETE response data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('DELETE error:', error.response?.status, error.response?.data);
    throw error;
  }
};

export const updateAssignment = async (assignment: any) => {
  const payload = { ...assignment, course: assignment.course?.toString() };
  const { data } = await axios.put(
    `${ASSIGNMENTS_API}/${assignment._id}`,
    payload
  );
  return data;
};

export default {
  findAssignmentsForCourse,
  createAssignment,
  deleteAssignment,
  updateAssignment,
};
