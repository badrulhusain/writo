"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube,
  Undo,
  Redo,
  RemoveFormatting,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";

interface EditorToolbarProps {
  editor: Editor | null;
}

// eslint-disable-next-line complexity
export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isYoutubeDialogOpen, setIsYoutubeDialogOpen] = useState(false);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setIsLinkDialogOpen(false);
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setIsImageDialogOpen(false);
    }
  };

  const addYoutube = () => {
    if (youtubeUrl) {
      editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();
      setYoutubeUrl("");
      setIsYoutubeDialogOpen(false);
    }
  };

  return (
    <div className="border border-input bg-transparent rounded-t-md p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Formatting */}
      <Button
        variant={editor.isActive("bold") ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        aria-label="Toggle bold"
        className="h-8 w-8 p-0"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("italic") ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Toggle italic"
        className="h-8 w-8 p-0"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("underline") ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        aria-label="Toggle underline"
        className="h-8 w-8 p-0"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("strike") ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        aria-label="Toggle strikethrough"
        className="h-8 w-8 p-0"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("code") ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        aria-label="Toggle code"
        className="h-8 w-8 p-0"
      >
        <Code className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Headings */}
      <Button
        variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        aria-label="Heading 1"
        className="h-8 w-8 p-0"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        aria-label="Heading 2"
        className="h-8 w-8 p-0"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        aria-label="Heading 3"
        className="h-8 w-8 p-0"
      >
        <Heading3 className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Lists */}
      <Button
        variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Bullet list"
        className="h-8 w-8 p-0"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Ordered list"
        className="h-8 w-8 p-0"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Alignment */}
      <Button
        variant={editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        aria-label="Align left"
        className="h-8 w-8 p-0"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        aria-label="Align center"
        className="h-8 w-8 p-0"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        aria-label="Align right"
        className="h-8 w-8 p-0"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive({ textAlign: "justify" }) ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        aria-label="Justify"
        className="h-8 w-8 p-0"
      >
        <AlignJustify className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Media & Links */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <LinkIcon className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={setLink}>Add Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ImageIcon className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={addImage}>Add Image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isYoutubeDialogOpen} onOpenChange={setIsYoutubeDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Youtube className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add YouTube Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Video URL</Label>
            <Input
              placeholder="https://youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={addYoutube}>Add Video</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Utils */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="h-8 w-8 p-0"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="h-8 w-8 p-0"
      >
        <Redo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        className="h-8 w-8 p-0"
      >
        <RemoveFormatting className="h-4 w-4" />
      </Button>
    </div>
  );
}
