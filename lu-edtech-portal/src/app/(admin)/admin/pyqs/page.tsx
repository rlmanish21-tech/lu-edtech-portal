"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Plus } from "lucide-react";

interface PYQPaper {
  id: string;
  year: number;
  examType: string;
  subject: { name: string };
}

export default function AdminPYQsPage() {
  const [papers, setPapers] = useState<PYQPaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pyqs")
      .then((r) => r.json())
      .then((data) => {
        setPapers(data.papers || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">PYQs</h1>
          <p className="text-gray-500">Manage previous year questions</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Add PYQ
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Subject</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Year</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Exam Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {papers.map((paper) => (
                <tr key={paper.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{paper.subject.name}</td>
                  <td className="px-4 py-3 text-gray-700">{paper.year}</td>
                  <td className="px-4 py-3 text-gray-700">{paper.examType.replace("_", " ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {papers.length === 0 && (
          <div className="p-8 text-center text-gray-500">No PYQs found</div>
        )}
      </div>
    </div>
  );
}
