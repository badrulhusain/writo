"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShareButtonProps {
  title: string;
  url: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const shareUrl = typeof window !== 'undefined' ? window.location.origin + url : url;

  const handleShare = async (platform: string) => {
    const fullUrl = shareUrl;
    const text = `${title} - Read more on Writo`;

    try {
      if (navigator.share) {
        // Use Web Share API if available
        await navigator.share({
          title,
          text,
          url: fullUrl,
        });
      } else {
        // Fallback to specific platforms
        let shareUrl = '';
        switch (platform) {
          case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(fullUrl)}`;
            break;
          case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
            break;
          case 'linkedin':
            shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}`;
            break;
          default:
            // Copy to clipboard
            await navigator.clipboard.writeText(fullUrl);
            alert('Link copied to clipboard!');
            return;
        }
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(fullUrl);
        alert('Link copied to clipboard!');
      } catch (copyError) {
        console.error('Error copying to clipboard:', copyError);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Share2 className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleShare('twitter')}>
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('facebook')}>
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('linkedin')}>
          Share on LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('copy')}>
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}