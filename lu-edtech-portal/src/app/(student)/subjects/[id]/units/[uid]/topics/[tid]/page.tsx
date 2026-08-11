import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Download, ExternalLink, ClipboardList, Bookmark, ChevronLeft } from "lucide-react";
import { resourceTypeLabels, formatDate } from "@/lib/utils";

export default async function TopicPage({
  params,
}: {
  params: { id: string; uid: string; tid: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const topic = await prisma.topic.findUnique({
    where: { id: params.tid },
    include: {
      unit: {
        include: {
          subject: true,
        },
      },
      resources: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
      },
      pyqQuestions: {
        where: { status: "published" },
        orderBy: { year: "desc" },
      },
    },
  });

  if (!topic) redirect("/subjects");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href={`/subjects/${params.id}`} className="hover:text-blue-600 flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back to Subject
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-sm text-gray-500 mb-1">
          {topic.unit.subject.name} · Unit {topic.unit.number}: {topic.unit.name}
        </p>
        <h1 className="text-2xl font-bold text-gray-900">{topic.name}</h1>
        {topic.description && <p className="text-gray-600 mt-2">{topic.description}</p>}
      </div>

      {/* Resources */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" /> Study Resources
        </h2>
        {topic.resources.length > 0 ? (
          <div className="space-y-3">
            {topic.resources.map((res) => (
              <div key={res.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{res.title}</h3>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                      {resourceTypeLabels[res.type]}
                    </span>
                  </div>
                  {res.description && <p className="text-sm text-gray-600 mt-1">{res.description}</p>}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {res.fileUrl && res.allowDownload && (
                    <a
                      href={res.fileUrl}
                      download
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                  {res.externalUrl && (
                    <a
                      href={res.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Open"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">No resources available for this topic</p>
        )}
      </div>

      {/* PYQ Questions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ClipboardList className="w-5 h-5" /> Previous Year Questions
        </h2>
        {topic.pyqQuestions.length > 0 ? (
          <div className="space-y-3">
            {topic.pyqQuestions.map((q) => (
              <div key={q.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">{q.question}</p>
                  {q.marks && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full shrink-0 ml-2">{q.marks} Marks</span>}
                </div>
                <p className="text-xs text-gray-500">{q.year}</p>
                {q.answer && (
                  <div className="mt-2 p-2 bg-white rounded border border-gray-200 text-sm text-gray-700">
                    <span className="font-medium">Answer:</span> {q.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">No PYQs available for this topic</p>
        )}
      </div>
    </div>
  );
}
