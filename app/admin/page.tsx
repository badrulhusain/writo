import { requireAdmin } from "@/lib/adminAuth";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatsCard } from "@/components/admin/StatsCard";
import { Users, FileText, MessageSquare, Heart } from "lucide-react";
import { connectDB, User, Blog, Like } from "@/lib/db";
import Comment from "@/models/Comment";

async function getStats() {
  // Directly compute stats on the server to avoid fetch redirects.
  await connectDB();
  const [
    totalUsers,
    totalPosts,
    totalComments,
    totalLikes,
    publishedPosts,
    draftPosts,
    adminUsers,
  ] = await Promise.all([
    User.countDocuments(),
    Blog.countDocuments(),
    Comment.countDocuments(),
    Like.countDocuments(),
    Blog.countDocuments({ status: "published" }),
    Blog.countDocuments({ status: "draft" }),
    User.countDocuments({ role: "ADMIN" }),
  ]);

  return {
    totalUsers,
    totalPosts,
    totalComments,
    totalLikes,
    publishedPosts,
    draftPosts,
    adminUsers,
  };
}

export default async function AdminDashboard() {
  await requireAdmin();
  const stats = await getStats();

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-2">Welcome to your admin dashboard</p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Users"
              value={stats.totalUsers}
              icon={Users}
              description={`${stats.adminUsers} admins`}
            />
            <StatsCard
              title="Total Posts"
              value={stats.totalPosts}
              icon={FileText}
              description={`${stats.publishedPosts} published, ${stats.draftPosts} drafts`}
            />
            <StatsCard
              title="Comments"
              value={stats.totalComments}
              icon={MessageSquare}
            />
            <StatsCard
              title="Total Likes"
              value={stats.totalLikes}
              icon={Heart}
            />
          </div>
        )}

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-muted-foreground">Activity feed coming soon...</p>
        </div>
      </div>
    </AdminLayout>
  );
}
