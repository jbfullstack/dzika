import { SessionProvider } from "next-auth/react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Admin",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-[var(--theme-bg)] p-8">
          {children}
        </main>
      </div>
      <Toaster />
    </SessionProvider>
  );
}
