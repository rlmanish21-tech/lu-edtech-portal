import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const events = await prisma.academicCalendar.findMany({
    where: { status: "active" },
    orderBy: { eventDate: "asc" },
    take: 20,
  });
  return NextResponse.json(events);
}
