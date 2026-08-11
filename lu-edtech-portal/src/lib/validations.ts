import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  universityId: z.string().min(1, "University is required"),
  courseId: z.string().min(1, "Course is required"),
  semesterId: z.string().min(1, "Semester is required"),
  curriculumId: z.string().min(1, "Curriculum is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const universitySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  location: z.string().optional(),
});

export const courseSchema = z.object({
  name: z.string().min(2),
  universityId: z.string().min(1),
  code: z.string().optional(),
  duration: z.number().optional(),
});

export const curriculumSchema = z.object({
  name: z.string().min(2),
  courseId: z.string().min(1),
  sessionYear: z.string().min(4),
});

export const semesterSchema = z.object({
  name: z.string().min(2),
  number: z.number().min(1).max(12),
  curriculumId: z.string().min(1),
});

export const subjectSchema = z.object({
  name: z.string().min(2),
  semesterId: z.string().min(1),
  code: z.string().optional(),
  credits: z.number().optional(),
});

export const unitSchema = z.object({
  name: z.string().min(2),
  number: z.number().min(1),
  subjectId: z.string().min(1),
  description: z.string().optional(),
});

export const topicSchema = z.object({
  name: z.string().min(2),
  unitId: z.string().min(1),
  description: z.string().optional(),
});

export const batchSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  courseId: z.string().min(1),
  semesterId: z.string().min(1),
  curriculumId: z.string().min(1),
  facultyId: z.string().optional(),
  description: z.string().optional(),
  externalUrl: z.string().url().optional().or(z.literal("")),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const resourceSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  type: z.enum(["DETAILED_NOTES", "SHORT_NOTES", "PDF", "PPT", "VIDEO", "REVISION_NOTES", "IMPORTANT_QUESTIONS", "OTHER"]),
  fileUrl: z.string().optional(),
  externalUrl: z.string().optional(),
  allowDownload: z.boolean().default(true),
  accessLevel: z.enum(["PUBLIC", "LOGGED_IN", "SPECIFIC_BATCH", "MULTIPLE_BATCHES", "PREMIUM"]),
  topicId: z.string().optional(),
  subjectId: z.string().optional(),
  unitId: z.string().optional(),
});

export const pyqPaperSchema = z.object({
  subjectId: z.string().min(1),
  year: z.number().min(2000).max(2100),
  examType: z.enum(["END_SEMESTER", "MID_SEMESTER", "QUIZ", "SUPPLEMENTARY"]),
  pdfUrl: z.string().min(1),
});

export const pyqQuestionSchema = z.object({
  subjectId: z.string().min(1),
  unitId: z.string().optional(),
  topicId: z.string().optional(),
  year: z.number().min(2000).max(2100),
  question: z.string().min(5),
  marks: z.number().optional(),
  answer: z.string().optional(),
});

export const timetableSchema = z.object({
  courseId: z.string().min(1),
  semesterId: z.string().min(1),
  day: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  subject: z.string().min(1),
  room: z.string().optional(),
});

export const announcementSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(5),
  target: z.enum(["EVERYONE", "COURSE", "SEMESTER", "BATCH"]),
  courseId: z.string().optional(),
  semesterId: z.string().optional(),
  batchId: z.string().optional(),
});

export const examScheduleSchema = z.object({
  courseId: z.string().min(1),
  semesterId: z.string().min(1),
  subject: z.string().min(1),
  examDate: z.string().min(1),
  examTime: z.string().optional(),
  venue: z.string().optional(),
});

export const universityNoticeSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(5),
  category: z.string().default("general"),
  priority: z.string().default("normal"),
});
