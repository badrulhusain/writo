"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Save,
  RotateCcw
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AITools } from "@/components/ai-tools";

export default function CreateBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [publishImmediately, setPublishImmediately] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddNewTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleSaveDraft = async () => {
    console.log("handleSaveDraft called - sending status: draft");
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category: category || undefined,
          tags,
          status: "draft",
          featuredImage: selectedImage ? {
            url: selectedImage.url,
            alt: selectedImage.alt,
            photographer: selectedImage.photographer,
            photographerUrl: selectedImage.photographerUrl
          } : undefined,
        }),
      });

      if (response.ok) {
        const blog = await response.json();
        console.log("Draft saved:", blog);
        router.push("/blog"); // Redirect to blog list
      } else {
        const error = await response.json();
        console.error("Error saving draft:", error);
        alert("Error saving draft: " + error.error);
      }
    } catch (error) {
      console.error("Error:", error);
      // TODO: Show error message
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    console.log("handlePublish called - publishImmediately:", publishImmediately, "- sending status:", publishImmediately ? "published" : "draft");
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category: category || undefined,
          tags,
          status: publishImmediately ? "published" : "draft",
          featuredImage: selectedImage ? {
            url: selectedImage.url,
            alt: selectedImage.alt,
            photographer: selectedImage.photographer,
            photographerUrl: selectedImage.photographerUrl
          } : undefined,
        }),
      });

      if (response.ok) {
        const blog = await response.json();
        console.log("Blog saved:", blog);
        router.push("/blog"); // Redirect to blog list
      } else {
        const error = await response.json();
        console.error("Error saving blog:", error);
        alert("Error saving blog: " + error.error);
      }
    } catch (error) {
      console.error("Error:", error);
      // TODO: Show error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Blog Post</h1>
        <p className="text-muted-foreground">Write and publish your blog post with AI assistance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content Editor */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blog Content</CardTitle>
              <CardDescription>Write your blog post content below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Your blog post title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog post content here..."
                  className="min-h-[400px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Publish Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                 <Label htmlFor="publish">Publish immediately</Label>
                 <Switch
                   id="publish"
                   checked={publishImmediately}
                   onCheckedChange={setPublishImmediately}
                 />
               </div>

              <div className="flex gap-2">
                 <Button
                   variant="outline"
                   onClick={handleSaveDraft}
                   className="flex-1"
                   disabled={isLoading}
                 >
                   <RotateCcw className="h-4 w-4 mr-2" />
                   {isLoading ? "Saving..." : "Save Draft"}
                 </Button>
                 <Button
                   onClick={handlePublish}
                   className="flex-1"
                   disabled={isLoading}
                 >
                   <Save className="h-4 w-4 mr-2" />
                   {isLoading ? "Saving..." : (publishImmediately ? "Publish" : "Save Draft")}
                 </Button>
               </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Add tags to categorize your post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  value={newTag} 
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddNewTag();
                    }
                  }}
                />
                <Button onClick={handleAddNewTag}>Add</Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <button 
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Tools */}
          <AITools
            content={content}
            onContentChange={setContent}
            title={title}
            onTitleChange={setTitle}
            onAddTag={handleAddTag}
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
          />
        </div>
      </div>
    </div>
  );
}