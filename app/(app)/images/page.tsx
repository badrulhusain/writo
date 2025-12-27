"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon, User, Calendar } from "lucide-react";
import Link from "next/link";

interface BlogWithImage {
  _id: string;
  title: string;
  authorId: {
    name: string;
    email: string;
  };
  createdAt: string;
  featuredImage: {
    url: string;
    alt: string;
    photographer: string;
    photographerUrl: string;
  };
}

export default function ImagesPage() {
  const [images, setImages] = useState<BlogWithImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/blogs");
      if (response.ok) {
        const blogs = await response.json();
        // Filter blogs that have featured images
        const blogsWithImages = blogs.filter((blog: BlogWithImage) => blog.featuredImage);
        setImages(blogsWithImages);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-8">Loading images...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <ImageIcon className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">Selected Images</h1>
          <p className="text-muted-foreground">Browse all featured images from published blogs</p>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No images found</h3>
          <p className="text-muted-foreground">No blogs with featured images have been published yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((blog) => (
            <Card key={blog._id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={blog.featuredImage.url}
                  alt={blog.featuredImage.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  width={400}
                  height={400}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">{blog.title}</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <User className="h-3 w-3" />
                    <span>{blog.authorId.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{blog.authorId.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium truncate">{blog.authorId.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Photo by {blog.featuredImage.photographer}
                  </Badge>
                </div>
                <Link
                  href={`/blog/${blog._id}`}
                  className="block mt-2 text-sm text-muted-foreground hover:text-primary transition-colors line-clamp-1"
                >
                  {blog.title}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}