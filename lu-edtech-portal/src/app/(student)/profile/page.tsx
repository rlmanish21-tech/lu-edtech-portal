"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, GraduationCap, BookOpen, Shield } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  role: string;
  studentProfile?: {
    enrollmentNo?: string;
    university: { name: string };
    course: { name: string };
    semester: { name: string };
    curriculum: { name: string };
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/students/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!profile) return <div className="p-8 text-center text-gray-500">Profile not found</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500">Your account and academic information</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-700">
            {getInitials(profile.name)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-gray-500 capitalize flex items-center gap-1">
              <Shield className="w-4 h-4" /> {profile.role.toLowerCase()}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{profile.email}</p>
            </div>
          </div>
          {profile.phone && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{profile.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {profile.studentProfile && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5" /> Academic Information
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">University</p>
              <p className="font-medium text-gray-900">{profile.studentProfile.university.name}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Course</p>
              <p className="font-medium text-gray-900">{profile.studentProfile.course.name}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Semester</p>
              <p className="font-medium text-gray-900">{profile.studentProfile.semester.name}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Session</p>
              <p className="font-medium text-gray-900">{profile.studentProfile.curriculum.name}</p>
            </div>
            {profile.studentProfile.enrollmentNo && (
              <div className="p-3 bg-gray-50 rounded-lg sm:col-span-2">
                <p className="text-sm text-gray-500">Enrollment Number</p>
                <p className="font-medium text-gray-900">{profile.studentProfile.enrollmentNo}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
