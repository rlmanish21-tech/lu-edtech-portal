"use client";

import { useState, useEffect } from "react";
import { UserCog, Mail, BookOpen, Shield } from "lucide-react";

interface Faculty {
  id: string;
  designation: string;
  department?: string;
  user: { name: string; email: string; status: string };
  _count: { assignments: number; batches: number };
}

export default function AdminFacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/faculty")
      .then((r) => r.json())
      .then((data) => {
        setFaculty(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Faculty</h1>
        <p className="text-gray-500">Manage faculty members and permissions</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Designation</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Department</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Batches</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {faculty.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700">
                        {f.user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{f.user.name}</p>
                        <p className="text-xs text-gray-500">{f.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{f.designation}</td>
                  <td className="px-4 py-3 text-gray-700">{f.department || "-"}</td>
                  <td className="px-4 py-3 text-gray-700">{f._count.batches}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${f.user.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {f.user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {faculty.length === 0 && (
          <div className="p-8 text-center text-gray-500">No faculty found</div>
        )}
      </div>
    </div>
  );
}
