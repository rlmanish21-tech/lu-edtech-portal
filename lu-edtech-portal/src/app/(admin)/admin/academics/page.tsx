"use client";

import { useState, useEffect } from "react";
import { BookOpen, Plus, ChevronRight, Trash2, GraduationCap, Layers, FileText } from "lucide-react";

interface Item {
  id: string;
  name: string;
  children?: Item[];
}

export default function AdminAcademicsPage() {
  const [universities, setUniversities] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/academics/universities")
      .then((r) => r.json())
      .then((data) => {
        setUniversities(data);
        setLoading(false);
      });
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academics</h1>
          <p className="text-gray-500">Manage academic hierarchy</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Add University
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-700">Hierarchy: University → Course → Curriculum → Semester → Subject → Unit → Topic</p>
        </div>
        <div className="divide-y divide-gray-100">
          {universities.map((uni) => (
            <div key={uni.id}>
              <button
                onClick={() => toggleExpand(uni.id)}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 text-left"
              >
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">{uni.name}</span>
                <ChevronRight className={`w-4 h-4 text-gray-400 ml-auto transition-transform ${expanded.has(uni.id) ? "rotate-90" : ""}`} />
              </button>
              {expanded.has(uni.id) && (
                <div className="pl-12 pr-4 pb-4">
                  <p className="text-sm text-gray-500 mb-2">Courses, semesters, subjects, units, and topics can be managed here.</p>
                  <div className="flex gap-2">
                    <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors">
                      Manage Courses
                    </button>
                    <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors">
                      View Structure
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <QuickCard icon={GraduationCap} title="Universities" count={universities.length} color="blue" />
        <QuickCard icon={BookOpen} title="Courses" count="-" color="green" />
        <QuickCard icon={Layers} title="Subjects" count="-" color="purple" />
      </div>
    </div>
  );
}

function QuickCard({ icon: Icon, title, count, color }: { icon: any; title: string; count: number | string; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{count}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  );
}
