"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Music,
  Palette,
  MessageSquare,
  BarChart3,
  FileText,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  ExternalLink,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tracks", label: "Tracks", icon: Music },
  { href: "/admin/themes", label: "Themes", icon: Palette },
  { href: "/admin/comments", label: "Comments", icon: MessageSquare },
  { href: "/admin/stats", label: "Statistics", icon: BarChart3 },
  { href: "/admin/content", label: "Content", icon: FileText },
];

interface AdminSidebarProps {
  artistName?: string;
}

export function AdminSidebar({ artistName = "DZIKA" }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile sidebar open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="flex h-16 items-center border-b border-white/10 px-4">
        {(!collapsed || mobileOpen) ? (
          <>
            <Link href="/admin" className="text-xl font-bold tracking-tight">
              {artistName.toUpperCase()}
            </Link>
            <span className="ml-2 rounded bg-white/10 px-2 py-0.5 text-xs">
              Admin
            </span>
          </>
        ) : (
          <Link href="/admin" className="mx-auto text-lg font-bold tracking-tight">
            {artistName.charAt(0).toUpperCase()}
          </Link>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed && !mobileOpen ? item.label : undefined}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                collapsed && !mobileOpen ? "justify-center" : "gap-3",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {(!collapsed || mobileOpen) && item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-2">
        {/* Desktop collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-full items-center rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          style={{ justifyContent: collapsed ? "center" : undefined }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4 shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4 shrink-0" />
              <span className="ml-3">Collapse</span>
            </>
          )}
        </button>

        <Link
          href="/"
          title={collapsed && !mobileOpen ? "View site" : undefined}
          className={cn(
            "flex items-center rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white",
            collapsed && !mobileOpen ? "justify-center" : "gap-3"
          )}
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          {(!collapsed || mobileOpen) && "View site"}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          title={collapsed && !mobileOpen ? "Sign out" : undefined}
          className={cn(
            "flex w-full items-center rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-red-400",
            collapsed && !mobileOpen ? "justify-center" : "gap-3"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {(!collapsed || mobileOpen) && "Sign out"}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center border-b border-white/10 bg-[var(--theme-surface)] px-4 lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/admin" className="ml-3 text-lg font-bold tracking-tight">
          {artistName.toUpperCase()}
        </Link>
        <span className="ml-2 rounded bg-white/10 px-2 py-0.5 text-xs">
          Admin
        </span>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile slide-in sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[var(--theme-surface)] transition-transform duration-200 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-3 rounded-lg p-1 text-white/40 hover:text-white"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex h-screen flex-col border-r border-white/10 bg-[var(--theme-surface)] transition-[width] duration-200 ease-in-out shrink-0",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
