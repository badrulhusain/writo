"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  Clock, 
  Eye, 
  MessageCircle, 
  Share2, 
  Bookmark,
  ThumbsUp,
  Sparkles,
  Lightbulb,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

// Mock data for the blog post
const blogPost = {
  id: 1,
  title: "Building AI-Powered Blog Platforms with Next.js",
  content: `
    <p>In today's digital landscape, AI-powered blog platforms are revolutionizing how we create, consume, and interact with content. By integrating artificial intelligence into blogging platforms, we can enhance user experience, improve content quality, and provide personalized recommendations.</p>
    
    <h2>Why AI in Blogging?</h2>
    <p>AI brings several advantages to blogging platforms:</p>
    <ul>
      <li><strong>Content Creation Assistance:</strong> AI writing assistants can help generate ideas, improve grammar, and suggest improvements.</li>
      <li><strong>Personalization:</strong> Machine learning algorithms can recommend relevant content to users based on their reading history.</li>
      <li><strong>SEO Optimization:</strong> AI tools can analyze content for SEO best practices and suggest improvements.</li>
      <li><strong>Content Summarization:</strong> AI can automatically generate concise summaries of long articles.</li>
    </ul>
    
    <h2>Implementing AI Features in Next.js</h2>
    <p>Next.js provides an excellent foundation for building AI-powered applications. Here's how you can integrate key AI features:</p>
    
    <h3>1. AI Writing Assistant</h3>
    <p>Integrate language models to provide real-time writing suggestions. This can include:</p>
    <ul>
      <li>Grammar and style corrections</li>
      <li>Headline suggestions</li>
      <li>Content outline generation</li>
    </ul>
    
    <h3>2. Content Summarization</h3>
    <p>Use natural language processing models to automatically generate TL;DR summaries for long posts, improving user engagement and accessibility.</p>
    
    <h3>3. Personalized Recommendations</h3>
    <p>Implement recommendation engines that suggest related content based on user behavior and preferences.</p>
    
    <h2>Best Practices</h2>
    <p>When implementing AI features in your blog platform, consider these best practices:</p>
    <ol>
      <li><strong>Transparency:</strong> Clearly indicate when content has been AI-assisted.</li>
      <li><strong>User Control:</strong> Allow users to enable/disable AI features.</li>
      <li><strong>Privacy:</strong> Be transparent about data usage for personalization.</li>
      <li><strong>Quality Assurance:</strong> Always review AI-generated content before publishing.</li>
    </ol>
    
    <p>By thoughtfully integrating AI into your blog platform, you can create a more engaging and valuable experience for your readers while streamlining content creation for authors.</p>
  `,
  author: {
    name: "Alex Johnson",
    avatar: "https://github.com/shadcn.png",
    bio: "Senior Developer & AI Enthusiast"
  },
  date: "June 15, 2023",
  readTime: "8 min read",
  views: 1240,
  comments: 24,
  likes: 56,
  category: "Technology",
  tags: ["AI", "Next.js", "Web Development", "Content Creation"],
  aiSummary: "This article explores how to integrate AI tools into blog platforms to enhance content creation and user engagement. We'll cover implementation strategies for AI writing assistants, content summarization, and personalized recommendations.",
  relatedPosts: [
    {
      id: 2,
      title: "10 Tips for Better UI Design",
      excerpt: "Discover essential principles that will help you create more intuitive and engaging user interfaces...",
      views: 980,
      likes: 42
    },
    {
      id: 3,
      title: "Building a Blog with React",
      excerpt: "A step-by-step guide to creating your own blog platform using React and modern web technologies...",
      views: 1520,
      likes: 78
    },
    {
      id: 4,
      title: "Understanding Tailwind CSS",
      excerpt: "Explore the utility-first approach to styling and how it can speed up your development workflow...",
      views: 870,
      likes: 38
    }
  ]
};

export default function BlogDetailPage() {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  return (
    <div className="space-y-8">
      {/* Blog Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <Badge>{blogPost.category}</Badge>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {blogPost.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {blogPost.readTime}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {blogPost.views} views
          </span>
        </div>
        
        <h1 className="text-4xl font-bold">{blogPost.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={blogPost.author.avatar} />
              <AvatarFallback>{blogPost.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{blogPost.author.name}</p>
              <p className="text-sm text-muted-foreground">{blogPost.author.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            AI-Generated Summary (TL;DR)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{blogPost.aiSummary}</p>
        </CardContent>
      </Card>

      {/* Blog Content */}
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {blogPost.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-t border-b">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLike}
            className={liked ? "text-primary" : ""}
          >
            <ThumbsUp className="h-5 w-5 mr-2" />
            {liked ? "Liked" : "Like"} ({blogPost.likes + (liked ? 1 : 0)})
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle className="h-5 w-5 mr-2" />
            {blogPost.comments} Comments
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleBookmark}>
            <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`} />
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">AI Recommended for You</h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPost.relatedPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2 text-lg">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {post.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    {post.likes}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Comments (24)</h2>
        
        <div className="space-y-6">
          {/* Comment input */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea 
                    placeholder="Write a comment..." 
                    className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                  />
                  <div className="flex justify-end mt-3">
                    <Button>Post Comment</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Sample comments */}
          {[1, 2, 3].map((item) => (
            <Card key={item}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${item}`} />
                    <AvatarFallback>U{item}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">User {item}</h4>
                      <span className="text-sm text-muted-foreground">
                        {item === 1 ? "2 hours ago" : item === 2 ? "1 day ago" : "3 days ago"}
                      </span>
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      {item === 1 
                        ? "Great article! The section on AI writing assistants was particularly helpful." 
                        : item === 2 
                        ? "I've been working on a similar project. Would love to see more examples of implementation." 
                        : "Thanks for sharing. The best practices section is spot on."}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {item * 3}
                      </Button>
                      <Button variant="ghost" size="sm">Reply</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}