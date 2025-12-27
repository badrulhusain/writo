'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Blog {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
}

const EditBlogPost = () => {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog');
        }
        
        // Check if response has content before parsing JSON
        const text = await response.text();
        if (!text) {
          throw new Error('Empty response from server');
        }
        
        try {
          const data = JSON.parse(text);
          setBlog(data);
          setTitle(data.title);
          setContent(data.content);
        } catch {
          throw new Error('Invalid JSON response from server');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBlog();
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/blogs/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error('Failed to update blog post');
      }

      // Check if response has content before parsing JSON
      const text = await response.text();
      if (!text) {
        router.push(`/blog/${params.id}`);
        return;
      }
      
      try {
        JSON.parse(text);
        setTitleError('');
        setContentError('');
        router.push(`/blog/${params.id}`);
      } catch {
        throw new Error('Invalid JSON response from server');
      }
    } catch (error: any) {
      setTitleError(error.message);
      setContentError(error.message);
    }
  };

  if (loading) {
    return <span className="loading loading-ring loading-xl"></span>;
  }

  if (error) {
    return <div className="text-red-600 text-center">{error}</div>;
  }

  if (!blog) {
    return <div className="text-center">Blog not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Edit Blog Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleError('');
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              titleError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Enter blog title"
          />
          {titleError && <p className="text-red-500 text-xs italic mt-2">{titleError}</p>}
        </div>
        <div className="mb-6">
          <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setContentError('');
            }}
            rows={10}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              contentError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Enter blog content"
          ></textarea>
          {contentError && <p className="text-red-500 text-xs italic mt-2">{contentError}</p>}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Blog Post
          </button>
          <Link
            href={`/blog/${blog.id}`}
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditBlogPost;