"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCircle, FileText, ClipboardList, Megaphone, Users, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  NEW_NOTE: FileText,
  NEW_PYQ: ClipboardList,
  NEW_ANNOUNCEMENT: Megaphone,
  BATCH_UPDATE: Users,
  TIMETABLE_UPDATE: Calendar,
  EXAM_SCHEDULE: Calendar,
  NEW_NOTICE: Bell,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      });
  }, []);

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllRead = async () => {
    await fetch("/api/notifications/read-all", { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500">Stay updated with latest announcements</p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={markAllRead}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <CheckCircle className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {notifications.map((notif) => {
            const Icon = typeIcons[notif.type] || Bell;
            return (
              <div
                key={notif.id}
                className={`p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${!notif.isRead ? "bg-blue-50/50" : ""}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${notif.isRead ? "bg-gray-100" : "bg-blue-100"}`}>
                  <Icon className={`w-5 h-5 ${notif.isRead ? "text-gray-500" : "text-blue-600"}`} />
                </div>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${notif.isRead ? "text-gray-600" : "text-gray-900"}`}>
                    {notif.title}
                  </p>
                  <p className="text-sm text-gray-500">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(notif.createdAt)}</p>
                </div>
                {!notif.isRead && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Mark read
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Notifications</h3>
          <p className="text-gray-500 mt-1">You&apos;re all caught up!</p>
        </div>
      )}
    </div>
  );
}
