"use client";

import { useState, useEffect } from "react";
import { Users, Search, Filter, Mail, Phone, GraduationCap } from "lucide-react";

interface Student {
  id: string;
  enrollmentNo?: string;
  status: string;
  user: { name: string; email: string; phone?: string; status: string };
  course: { name: string };
  semester: { name: string };
  _count: { enrollments: number };
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      });
  }, []);

  const filtered = students.filter((s) =>
    s.user.name.toLowerCase().includes(search.toLowerCase()) ||
    s.user.email.toLowerCase().includes(search.toLowerCase()) ||
    s.enrollmentNo?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500">Manage student accounts and enrollments</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Student</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Course</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Semester</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Batches</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{student.user.name}</p>
                      <p className="text-xs text-gray-500">{student.user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{student.course.name}</td>
                  <td className="px-4 py-3 text-gray-700">{student.semester.name}</td>
                  <td className="px-4 py-3 text-gray-700">{student._count.enrollments}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${student.user.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {student.user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-500">No students found</div>
        )}
      </div>
    </div>
  );
}
