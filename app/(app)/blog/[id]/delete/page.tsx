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

const DeleteBlogPost = () => {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

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
        } catch (parseError) {
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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/blogs/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete blog post');
      }

      router.push('/blog');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center">{error}</div>;
  }

  if (!blog) {
    return <div className="text-center">Blog not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Delete Blog Post</h1>
      <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p className="font-bold">Warning!</p>
        <p>Are you sure you want to delete the following blog post? This action cannot be undone.</p>
      </div>
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
        <p className="text-gray-600 mb-4">
          By {blog.author.name} on {new Date(blog.createdAt).toLocaleDateString()}
        </p>
        <div className="prose max-w-none">
          {blog.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className={`px-4 py-2 text-white rounded ${
            deleting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {deleting ? 'Deleting...' : 'Delete Blog Post'}
        </button>
        <Link
          href={`/blog/${blog.id}`}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
};

export default DeleteBlogPost;