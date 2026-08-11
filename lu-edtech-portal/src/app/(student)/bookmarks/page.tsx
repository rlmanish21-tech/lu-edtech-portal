"use client";

import { useState, useEffect } from "react";
import { Bookmark, FileText, Trash2 } from "lucide-react";
import { resourceTypeLabels, formatDate } from "@/lib/utils";

interface BookmarkItem {
  id: string;
  type: string;
  resource?: {
    id: string;
    title: string;
    type: string;
    subject?: { name: string };
  };
  createdAt: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookmarks")
      .then((r) => r.json())
      .then((data) => {
        setBookmarks(data);
        setLoading(false);
      });
  }, []);

  const removeBookmark = async (id: string) => {
    await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Bookmarks</h1>
        <p className="text-gray-500">Saved resources and materials</p>
      </div>

      {bookmarks.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {bookmarks.map((bm) => (
            <div key={bm.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{bm.resource?.title || "Bookmarked Item"}</h3>
                  <p className="text-xs text-gray-500">
                    {bm.resource ? resourceTypeLabels[bm.resource.type] : bm.type} · {bm.resource?.subject?.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Saved on {formatDate(bm.createdAt)}</p>
                </div>
              </div>
              <button
                onClick={() => removeBookmark(bm.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Bookmarks</h3>
          <p className="text-gray-500 mt-1">Bookmark resources while browsing to see them here.</p>
        </div>
      )}
    </div>
  );
}
