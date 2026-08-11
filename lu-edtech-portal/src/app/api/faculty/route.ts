import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const faculty = await prisma.facultyProfile.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, status: true } },
      _count: { select: { assignments: true, batches: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(faculty);
}

export async function POST(request: Request) {
  const body = await request.json();
  const password = await import("bcryptjs").then((bcrypt) => bcrypt.hash(body.password || "faculty@123", 12));

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password,
      phone: body.phone,
      role: "FACULTY",
      status: "ACTIVE",
      facultyProfile: {
        create: {
          designation: body.designation,
          department: body.department,
          specialization: body.specialization,
          permissions: body.permissions || {},
        },
      },
    },
    include: { facultyProfile: true },
  });

  return NextResponse.json(user);
}
