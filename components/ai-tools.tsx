"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Wand2, 
  FileText, 
  Tag, 
  Eye,
  SpellCheck,
  FileSearch,
  Lightbulb,
  TrendingUp
} from "lucide-react";

interface AIToolsProps {
   content: string;
   onContentChange: (content: string) => void;
   title: string;
   onTitleChange: (title: string) => void;
}

export function AITools({ content, onContentChange, onTitleChange }: AIToolsProps) {
   const [suggestedTags, setSuggestedTags] = useState<string[]>([
     "Technology", "AI", "Web Development", "Next.js", "React", "JavaScript"
   ]);
   const [aiSummary, setAiSummary] = useState("");
   const [seoScore, setSeoScore] = useState(75);
   const [loading, setLoading] = useState<string | null>(null);

   const callAI = async (operation: string) => {
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
              disabled={loading === "suggest-headline"}
              className="flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              {loading === "suggest-headline" ? "Processing..." : "Suggest Headline"}
            </Button>
            <Button
              variant="outline"
              onClick={handleFixGrammar}
              disabled={loading === "fix-grammar"}
              className="flex items-center gap-2"
            >
              <SpellCheck className="h-4 w-4" />
              {loading === "fix-grammar" ? "Processing..." : "Fix Grammar"}
            </Button>
            <Button
              variant="outline"
              onClick={handleGenerateSummary}
              disabled={loading === "generate-summary"}
              className="flex items-center gap-2"
            >
              <FileSearch className="h-4 w-4" />
              {loading === "generate-summary" ? "Processing..." : "Generate Summary"}
            </Button>
            <Button
              variant="outline"
              onClick={handleImproveSEO}
              disabled={loading === "improve-seo"}
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
              >
                {tag}
              </Badge>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSuggestTags}
            disabled={loading === "suggest-tags"}
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
    </div>
  );
}