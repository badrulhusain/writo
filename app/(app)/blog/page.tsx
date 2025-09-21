'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TypingAnimation } from "@/components/ui/typing-animation";
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Blogs</h1>
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