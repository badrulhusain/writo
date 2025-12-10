import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Shield, 
  Activity 
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/posts", icon: FileText, label: "Posts" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/comments", icon: MessageSquare, label: "Comments" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
  { href: "/admin/security", icon: Shield, label: "Security" },
  { href: "/admin/health", icon: Activity, label: "System Health" },
];

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-6">
      <div className="mb-8">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          WRITO
        </Link>
        <p className="text-sm text-muted-foreground mt-1">Admin Dashboard</p>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="mt-8 pt-8 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <span>← Back to Site</span>
        </Link>
      </div>
    </aside>
  );
}
