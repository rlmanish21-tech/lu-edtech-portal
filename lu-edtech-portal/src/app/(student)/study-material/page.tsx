"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Download, ExternalLink, Search, Filter } from "lucide-react";
import { resourceTypeLabels, formatDate } from "@/lib/utils";

interface Resource {
  id: string;
  title: string;
  description?: string;
  type: string;
  fileUrl?: string;
  externalUrl?: string;
  allowDownload: boolean;
  subject?: { name: string };
  unit?: { name: string };
  topic?: { name: string };
  createdAt: string;
}

export default function StudyMaterialPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        setResources(data);
        setLoading(false);
      });
  }, []);

  const filtered = resources.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(filter.toLowerCase()) ||
      r.subject?.name.toLowerCase().includes(filter.toLowerCase());
    const matchesType = typeFilter ? r.type === typeFilter : true;
    return matchesSearch && matchesType;
  });

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Study Material</h1>
        <p className="text-gray-500">All your study resources in one place</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="">All Types</option>
          {Object.entries(resourceTypeLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((res) => (
            <div key={res.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{res.title}</h3>
                    <p className="text-xs text-gray-500">{resourceTypeLabels[res.type]} · {res.subject?.name}</p>
                  </div>
                </div>
              </div>
              {res.description && <p className="text-sm text-gray-600 mb-3">{res.description}</p>}
              <div className="flex items-center gap-2">
                {res.fileUrl && res.allowDownload && (
                  <a
                    href={res.fileUrl}
                    download
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Download className="w-4 h-4" /> Download
                  </a>
                )}
                {res.externalUrl && (
                  <a
                    href={res.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <ExternalLink className="w-4 h-4" /> Open
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No resources found</p>
        </div>
      )}
    </div>
  );
}
