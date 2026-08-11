"use client";

import { useState, useEffect } from "react";
import { Info, Calendar, FileText, AlertTriangle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  createdAt: string;
}

interface Exam {
  id: string;
  subject: string;
  examDate: string;
  examTime?: string;
  venue?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  type: string;
  eventDate: string;
  description?: string;
}

export default function UniversityInfoPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/university-info/notices").then((r) => r.json()),
      fetch("/api/university-info/exam-schedule").then((r) => r.json()),
      fetch("/api/university-info/calendar").then((r) => r.json()),
    ]).then(([n, e, c]) => {
      setNotices(n);
      setExams(e);
      setEvents(c);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
        <div>
          <p className="font-medium text-amber-800">Disclaimer</p>
          <p className="text-sm text-amber-700">
            This private platform provides university information for convenience only. 
            It is NOT the official Lucknow University portal. Please verify all dates and notices on the official website.
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">University Information</h1>
        <p className="text-gray-500">Notices, exam schedules, and academic calendar</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Notices */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5" /> Notices
          </h2>
          {notices.length > 0 ? (
            <div className="space-y-3">
              {notices.map((notice) => (
                <div key={notice.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{notice.title}</h3>
                    {notice.priority === "high" && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">High</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{notice.content}</p>
                  <p className="text-xs text-gray-400 mt-2">{formatDate(notice.createdAt)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">No notices available</p>
          )}
        </div>

        {/* Exam Schedule */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" /> Exam Schedule
          </h2>
          {exams.length > 0 ? (
            <div className="space-y-3">
              {exams.map((exam) => (
                <div key={exam.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm text-gray-900">{exam.subject}</p>
                  <p className="text-xs text-gray-500">{formatDate(exam.examDate)}</p>
                  {exam.examTime && <p className="text-xs text-gray-500">{exam.examTime}</p>}
                  {exam.venue && <p className="text-xs text-gray-500">{exam.venue}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">No exams scheduled</p>
          )}
        </div>
      </div>

      {/* Academic Calendar */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" /> Academic Calendar
        </h2>
        {events.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {events.map((event) => (
              <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm text-gray-900">{event.title}</p>
                <p className="text-xs text-gray-500">{formatDate(event.eventDate)}</p>
                {event.description && <p className="text-xs text-gray-400 mt-1">{event.description}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">No events scheduled</p>
        )}
      </div>
    </div>
  );
}
