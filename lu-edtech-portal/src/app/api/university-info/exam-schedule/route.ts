import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  });

  const where: any = { status: "active" };
  if (profile) {
    where.courseId = profile.courseId;
    where.semesterId = profile.semesterId;
  }

  const exams = await prisma.examSchedule.findMany({
    where,
    orderBy: { examDate: "asc" },
  });

  return NextResponse.json(exams);
}
