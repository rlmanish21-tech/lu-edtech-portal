import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (body.question) {
    // Individual question
    const question = await prisma.pyqQuestion.create({
      data: {
        subjectId: body.subjectId,
        unitId: body.unitId,
        topicId: body.topicId,
        year: body.year,
        question: body.question,
        marks: body.marks,
        answer: body.answer,
        status: "published",
      },
    });
    return NextResponse.json(question);
  } else {
    // Full paper
    const paper = await prisma.pyqPaper.create({
      data: {
        subjectId: body.subjectId,
        year: body.year,
        examType: body.examType,
        pdfUrl: body.pdfUrl,
        status: "published",
      },
    });
    return NextResponse.json(paper);
  }
}
