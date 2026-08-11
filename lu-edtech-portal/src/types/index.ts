import { UserRole, UserStatus, BatchStatus, ResourceType, AccessLevel, ResourceStatus, ExamType, NotificationType, BookmarkType, AnnouncementTarget } from "@prisma/client";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string | null;
  studentProfile?: {
    id: string;
    enrollmentNo?: string | null;
    universityId: string;
    courseId: string;
    semesterId: string;
    curriculumId: string;
    university: { name: string };
    course: { name: string };
    semester: { name: string };
    curriculum: { name: string; sessionYear: string };
  } | null;
  facultyProfile?: {
    id: string;
    designation: string;
    department?: string | null;
  } | null;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalBatches: number;
  totalFaculty: number;
  totalResources: number;
  totalPYQs: number;
}

export interface StudentDashboardData {
  user: SessionUser;
  todayClasses: Array<{
    id: string;
    startTime: string;
    endTime: string;
    subject: string;
    room?: string | null;
  }>;
  enrolledBatches: Array<{
    id: string;
    name: string;
    code: string;
    faculty?: { user: { name: string } } | null;
    externalUrl?: string | null;
  }>;
  subjects: Array<{
    id: string;
    name: string;
    code?: string | null;
    credits?: number | null;
  }>;
  recentResources: Array<{
    id: string;
    title: string;
    type: ResourceType;
    subject?: { name: string } | null;
    createdAt: Date;
  }>;
  recentPYQs: Array<{
    id: string;
    year: number;
    examType: ExamType;
    subject: { name: string };
  }>;
  announcements: Array<{
    id: string;
    title: string;
    content: string;
    createdAt: Date;
  }>;
  unreadNotifications: number;
  bookmarksCount: number;
}

export interface SubjectWithHierarchy {
  id: string;
  name: string;
  code?: string | null;
  credits?: number | null;
  units: Array<{
    id: string;
    name: string;
    number: number;
    topics: Array<{
      id: string;
      name: string;
      description?: string | null;
    }>;
  }>;
}

export interface TopicWithResources {
  id: string;
  name: string;
  description?: string | null;
  unit: {
    name: string;
    number: number;
    subject: {
      name: string;
    };
  };
  resources: Array<{
    id: string;
    title: string;
    description?: string | null;
    type: ResourceType;
    fileUrl?: string | null;
    externalUrl?: string | null;
    allowDownload: boolean;
    createdAt: Date;
  }>;
  pyqQuestions: Array<{
    id: string;
    year: number;
    question: string;
    marks?: number | null;
    answer?: string | null;
  }>;
}

export interface BatchWithDetails {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  externalUrl?: string | null;
  status: BatchStatus;
  faculty?: {
    user: { name: string };
  } | null;
  course: { name: string };
  semester: { name: string };
  enrollments: Array<{
    id: string;
    student: {
      user: { name: string; email: string };
    };
  }>;
}

export interface PYQWithFilter {
  id: string;
  year: number;
  examType: ExamType;
  pdfUrl: string;
  subject: { name: string };
}

export interface TimetableEntry {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  room?: string | null;
}

export interface AnnouncementWithTarget {
  id: string;
  title: string;
  content: string;
  target: AnnouncementTarget;
  createdAt: Date;
  batch?: { name: string } | null;
}

export interface NotificationWithType {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: Date;
}

export interface BookmarkWithResource {
  id: string;
  type: BookmarkType;
  resource?: {
    id: string;
    title: string;
    type: ResourceType;
    subject?: { name: string } | null;
  } | null;
  createdAt: Date;
}
