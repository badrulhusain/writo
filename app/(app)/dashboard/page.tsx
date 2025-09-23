"use client";

import React from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';

function Dashboard() {
  const user = useCurrentUser();

  return (
    <div>
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-white text-4xl font-bold">My Posts</h1>
                <p className="text-[#9dabb9] text-base mt-1">Welcome back, {user?.name?.split(' ')[0] || 'Sophia'}. Your creative hub awaits.</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center justify-center gap-2 rounded-lg h-11 px-5 bg-[#1172d4] text-white text-sm font-bold hover:bg-[#0f63b6]">
                  <span className="material-symbols-outlined">add_circle</span>
                  <span className="truncate">Create New Post</span>
                </button>
                <div className="relative">
                  <button className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-14 border-2 border-blue-500" style={{ backgroundImage: `url("${user?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMuFAcrexZnu-MnPc33xMsc_TgHughy31oOlB7PluORPRu3VUrPUpFWE74H9EjDfs2yIRFOeEo5RzyD0OrkPUpPyyUnJokv8JD5iJRKA1KeTGdQUdsiwEIW-1oiFW7NQigRO41QzDt53CHzwfcClIRSs8MYM6Dq70QX0OaBmEtbThHU1nq1Oc16BvkQHDoU8irFLAKvyqht4k5iKhD1g4EJn6X-z8XRVg1b7DQ0NAoow1PmDOkMjSsmxLpBlOFrxP6k3NhtlrY3ME'}"` }}></button>
                </div>
              </div>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-[#181C20] rounded-lg p-6">
                <h2 className="text-white text-2xl font-bold mb-4">My Posts</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-b-[#3b4754]">
                        <th className="px-4 py-3 text-white text-sm font-medium">Title</th>
                        <th className="px-4 py-3 text-white text-sm font-medium">Status</th>
                        <th className="px-4 py-3 text-white text-sm font-medium text-right">Views</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-b-[#3b4754]">
                        <td className="px-4 py-4 text-white">The Art of Storytelling</td>
                        <td className="px-4 py-4">
                          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-300">Published</span>
                        </td>
                        <td className="px-4 py-4 text-[#9dabb9] text-right">1200</td>
                      </tr>
                      <tr className="border-b border-b-[#3b4754]">
                        <td className="px-4 py-4 text-white">Crafting Compelling Characters</td>
                        <td className="px-4 py-4">
                          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-300">Published</span>
                        </td>
                        <td className="px-4 py-4 text-[#9dabb9] text-right">850</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 text-white">Mastering Dialogue in Fiction</td>
                        <td className="px-4 py-4">
                          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-300">Draft</span>
                        </td>
                        <td className="px-4 py-4 text-[#9dabb9] text-right">0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-[#181C20] rounded-lg p-6">
                <h2 className="text-white text-2xl font-bold mb-4">Drafts</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-b-[#3b4754]">
                        <th className="px-4 py-3 text-white text-sm font-medium">Title</th>
                        <th className="px-4 py-3 text-white text-sm font-medium">Last Saved</th>
                        <th className="px-4 py-3 text-white text-sm font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-b-[#3b4754]">
                        <td className="px-4 py-4 text-white">Mastering Dialogue in Fiction</td>
                        <td className="px-4 py-4 text-[#9dabb9]">2 hours ago</td>
                        <td className="px-4 py-4 text-right">
                          <button className="text-[#1172d4] hover:text-[#0f63b6] font-medium">Edit</button>
                        </td>
                      </tr>
                      <tr className="border-b border-b-[#3b4754]">
                        <td className="px-4 py-4 text-white">The Power of Setting</td>
                        <td className="px-4 py-4 text-[#9dabb9]">1 day ago</td>
                        <td className="px-4 py-4 text-right">
                          <button className="text-[#1172d4] hover:text-[#0f63b6] font-medium">Edit</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 text-white">Editing Your Work</td>
                        <td className="px-4 py-4 text-[#9dabb9]">3 days ago</td>
                        <td className="px-4 py-4 text-right">
                          <button className="text-[#1172d4] hover:text-[#0f63b6] font-medium">Edit</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-white text-2xl font-bold mb-4">AI Writing Assistant</h2>
              <div className="bg-[#181C20] rounded-lg p-6 flex items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-white text-xl font-bold">Unleash your creativity.</h3>
                  <p className="text-[#9dabb9] text-base mt-2 mb-4">Get fresh ideas, outlines, and even full drafts for your next blog post with our AI-powered assistant.</p>
                  <button className="flex items-center justify-center gap-2 rounded-lg h-11 px-5 bg-[#1172d4] text-white text-sm font-bold hover:bg-[#0f63b6]">
                    <span className="material-symbols-outlined">auto_awesome</span>
                    <span className="truncate">Generate Ideas</span>
                  </button>
                </div>
                <div className="flex-shrink-0">
                  <div
                    className="w-64 h-40 bg-center bg-no-repeat bg-cover rounded-lg"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAlMM0zIOlW_9R-sbJNJYnsl4CG5FHjNQmMXAiRqrPUiDF5aHHLR8doGBsmqUz2jZleW57v_UZbL8lbhF6q53JWyLERohxTR_15C0LwbEWpMYaUi3BPw9PR-YK3O4AVasFraKh9CqR_86poHu0clNzsmDrQ2OXkAV9axKe16Ti4zZIcONDMX-WVcYp5ZFD5NvUMKYcjTYjYP1tXSEs8u_KwrCRK0ycxuCjfEY8Vl9WEF-D-oeh8BohG9W_P4Apcv5xzE1nzVN0GaSw")' }}
                  ></div>
                </div>
              </div>
            </div>
    </div>
  );
}

export default Dashboard;