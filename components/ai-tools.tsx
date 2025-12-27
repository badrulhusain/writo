"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UnsplashImagePicker } from "@/components/unsplash-image-picker";
import {
  Sparkles,
  Wand2,
  FileText,
  Tag,
  Eye,
  SpellCheck,
  FileSearch,
  Lightbulb,
  TrendingUp,
  Image as ImageIcon
} from "lucide-react";

interface AIToolsProps {
   content: string;
   onContentChange: (content: string) => void;
   title: string;
   onTitleChange: (title: string) => void;
   onAddTag?: (tag: string) => void;
   selectedImage?: any;
   onImageSelect?: (image: any) => void;
}

// eslint-disable-next-line complexity
export function AITools({ content, onContentChange, onTitleChange, onAddTag, selectedImage: propSelectedImage, onImageSelect }: AIToolsProps) {
    const [suggestedTags, setSuggestedTags] = useState<string[]>([
      "Technology", "AI", "Web Development", "Next.js", "React", "JavaScript"
    ]);
    const [aiSummary, setAiSummary] = useState("");
    const [seoScore, setSeoScore] = useState(75);
    const [loading, setLoading] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<any>(propSelectedImage || null);
    const [imagePickerOpen, setImagePickerOpen] = useState(false);

    // Sync with prop changes
    useEffect(() => {
      if (propSelectedImage !== undefined && propSelectedImage !== selectedImage) {
        setSelectedImage(propSelectedImage);
      }
    }, [propSelectedImage, selectedImage]);

   const callAI = async (operation: string) => {
     console.log("Calling AI with operation:", operation, "content length:", content?.length, "content preview:", content?.substring(0, 50));
     setLoading(operation);
     try {
       const response = await fetch("/api/ai", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ operation, content }),
       });
       const data = await response.json();
       if (data.error) throw new Error(data.error);
       return data.result;
     } catch (error) {
       console.error("AI call failed:", error);
       return null;
     } finally {
       setLoading(null);
     }
   };

   const handleSuggestHeadline = async () => {
     const result = await callAI("suggest-headline");
     if (result) onTitleChange(result.trim());
   };

   const handleFixGrammar = async () => {
     const result = await callAI("fix-grammar");
     if (result) onContentChange(result);
   };

   const handleGenerateSummary = async () => {
     const result = await callAI("generate-summary");
     if (result) setAiSummary(result);
   };

   const handleSuggestTags = async () => {
     const result = await callAI("suggest-tags");
     if (result) {
       const tags = result.split(",").map((tag: string) => tag.trim()).filter(Boolean);
       setSuggestedTags(tags);
     }
   };

   const handleImproveSEO = async () => {
     const result = await callAI("improve-seo");
     if (result) {
       // For now, just increase the score. In a real app, you'd parse the suggestions
       setSeoScore(Math.min(100, seoScore + 10));
     }
   };

  return (
    <div className="space-y-6">
      {/* Writing Assistant */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AI Writing Assistant
          </CardTitle>
          <CardDescription>Enhance your writing with AI-powered tools</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={handleSuggestHeadline}
              disabled={loading === "suggest-headline" || !content || content.trim().length === 0}
              className="flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              {loading === "suggest-headline" ? "Processing..." : "Suggest Headline"}
            </Button>
            <Button
              variant="outline"
              onClick={handleFixGrammar}
              disabled={loading === "fix-grammar" || !content || content.trim().length === 0}
              className="flex items-center gap-2"
            >
              <SpellCheck className="h-4 w-4" />
              {loading === "fix-grammar" ? "Processing..." : "Fix Grammar"}
            </Button>
            <Button
              variant="outline"
              onClick={handleGenerateSummary}
              disabled={loading === "generate-summary" || !content || content.trim().length === 0}
              className="flex items-center gap-2"
            >
              <FileSearch className="h-4 w-4" />
              {loading === "generate-summary" ? "Processing..." : "Generate Summary"}
            </Button>
            <Button
              variant="outline"
              onClick={handleImproveSEO}
              disabled={loading === "improve-seo" || !content || content.trim().length === 0}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              {loading === "improve-seo" ? "Processing..." : "Improve SEO"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Summary */}
      {aiSummary && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              AI-Generated Summary (TL;DR)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{aiSummary}</p>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Suggested Tags
          </CardTitle>
          <CardDescription>AI-recommended tags for your content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {suggestedTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => onAddTag?.(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSuggestTags}
            disabled={loading === "suggest-tags" || !content || content.trim().length === 0}
            className="mt-3 w-full"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {loading === "suggest-tags" ? "Processing..." : "Refresh Suggestions"}
          </Button>
        </CardContent>
      </Card>

      {/* SEO Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            SEO Insights
          </CardTitle>
          <CardDescription>Optimize your content for search engines</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>SEO Score: {seoScore}/100</Label>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${seoScore}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Eye className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Good keyword density</p>
                <p className="text-xs text-muted-foreground">Your content contains relevant keywords naturally</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Increase content length</p>
                <p className="text-xs text-muted-foreground">Add 200+ words for better engagement</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Tag className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Well-tagged</p>
                <p className="text-xs text-muted-foreground">Using 4 relevant tags</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unsplash Image Picker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Featured Image
          </CardTitle>
          <CardDescription>Choose a beautiful image from Unsplash for your blog post</CardDescription>
        </CardHeader>
        <CardContent>
          {selectedImage ? (
            <div className="space-y-4">
              <div className="relative">
                <Image
                  src={selectedImage.thumb}
                  alt={selectedImage.alt}
                  className="w-full h-48 object-cover rounded-lg"
                  width={600}
                  height={300}
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setSelectedImage(null);
                    onImageSelect?.(null);
                  }}
                >
                  Remove
                </Button>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Photo by {selectedImage.photographer}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(selectedImage.photographerUrl, '_blank')}
                >
                  View on Unsplash
                </Button>
              </div>
            </div>
          ) : (
            <Dialog open={imagePickerOpen} onOpenChange={setImagePickerOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-32 border-dashed">
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Choose from Unsplash</span>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                <DialogTitle>Choose Image</DialogTitle>
                <UnsplashImagePicker
                  onImageSelect={(image) => {
                    setSelectedImage(image);
                    onImageSelect?.(image);
                    setImagePickerOpen(false);
                  }}
                  onClose={() => setImagePickerOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </div>
  );
}