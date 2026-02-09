import { SessionProvider } from "next-auth/react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { getContent } from "@/actions/content-actions";

export const metadata = {
  title: "Admin",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const artistNameRow = await getContent("artist_name");
  const artistName = artistNameRow?.value || "DZIKA";

  return (
    <SessionProvider>
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar artistName={artistName} />
        <main className="flex-1 overflow-y-auto bg-[var(--theme-bg)] pt-14 p-4 lg:pt-8 lg:p-8">
          {children}
        </main>
      </div>
      <Toaster />
    </SessionProvider>
  );
}
