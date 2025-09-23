'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TypingAnimation } from "@/components/ui/typing-animation";
import { useCurrentUser } from '@/hooks/use-current-user';
interface Blog {
  id: string
  title: string
  content: string
  createdAt: string
  author: { name: string | null }
}

function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const user = useCurrentUser()

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        setBlogs(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="flex justify-center items-center min-h-screen"><TypingAnimation>LOADING...</TypingAnimation></div>

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-gray-900 text-4xl font-bold">All Blogs</h1>
          <p className="text-gray-600 text-base mt-1">Welcome back, {user?.name?.split(' ')[0] || 'User'}. Explore all published posts.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href={'/blog/create'} className="flex items-center justify-center gap-2 rounded-lg h-11 px-5 bg-[#1172d4] text-white text-sm font-bold hover:bg-[#0f63b6]" >
            <span className="material-symbols-outlined">add_circle</span>
            <span className="truncate" >Create New Post</span>
          </Link>
          <div className="relative">
            <button className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-14 border-2 border-blue-500" style={{ backgroundImage: `url("${user?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMuFAcrexZnu-MnPc33xMsc_TgHughy31oOlB7PluORPRu3VUrPUpFWE74H9EjDfs2yIRFOeEo5RzyD0OrkPUpPyyUnJokv8JD5iJRKA1KeTGdQUdsiwEIW-1oiFW7NQigRO41QzDt53CHzwfcClIRSs8MYM6Dq70QX0OaBmEtbThHU1nq1Oc16BvkQHDoU8irFLAKvyqht4k5iKhD1g4EJn6X-z8XRVg1b7DQ0NAoow1PmDOkMjSsmxLpBlOFrxP6k3NhtlrY3ME'}"` }}></button>
          </div>
        </div>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map(blog => (
          <Link key={blog.id} href={`/blog/${blog.id}`}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{blog.title}</CardTitle>
                <CardDescription>By {blog.author.name || 'Anonymous'} on {new Date(blog.createdAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{blog.content.substring(0, 100)}...</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    
    </div>
  )
}

export default Blog