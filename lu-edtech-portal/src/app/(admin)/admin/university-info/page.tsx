"use client";

import { useState, useEffect } from "react";
import { Info, Plus, Calendar, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Notice {
  id: string;
  title: string;
  category: string;
  priority: string;
  createdAt: string;
}

export default function AdminUniversityInfoPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/university-info/notices")
      .then((r) => r.json())
      .then((data) => {
        setNotices(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">University Information</h1>
          <p className="text-gray-500">Manage notices, exam schedules, and calendar</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Info className="w-5 h-5" /> Notices
          </h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors">
            <Plus className="w-4 h-4" /> Add Notice
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Priority</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {notices.map((notice) => (
                <tr key={notice.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{notice.title}</td>
                  <td className="px-4 py-3 text-gray-700 capitalize">{notice.category}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${notice.priority === "high" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
                      {notice.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{formatDate(notice.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {notices.length === 0 && (
          <div className="p-8 text-center text-gray-500">No notices found</div>
        )}
      </div>
    </div>
  );
}
