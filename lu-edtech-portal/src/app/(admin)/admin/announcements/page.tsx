"use client";

import { useState, useEffect } from "react";
import { Megaphone, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  content: string;
  target: string;
  createdAt: string;
  batch?: { name: string };
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/announcements")
      .then((r) => r.json())
      .then((data) => {
        setAnnouncements(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-500">Publish announcements to students</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{ann.title}</h3>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full capitalize">
                {ann.target.toLowerCase()}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{ann.content}</p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>{formatDate(ann.createdAt)}</span>
              {ann.batch && <span>Batch: {ann.batch.name}</span>}
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
            No announcements yet
          </div>
        )}
      </div>
    </div>
  );
}
