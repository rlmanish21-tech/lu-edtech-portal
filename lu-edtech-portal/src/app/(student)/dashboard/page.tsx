import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Users,
  FileText,
  ClipboardList,
  Calendar,
  Bookmark,
  Bell,
  Clock,
  ExternalLink,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { formatDate, formatTime, getDayName, resourceTypeLabels } from "@/lib/utils";

async function getDashboardData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      studentProfile: {
        include: {
          university: true,
          course: true,
          semester: true,
          curriculum: true,
        },
      },
    },
  });

  if (!user?.studentProfile) return null;

  const profile = user.studentProfile;
  const today = getDayName();

  // Today's classes
  const todayClasses = await prisma.universityTimetable.findMany({
    where: {
      courseId: profile.courseId,
      semesterId: profile.semesterId,
      day: today,
      status: "active",
    },
    orderBy: { startTime: "asc" },
  });

  // Enrolled batches
  const enrollments = await prisma.batchEnrollment.findMany({
    where: {
      studentId: profile.id,
      status: "active",
    },
    include: {
      batch: {
        include: {
          faculty: {
            include: { user: { select: { name: true } } },
          },
        },
      },
    },
  });

  // Subjects
  const subjects = await prisma.subject.findMany({
    where: { semesterId: profile.semesterId, status: "active" },
    orderBy: { name: "asc" },
  });

  // Recent resources
  const recentResources = await prisma.resource.findMany({
    where: {
      subjectId: { in: subjects.map((s) => s.id) },
      status: "PUBLISHED",
    },
    include: { subject: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Recent PYQs
  const recentPYQs = await prisma.pyqPaper.findMany({
    where: {
      subjectId: { in: subjects.map((s) => s.id) },
      status: "published",
    },
    include: { subject: { select: { name: true } } },
    orderBy: { year: "desc" },
    take: 5,
  });

  // Announcements
  const announcements = await prisma.announcement.findMany({
    where: {
      OR: [
        { target: "EVERYONE" },
        { target: "COURSE", courseId: profile.courseId },
        { target: "SEMESTER", semesterId: profile.semesterId },
        {
          target: "BATCH",
          batchId: { in: enrollments.map((e) => e.batchId) },
        },
      ],
      status: "published",
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Unread notifications count
  const unreadNotifications = await prisma.notification.count({
    where: { userId, isRead: false },
  });

  // Bookmarks count
  const bookmarksCount = await prisma.bookmark.count({
    where: { userId },
  });

  return {
    user: {
      name: user.name,
      course: profile.course.name,
      semester: profile.semester.name,
      curriculum: profile.curriculum.name,
    },
    todayClasses,
    enrolledBatches: enrollments.map((e) => e.batch),
    subjects,
    recentResources,
    recentPYQs,
    announcements,
    unreadNotifications,
    bookmarksCount,
  };
}

export default async function StudentDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const data = await getDashboardData(session.user.id);
  if (!data) redirect("/login");

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {data.user.name}</h1>
            <p className="text-blue-100 mt-1">
              {data.user.course} · {data.user.semester} · {data.user.curriculum}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
            <GraduationCap className="w-5 h-5" />
            <span className="text-sm font-medium">Student Portal</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Subjects" value={data.subjects.length} href="/subjects" color="blue" />
        <StatCard icon={Users} label="My Batches" value={data.enrolledBatches.length} href="/batches" color="green" />
        <StatCard icon={Bell} label="Notifications" value={data.unreadNotifications} href="/notifications" color="amber" />
        <StatCard icon={Bookmark} label="Bookmarks" value={data.bookmarksCount} href="/bookmarks" color="purple" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Classes */}
          <DashboardCard title="Today&apos;s Classes" icon={Calendar} href="/timetable">
            {data.todayClasses.length > 0 ? (
              <div className="space-y-3">
                {data.todayClasses.map((cls) => (
                  <div key={cls.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{cls.subject}</p>
                      <p className="text-sm text-gray-500">
                        {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                        {cls.room && ` · ${cls.room}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm py-4 text-center">No classes scheduled for today</p>
            )}
          </DashboardCard>

          {/* My Batches */}
          <DashboardCard title="My Batches" icon={Users} href="/batches">
            {data.enrolledBatches.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3">
                {data.enrolledBatches.map((batch) => (
                  <div key={batch.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-gray-900">{batch.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Faculty: {batch.faculty?.user.name || "Not assigned"}
                    </p>
                    {batch.externalUrl && (
                      <a
                        href={batch.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Open Batch <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm py-4 text-center">No batch enrollments yet</p>
            )}
          </DashboardCard>

          {/* Recently Added */}
          <DashboardCard title="Recently Added" icon={FileText} href="/study-material">
            {data.recentResources.length > 0 ? (
              <div className="space-y-2">
                {data.recentResources.map((res) => (
                  <Link
                    key={res.id}
                    href={`/subjects/${res.subjectId}`}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{res.title}</p>
                      <p className="text-xs text-gray-500">
                        {resourceTypeLabels[res.type]} · {res.subject?.name} · {formatDate(res.createdAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm py-4 text-center">No recent uploads</p>
            )}
          </DashboardCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* My Subjects */}
          <DashboardCard title="My Subjects" icon={BookOpen} href="/subjects">
            <div className="space-y-2">
              {data.subjects.map((subject) => (
                <Link
                  key={subject.id}
                  href={`/subjects/${subject.id}`}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{subject.name}</p>
                    {subject.code && <p className="text-xs text-gray-500">{subject.code}</p>}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                </Link>
              ))}
            </div>
          </DashboardCard>

          {/* Latest PYQs */}
          <DashboardCard title="Latest PYQs" icon={ClipboardList} href="/pyqs">
            {data.recentPYQs.length > 0 ? (
              <div className="space-y-2">
                {data.recentPYQs.map((pyq) => (
                  <div key={pyq.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{pyq.subject.name}</p>
                      <p className="text-xs text-gray-500">{pyq.year} · {pyq.examType.replace("_", " ")}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm py-4 text-center">No PYQs available</p>
            )}
          </DashboardCard>

          {/* Announcements */}
          <DashboardCard title="Announcements" icon={Bell} href="/notifications">
            {data.announcements.length > 0 ? (
              <div className="space-y-3">
                {data.announcements.map((ann) => (
                  <div key={ann.id} className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <p className="font-medium text-gray-900 text-sm">{ann.title}</p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{ann.content}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(ann.createdAt)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm py-4 text-center">No announcements</p>
            )}
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  href: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <Link href={href} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </Link>
  );
}

function DashboardCard({
  title,
  icon: Icon,
  href,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-gray-500" />
          <h2 className="font-semibold text-gray-900">{title}</h2>
        </div>
        <Link href={href} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </Link>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
