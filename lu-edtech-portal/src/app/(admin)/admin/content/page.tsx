"use client";

import { useState, useEffect } from "react";
import { FileText, Plus, Search, Filter } from "lucide-react";
import { resourceTypeLabels, accessLevelLabels } from "@/lib/utils";

interface Resource {
  id: string;
  title: string;
  type: string;
  accessLevel: string;
  status: string;
  subject?: { name: string };
  createdAt: string;
}

export default function AdminContentPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content?status=all")
      .then((r) => r.json())
      .then((data) => {
        setResources(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content</h1>
          <p className="text-gray-500">Manage study materials and resources</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Upload Resource
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Subject</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Access</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {resources.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{res.title}</td>
                  <td className="px-4 py-3 text-gray-700">{resourceTypeLabels[res.type] || res.type}</td>
                  <td className="px-4 py-3 text-gray-700">{res.subject?.name || "-"}</td>
                  <td className="px-4 py-3 text-gray-700">{accessLevelLabels[res.accessLevel] || res.accessLevel}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${res.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {res.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {resources.length === 0 && (
          <div className="p-8 text-center text-gray-500">No resources found</div>
        )}
      </div>
    </div>
  );
}
