import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const resource = await prisma.resource.create({
    data: {
      title: body.title,
      description: body.description,
      type: body.type,
      fileUrl: body.fileUrl,
      externalUrl: body.externalUrl,
      allowDownload: body.allowDownload ?? true,
      accessLevel: body.accessLevel,
      status: body.status || "PUBLISHED",
      topicId: body.topicId,
      subjectId: body.subjectId,
      unitId: body.unitId,
      uploadedBy: session.user.id,
    },
  });

  return NextResponse.json(resource);
}
