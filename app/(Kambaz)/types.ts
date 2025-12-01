interface AssignmentType {
  _id: string;
  title: string;
  description: string;
  points: number;
  course: string;
  dueDate?: string;
  availableDate?: string;
  availableUntilDate?: string;
}

interface CourseType {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  department: string;
  credits: number;
  description: string;
  image?: string;
  color?: string;
}

interface LessonType {
  _id: string;
  name: string;
  description: string;
  module: string;
}

interface ModuleType {
  _id: string;
  name: string;
  description: string;
  course: string;
  lessons: LessonType[];
}

interface UserType {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  role: string;
  loginId: string;
  section: string;
  lastActivity: string;
  totalActivity: string;
}
