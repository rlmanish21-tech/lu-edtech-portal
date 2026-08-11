"use client";

import { useState, useEffect } from "react";
import { ClipboardList, FileText, Filter } from "lucide-react";

interface PYQPaper {
  id: string;
  year: number;
  examType: string;
  pdfUrl: string;
  subject: { name: string };
}

interface PYQQuestion {
  id: string;
  year: number;
  question: string;
  marks?: number;
  answer?: string;
  subject: { name: string };
  unit?: { name: string };
  topic?: { name: string };
}

export default function PYQsPage() {
  const [papers, setPapers] = useState<PYQPaper[]>([]);
  const [questions, setQuestions] = useState<PYQQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState("");

  useEffect(() => {
    fetch("/api/pyqs")
      .then((r) => r.json())
      .then((data) => {
        setPapers(data.papers || []);
        setQuestions(data.questions || []);
        setLoading(false);
      });
  }, []);

  const years = [...new Set([...papers.map((p) => p.year), ...questions.map((q) => q.year)])].sort((a, b) => b - a);

  const filteredPapers = yearFilter ? papers.filter((p) => p.year.toString() === yearFilter) : papers;
  const filteredQuestions = yearFilter ? questions.filter((q) => q.year.toString() === yearFilter) : questions;

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Previous Year Questions</h1>
          <p className="text-gray-500">PYQ papers and individual questions</p>
        </div>
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Papers */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" /> Full Papers
        </h2>
        {filteredPapers.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {filteredPapers.map((paper) => (
              <a
                key={paper.id}
                href={paper.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{paper.subject.name}</p>
                  <p className="text-xs text-gray-500">{paper.year} · {paper.examType.replace("_", " ")}</p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">No papers found</p>
        )}
      </div>

      {/* Questions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ClipboardList className="w-5 h-5" /> Individual Questions
        </h2>
        {filteredQuestions.length > 0 ? (
          <div className="space-y-3">
            {filteredQuestions.map((q) => (
              <div key={q.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">{q.question}</p>
                  {q.marks && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{q.marks} Marks</span>}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{q.subject.name}</span>
                  <span>{q.year}</span>
                  {q.topic && <span>{q.topic.name}</span>}
                </div>
                {q.answer && (
                  <div className="mt-2 p-2 bg-white rounded border border-gray-200 text-sm text-gray-700">
                    <span className="font-medium">Answer:</span> {q.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">No questions found</p>
        )}
      </div>
    </div>
  );
}
