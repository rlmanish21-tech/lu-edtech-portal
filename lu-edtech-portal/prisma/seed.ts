import { PrismaClient, UserRole, UserStatus, BatchStatus, ResourceType, AccessLevel, ResourceStatus, ExamType, NotificationType, BookmarkType, AnnouncementTarget } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data in correct order
  await prisma.bookmark.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.pyqQuestion.deleteMany();
  await prisma.pyqPaper.deleteMany();
  await prisma.resourceAccess.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.facultyAssignment.deleteMany();
  await prisma.batchEnrollment.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.curriculum.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.universityNotice.deleteMany();
  await prisma.academicCalendar.deleteMany();
  await prisma.examSchedule.deleteMany();
  await prisma.universityTimetable.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.facultyProfile.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.university.deleteMany();

  console.log("✅ Cleared existing data");

  // ==================== USERS ====================
  const adminPassword = await bcrypt.hash("admin@123", 12);
  const studentPassword = await bcrypt.hash("student@123", 12);
  const facultyPassword = await bcrypt.hash("faculty@123", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@luedtech.com",
      password: adminPassword,
      name: "System Administrator",
      phone: "+91-9876543210",
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const facultyUser = await prisma.user.create({
    data: {
      email: "faculty@luedtech.com",
      password: facultyPassword,
      name: "Dr. Rajesh Sharma",
      phone: "+91-9876543211",
      role: UserRole.FACULTY,
      status: UserStatus.ACTIVE,
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      email: "student@luedtech.com",
      password: studentPassword,
      name: "Amit Kumar",
      phone: "+91-9876543212",
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
    },
  });

  console.log("✅ Created users");

  // ==================== UNIVERSITY ====================
  const university = await prisma.university.create({
    data: {
      name: "Lucknow University",
      slug: "lucknow-university",
      location: "Lucknow, Uttar Pradesh",
      status: "active",
    },
  });

  // ==================== COLLEGE ====================
  const college = await prisma.college.create({
    data: {
      name: "Faculty of Commerce",
      universityId: university.id,
      type: "department",
      status: "active",
    },
  });

  // ==================== COURSE ====================
  const course = await prisma.course.create({
    data: {
      name: "B.Com (Hons)",
      universityId: university.id,
      code: "BCOMH",
      duration: 3,
      status: "active",
    },
  });

  // ==================== CURRICULUM ====================
  const curriculum = await prisma.curriculum.create({
    data: {
      name: "Session 2026-27",
      courseId: course.id,
      sessionYear: "2026-27",
      status: "active",
    },
  });

  // ==================== SEMESTER ====================
  const semester = await prisma.semester.create({
    data: {
      name: "Semester V",
      number: 5,
      curriculumId: curriculum.id,
      status: "active",
    },
  });

  // ==================== SUBJECTS ====================
  await prisma.subject.createMany({
    data: [
      { name: "International Business", semesterId: semester.id, code: "IB501", credits: 4, status: "active" },
      { name: "Income Tax", semesterId: semester.id, code: "IT502", credits: 4, status: "active" },
      { name: "Business Finance", semesterId: semester.id, code: "BF503", credits: 4, status: "active" },
      { name: "Marketing Management", semesterId: semester.id, code: "MM504", credits: 4, status: "active" },
    ],
  });

  const subjectsList = await prisma.subject.findMany({ where: { semesterId: semester.id } });

  // ==================== UNITS & TOPICS ====================
  const ibSubject = subjectsList.find(s => s.name === "International Business")!;

  await prisma.unit.createMany({
    data: [
      { name: "Introduction to International Business", number: 1, subjectId: ibSubject.id, status: "active" },
      { name: "International Trade Theories", number: 2, subjectId: ibSubject.id, status: "active" },
      { name: "Export-Import Procedures", number: 3, subjectId: ibSubject.id, status: "active" },
      { name: "Global Marketing and Finance", number: 4, subjectId: ibSubject.id, status: "active" },
    ],
  });

  const ibUnitList = await prisma.unit.findMany({ where: { subjectId: ibSubject.id } });
  const unit3 = ibUnitList.find(u => u.number === 3)!;

  await prisma.topic.createMany({
    data: [
      { name: "Export Procedure", unitId: unit3.id, description: "Step-by-step export procedure and documentation", status: "active" },
      { name: "Export Documentation", unitId: unit3.id, description: "Types of export documents and their importance", status: "active" },
      { name: "Export Promotion", unitId: unit3.id, description: "Government schemes and incentives for export promotion", status: "active" },
      { name: "Export Incentives", unitId: unit3.id, description: "Financial and non-financial export incentives", status: "active" },
    ],
  });

  // ==================== FACULTY PROFILE ====================
  const faculty = await prisma.facultyProfile.create({
    data: {
      userId: facultyUser.id,
      designation: "Associate Professor",
      department: "Commerce",
      specialization: "International Business & Taxation",
      permissions: { canUploadContent: true, canManageBatches: true, canCreateAnnouncements: true },
      status: UserStatus.ACTIVE,
    },
  });

  // ==================== STUDENT PROFILE ====================
  const student = await prisma.studentProfile.create({
    data: {
      userId: studentUser.id,
      enrollmentNo: "LU2023BCOMH5001",
      universityId: university.id,
      collegeId: college.id,
      courseId: course.id,
      semesterId: semester.id,
      curriculumId: curriculum.id,
      status: UserStatus.ACTIVE,
    },
  });

  // ==================== BATCH ====================
  const batch = await prisma.batch.create({
    data: {
      name: "B.Com (H) Semester V Complete Batch",
      code: "BCOMH5-2026",
      universityId: university.id,
      courseId: course.id,
      semesterId: semester.id,
      curriculumId: curriculum.id,
      facultyId: faculty.id,
      description: "Complete coverage of B.Com (Hons) Semester V all subjects with detailed notes, PYQs, and revision material.",
      externalUrl: "https://external-learning-platform.example.com/batch/bcomh5-2026",
      startDate: new Date("2026-01-15"),
      endDate: new Date("2026-06-30"),
      status: BatchStatus.ACTIVE,
    },
  });

  // ==================== BATCH ENROLLMENT ====================
  await prisma.batchEnrollment.create({
    data: {
      studentId: student.id,
      batchId: batch.id,
      status: "active",
    },
  });

  // ==================== RESOURCES ====================
  const topics = await prisma.topic.findMany({ where: { unitId: unit3.id } });
  const exportDocTopic = topics.find(t => t.name === "Export Documentation")!;

  await prisma.resource.createMany({
    data: [
      {
        title: "Export Documentation - Detailed Notes",
        description: "Comprehensive notes covering all types of export documents including commercial invoice, packing list, bill of lading, and certificate of origin.",
        type: ResourceType.DETAILED_NOTES,
        fileUrl: "/uploads/demo/export-documentation-notes.pdf",
        allowDownload: true,
        accessLevel: AccessLevel.LOGGED_IN,
        status: ResourceStatus.PUBLISHED,
        topicId: exportDocTopic.id,
        subjectId: ibSubject.id,
        unitId: unit3.id,
        uploadedBy: facultyUser.id,
      },
      {
        title: "Export Documentation - Short Notes",
        description: "Quick revision notes for export documentation.",
        type: ResourceType.SHORT_NOTES,
        fileUrl: "/uploads/demo/export-documentation-short.pdf",
        allowDownload: true,
        accessLevel: AccessLevel.LOGGED_IN,
        status: ResourceStatus.PUBLISHED,
        topicId: exportDocTopic.id,
        subjectId: ibSubject.id,
        unitId: unit3.id,
        uploadedBy: facultyUser.id,
      },
      {
        title: "Export Procedure PPT",
        description: "PowerPoint presentation on export procedures.",
        type: ResourceType.PPT,
        fileUrl: "/uploads/demo/export-procedure.pptx",
        allowDownload: true,
        accessLevel: AccessLevel.LOGGED_IN,
        status: ResourceStatus.PUBLISHED,
        topicId: topics.find(t => t.name === "Export Procedure")!.id,
        subjectId: ibSubject.id,
        unitId: unit3.id,
        uploadedBy: facultyUser.id,
      },
      {
        title: "Export Promotion Video Lecture",
        description: "Video lecture on export promotion schemes by Dr. Rajesh Sharma.",
        type: ResourceType.VIDEO,
        externalUrl: "https://www.youtube.com/watch?v=demo-export-promotion",
        allowDownload: false,
        accessLevel: AccessLevel.LOGGED_IN,
        status: ResourceStatus.PUBLISHED,
        topicId: topics.find(t => t.name === "Export Promotion")!.id,
        subjectId: ibSubject.id,
        unitId: unit3.id,
        uploadedBy: facultyUser.id,
      },
      {
        title: "Important Questions - Unit 3",
        description: "Most important questions for Unit 3: Export-Import Procedures",
        type: ResourceType.IMPORTANT_QUESTIONS,
        fileUrl: "/uploads/demo/ib-unit3-imp-questions.pdf",
        allowDownload: true,
        accessLevel: AccessLevel.LOGGED_IN,
        status: ResourceStatus.PUBLISHED,
        topicId: exportDocTopic.id,
        subjectId: ibSubject.id,
        unitId: unit3.id,
        uploadedBy: facultyUser.id,
      },
    ],
  });

  // ==================== PYQ PAPERS ====================
  await prisma.pyqPaper.createMany({
    data: [
      { subjectId: ibSubject.id, year: 2025, examType: ExamType.END_SEMESTER, pdfUrl: "/uploads/demo/pyq-ib-2025.pdf", status: "published" },
      { subjectId: ibSubject.id, year: 2024, examType: ExamType.END_SEMESTER, pdfUrl: "/uploads/demo/pyq-ib-2024.pdf", status: "published" },
      { subjectId: ibSubject.id, year: 2023, examType: ExamType.END_SEMESTER, pdfUrl: "/uploads/demo/pyq-ib-2023.pdf", status: "published" },
    ],
  });

  // ==================== PYQ QUESTIONS ====================
  await prisma.pyqQuestion.createMany({
    data: [
      { subjectId: ibSubject.id, unitId: unit3.id, topicId: exportDocTopic.id, year: 2025, question: "Explain the various types of export documentation required for international trade. Discuss their importance.", marks: 15, answer: "Export documentation includes commercial invoice, packing list, bill of lading, certificate of origin...", status: "published" },
      { subjectId: ibSubject.id, unitId: unit3.id, topicId: exportDocTopic.id, year: 2024, question: "What is Letter of Credit? Explain the procedure and types of LC used in export-import business.", marks: 15, answer: "Letter of Credit is a document issued by a bank guaranteeing payment to the seller...", status: "published" },
      { subjectId: ibSubject.id, unitId: unit3.id, topicId: topics.find(t => t.name === "Export Promotion")!.id, year: 2025, question: "Discuss the various export promotion schemes offered by the Government of India.", marks: 10, answer: "The Government of India offers several export promotion schemes including SEIS, MEIS, EPCG...", status: "published" },
    ],
  });

  // ==================== UNIVERSITY TIMETABLE ====================
  await prisma.universityTimetable.createMany({
    data: [
      { courseId: course.id, semesterId: semester.id, day: "Monday", startTime: "09:00", endTime: "10:30", subject: "International Business", room: "Room 301", status: "active" },
      { courseId: course.id, semesterId: semester.id, day: "Monday", startTime: "11:00", endTime: "12:30", subject: "Income Tax", room: "Room 302", status: "active" },
      { courseId: course.id, semesterId: semester.id, day: "Tuesday", startTime: "09:00", endTime: "10:30", subject: "Business Finance", room: "Room 303", status: "active" },
      { courseId: course.id, semesterId: semester.id, day: "Tuesday", startTime: "11:00", endTime: "12:30", subject: "Marketing Management", room: "Room 304", status: "active" },
      { courseId: course.id, semesterId: semester.id, day: "Wednesday", startTime: "09:00", endTime: "10:30", subject: "International Business", room: "Room 301", status: "active" },
      { courseId: course.id, semesterId: semester.id, day: "Wednesday", startTime: "11:00", endTime: "12:30", subject: "Income Tax", room: "Room 302", status: "active" },
      { courseId: course.id, semesterId: semester.id, day: "Thursday", startTime: "09:00", endTime: "10:30", subject: "Business Finance", room: "Room 303", status: "active" },
      { courseId: course.id, semesterId: semester.id, day: "Thursday", startTime: "11:00", endTime: "12:30", subject: "Marketing Management", room: "Room 304", status: "active" },
      { courseId: course.id, semesterId: semester.id, day: "Friday", startTime: "09:00", endTime: "10:30", subject: "International Business", room: "Room 301", status: "active" },
      { courseId: course.id, semesterId: semester.id, day: "Friday", startTime: "11:00", endTime: "12:30", subject: "Income Tax", room: "Room 302", status: "active" },
    ],
  });

  // ==================== EXAM SCHEDULE ====================
  await prisma.examSchedule.createMany({
    data: [
      { courseId: course.id, semesterId: semester.id, subject: "International Business", examDate: new Date("2026-05-15"), examTime: "10:00 AM - 01:00 PM", venue: "Exam Hall A", status: "active" },
      { courseId: course.id, semesterId: semester.id, subject: "Income Tax", examDate: new Date("2026-05-18"), examTime: "10:00 AM - 01:00 PM", venue: "Exam Hall B", status: "active" },
      { courseId: course.id, semesterId: semester.id, subject: "Business Finance", examDate: new Date("2026-05-21"), examTime: "10:00 AM - 01:00 PM", venue: "Exam Hall A", status: "active" },
      { courseId: course.id, semesterId: semester.id, subject: "Marketing Management", examDate: new Date("2026-05-24"), examTime: "10:00 AM - 01:00 PM", venue: "Exam Hall C", status: "active" },
    ],
  });

  // ==================== ACADEMIC CALENDAR ====================
  await prisma.academicCalendar.createMany({
    data: [
      { universityId: university.id, title: "Semester V Begins", type: "event", eventDate: new Date("2026-01-15"), description: "Classes begin for Semester V", status: "active" },
      { universityId: university.id, title: "Mid-Semester Examination", type: "exam", eventDate: new Date("2026-03-10"), description: "Mid-semester exams for all subjects", status: "active" },
      { universityId: university.id, title: "Holi Vacation", type: "holiday", eventDate: new Date("2026-03-14"), description: "University closed for Holi", status: "active" },
      { universityId: university.id, title: "End Semester Examination", type: "exam", eventDate: new Date("2026-05-15"), description: "End semester examinations begin", status: "active" },
      { universityId: university.id, title: "Summer Vacation", type: "holiday", eventDate: new Date("2026-06-01"), description: "Summer break begins", status: "active" },
    ],
  });

  // ==================== UNIVERSITY NOTICES ====================
  await prisma.universityNotice.createMany({
    data: [
      { universityId: university.id, title: "Examination Form Fill-up Notice", content: "All students of Semester V are required to fill up examination forms by March 1, 2026. Late fee will be applicable after the deadline.", category: "exam", priority: "high", status: "published" },
      { universityId: university.id, title: "Library Timings Updated", content: "The central library will now remain open from 8:00 AM to 8:00 PM on all working days.", category: "general", priority: "normal", status: "published" },
      { universityId: university.id, title: "Scholarship Application Open", content: "Merit-cum-means scholarship applications are now open. Last date: February 28, 2026.", category: "general", priority: "high", status: "published" },
    ],
  });

  // ==================== ANNOUNCEMENTS ====================
  await prisma.announcement.createMany({
    data: [
      { title: "Welcome to B.Com (H) Semester V", content: "We are excited to begin the new semester. All study materials will be uploaded weekly. Stay tuned!", target: AnnouncementTarget.BATCH, batchId: batch.id, createdBy: facultyUser.id, status: "published" },
      { title: "New PYQs Added", content: "Previous year question papers for International Business (2023-2025) have been uploaded.", target: AnnouncementTarget.COURSE, courseId: course.id, createdBy: admin.id, status: "published" },
      { title: "Platform Maintenance", content: "The platform will undergo maintenance on Sunday, 2:00 AM - 4:00 AM.", target: AnnouncementTarget.EVERYONE, createdBy: admin.id, status: "published" },
    ],
  });

  // ==================== NOTIFICATIONS ====================
  await prisma.notification.createMany({
    data: [
      { userId: studentUser.id, type: NotificationType.NEW_NOTE, title: "New Notes Available", message: "Detailed notes for Export Documentation have been uploaded.", link: "/subjects", isRead: false },
      { userId: studentUser.id, type: NotificationType.NEW_PYQ, title: "PYQs Updated", message: "2025 PYQ paper for International Business is now available.", link: "/pyqs", isRead: false },
      { userId: studentUser.id, type: NotificationType.NEW_ANNOUNCEMENT, title: "New Announcement", message: "Welcome to B.Com (H) Semester V batch!", link: "/notifications", isRead: false },
    ],
  });

  // ==================== BOOKMARKS ====================
  const resource = await prisma.resource.findFirst({ where: { title: { contains: "Detailed Notes" } } });
  if (resource) {
    await prisma.bookmark.create({
      data: {
        userId: studentUser.id,
        resourceId: resource.id,
        type: BookmarkType.RESOURCE,
      },
    });
  }

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📋 DEMO CREDENTIALS:");
  console.log("   Admin:    admin@luedtech.com / admin@123");
  console.log("   Faculty:  faculty@luedtech.com / faculty@123");
  console.log("   Student:  student@luedtech.com / student@123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
