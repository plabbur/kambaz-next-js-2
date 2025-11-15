import { createSlice } from "@reduxjs/toolkit";
import { enrollments as initialEnrollments } from "../Database";

const initialState = {
  enrollments: initialEnrollments,
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    enroll: (state, action) => {
      const { userId, courseId } = action.payload;
      const newEnrollment = {
        _id: Math.random().toString(36).substr(2, 9),
        user: userId,
        course: courseId,
      };
      state.enrollments.push(newEnrollment);
    },
    unenroll: (state, action) => {
      const { userId, courseId } = action.payload;
      state.enrollments = state.enrollments.filter(
        (enrollment: any) => 
          !(enrollment.user === userId && enrollment.course === courseId)
      );
    },
    setEnrollments: (state, action) => {
      state.enrollments = action.payload;
    },
  },
});
export const { enroll, unenroll, setEnrollments } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
