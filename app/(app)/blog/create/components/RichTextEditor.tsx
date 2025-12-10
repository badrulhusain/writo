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
import { useEffect, useRef } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const lastHtmlRef = useRef(content);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg border border-border max-w-full h-auto",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-4",
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: placeholder || "Write something...",
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
      }),
      TextStyle,
      Color,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastHtmlRef.current = html;
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: "min-h-[400px] w-full rounded-b-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none focus:outline-none [&_ol]:list-decimal [&_ul]:list-disc [&_li]:ml-4 [&_h1]:text-4xl [&_h2]:text-3xl [&_h3]:text-2xl [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold",
      },
    },
  });

  // Update editor content if content prop changes externally (e.g. AI tools)
  useEffect(() => {
    if (editor && content !== lastHtmlRef.current) {
       editor.commands.setContent(content);
       lastHtmlRef.current = content;
    }
  }, [content, editor]);

  return (
    <div className="flex flex-col w-full border border-input rounded-md shadow-sm focus-within:ring-1 focus-within:ring-ring">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
