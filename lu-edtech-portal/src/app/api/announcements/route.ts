import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const announcements = await prisma.announcement.findMany({
    include: { batch: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(announcements);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const announcement = await prisma.announcement.create({
    data: {
      title: body.title,
      content: body.content,
      target: body.target,
      courseId: body.courseId,
      semesterId: body.semesterId,
      batchId: body.batchId,
      createdBy: session.user.id,
      status: "published",
    },
  });

  // Create notifications for targeted users
  // (Simplified - in production, you'd batch this)

  return NextResponse.json(announcement);
}
