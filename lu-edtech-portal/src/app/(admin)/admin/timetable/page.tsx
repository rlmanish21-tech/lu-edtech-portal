"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, Clock } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface Entry {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  room?: string;
}

export default function AdminTimetablePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/timetable")
      .then((r) => r.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-500">Manage university class schedules</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Add Entry
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Day</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Time</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Subject</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Room</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{entry.day}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{entry.subject}</td>
                  <td className="px-4 py-3 text-gray-700">{entry.room || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {entries.length === 0 && (
          <div className="p-8 text-center text-gray-500">No timetable entries</div>
        )}
      </div>
    </div>
  );
}
