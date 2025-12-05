"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { EditorToolbar } from "./EditorToolbar";
import { useEffect } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing your amazing blog post...",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
      Youtube.configure({
        controls: false,
      }),
      TextStyle,
      Color,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-4",
      },
    },
  });

  // Update editor content if content prop changes externally (e.g. initial load)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // Only update if the content is different to avoid cursor jumping
      // This is a simple check, for a real-time collab you'd need more robust diffing
      if (editor.getText() === "" && content === "") return;
      // editor.commands.setContent(content); 
      // Note: Setting content on every prop change can be tricky with cursor position.
      // For this use case (blog post creation), usually one-way binding is sufficient after initial load.
      // But if we want to support "reset" or "load draft", we might need it.
    }
  }, [content, editor]);

  return (
    <div className="border rounded-md shadow-sm bg-card">
      <EditorToolbar editor={editor} />
      <div className="bg-background min-h-[500px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
