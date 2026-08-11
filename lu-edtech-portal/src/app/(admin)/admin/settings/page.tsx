"use client";

import { Settings, Shield, Database, Storage } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Platform configuration</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Security</h3>
              <p className="text-sm text-gray-500">Auth and access settings</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Password Hashing</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">bcrypt</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Session Strategy</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">JWT</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Database</h3>
              <p className="text-sm text-gray-500">Connection and ORM</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Database</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">PostgreSQL</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">ORM</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Prisma</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Storage className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Storage</h3>
              <p className="text-sm text-gray-500">File storage configuration</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Provider</span>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Local / S3</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Max File Size</span>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">10 MB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
