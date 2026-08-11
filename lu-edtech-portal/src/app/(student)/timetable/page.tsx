"use client";

import { useState, useEffect } from "react";
import { Clock, Calendar, MapPin } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface TimetableEntry {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  room?: string;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function TimetablePage() {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">University Timetable</h1>
        <p className="text-gray-500">Your class schedule for this semester</p>
      </div>

      <div className="space-y-4">
        {days.map((day) => {
          const dayEntries = entries.filter((e) => e.day === day);
          if (dayEntries.length === 0) return null;
          return (
            <div key={day} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> {day}
                </h2>
              </div>
              <div className="p-4 space-y-2">
                {dayEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{entry.subject}</p>
                      <p className="text-sm text-gray-500">
                        {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                      </p>
                    </div>
                    {entry.room && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        {entry.room}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
