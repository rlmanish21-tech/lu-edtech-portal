import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StudentSidebar } from "@/components/layout/student-sidebar";
import { StudentHeader } from "@/components/layout/student-header";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader user={session.user} />
      <div className="flex">
        <StudentSidebar />
        <main className="flex-1 ml-0 lg:ml-64 pt-16 min-h-screen">
          <div className="p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
