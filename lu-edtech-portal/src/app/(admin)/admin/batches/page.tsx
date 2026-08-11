"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Plus, Users, ExternalLink } from "lucide-react";

interface Batch {
  id: string;
  name: string;
  code: string;
  status: string;
  externalUrl?: string;
  faculty?: { user: { name: string } };
  course: { name: string };
  semester: { name: string };
  _count: { enrollments: number };
}

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/batches")
      .then((r) => r.json())
      .then((data) => {
        setBatches(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batches</h1>
          <p className="text-gray-500">Manage EdTech batches and enrollments</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Create Batch
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {batches.map((batch) => (
          <div key={batch.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{batch.name}</h3>
                <p className="text-sm text-gray-500">{batch.code}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${batch.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                {batch.status}
              </span>
            </div>
            <div className="space-y-1 text-sm text-gray-600 mb-4">
              <p>Faculty: {batch.faculty?.user.name || "Not assigned"}</p>
              <p>{batch.course.name} · {batch.semester.name}</p>
              <p className="flex items-center gap-1">
                <Users className="w-4 h-4" /> {batch._count.enrollments} students enrolled
              </p>
            </div>
            {batch.externalUrl && (
              <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-lg">
                <ExternalLink className="w-4 h-4" />
                <span className="truncate">{batch.externalUrl}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
