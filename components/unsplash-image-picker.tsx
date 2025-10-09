"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Image as ImageIcon,
  Download,
  ExternalLink,
  X
} from "lucide-react";

interface UnsplashImage {
  id: string;
  url: string;
  thumb: string;
  full: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
  downloadUrl: string;
}

interface UnsplashImagePickerProps {
  onImageSelect?: (image: UnsplashImage) => void;
  selectedImage?: UnsplashImage | null;
  onClose?: () => void;
}

export function UnsplashImagePicker({ onImageSelect, selectedImage, onClose }: UnsplashImagePickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImageState, setSelectedImageState] = useState<UnsplashImage | null>(selectedImage || null);

  const searchImages = async (query: string = "nature") => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/unsplash?query=${encodeURIComponent(query)}&per_page=20`);
      if (response.ok) {
        const data = await response.json();
        setImages(data.images);
      } else {
        console.error("Failed to fetch images");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchImages(searchQuery);
  };

  const handleImageSelect = (image: UnsplashImage) => {
    setSelectedImageState(image);
    onImageSelect?.(image);
  };

  const handleDownload = async (image: UnsplashImage) => {
    try {
      // Trigger download through Unsplash API
      await fetch(image.downloadUrl, { method: 'GET' });
      // In a real app, you might want to download the image to your server
      // For now, we'll just copy the URL
      navigator.clipboard.writeText(image.url);
      alert("Image URL copied to clipboard!");
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Unsplash Image Picker
            </CardTitle>
            <CardDescription>Search and select high-quality images for your blog post</CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search for images (e.g., nature, technology, business)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>

        {/* Selected Image Preview */}
        {selectedImageState && (
          <div className="border rounded-lg p-4 bg-muted/50">
            <h4 className="font-medium mb-2">Selected Image:</h4>
            <div className="flex items-center gap-4">
              <img
                src={selectedImageState.thumb}
                alt={selectedImageState.alt}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{selectedImageState.alt}</p>
                <p className="text-xs text-muted-foreground">
                  Photo by <a
                    href={selectedImageState.photographerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {selectedImageState.photographer}
                  </a>
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(selectedImageState)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(selectedImageState.photographerUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Image Grid */}
        {loading ? (
          <div className="text-center py-8">Loading images...</div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                  selectedImageState?.id === image.id
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-transparent hover:border-primary/50'
                }`}
                onClick={() => handleImageSelect(image)}
              >
                <img
                  src={image.thumb}
                  alt={image.alt}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-white text-xs truncate">
                    Photo by {image.photographer}
                  </p>
                </div>
                {selectedImageState?.id === image.id && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-primary text-primary-foreground">
                      Selected
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Search for images to get started
          </div>
        )}

        {/* Popular Searches */}
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Popular searches:</h4>
          <div className="flex flex-wrap gap-2">
            {["nature", "technology", "business", "art", "food", "travel", "people", "architecture"].map((term) => (
              <Button
                key={term}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery(term);
                  searchImages(term);
                }}
              >
                {term}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}