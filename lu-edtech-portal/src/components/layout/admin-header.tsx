"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Shield, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { getInitials } from "@/lib/utils";

interface AdminHeaderProps {
  user: {
    name: string;
    email: string;
    role: string;
    image?: string | null;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-50">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-white hidden sm:block">LU EdTech Admin</span>
        </Link>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 hover:bg-slate-800 rounded-lg px-3 py-2 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
              {getInitials(user.name)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user.role.toLowerCase()}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                  Student Portal
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
