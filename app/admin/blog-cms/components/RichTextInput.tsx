"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useInput } from "ra-core";
import { InputProps } from "react-admin";
import { ResizableImage } from "./ResizableImage";

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div
      className="blog-editor-menubar"
      style={{
        borderBottom: "1px solid #e0e0e0",
        padding: "8px",
        display: "flex",
        flexWrap: "wrap",
        gap: "4px",
        backgroundColor: "#f9f9f9",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
        style={{
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: editor.isActive("bold") ? "#e0e0e0" : "white",
          cursor: "pointer",
        }}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
        style={{
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: editor.isActive("italic") ? "#e0e0e0" : "white",
          cursor: "pointer",
        }}
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
        style={{
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: editor.isActive("strike") ? "#e0e0e0" : "white",
          cursor: "pointer",
        }}
      >
        Strike
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive("code") ? "is-active" : ""}
        style={{
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: editor.isActive("code") ? "#e0e0e0" : "white",
          cursor: "pointer",
        }}
      >
        Code
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        style={{
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: "white",
          cursor: "pointer",
        }}
      >
        Clear
      </button>
      <div style={{ width: "1px", backgroundColor: "#ccc", margin: "0 4px" }} />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
        style={{
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: editor.isActive("heading", { level: 1 })
            ? "#e0e0e0"
            : "white",
          cursor: "pointer",
        }}
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
        style={{
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: editor.isActive("heading", { level: 2 })
            ? "#e0e0e0"
            : "white",
          cursor: "pointer",
        }}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
        style={{
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: editor.isActive("heading", { level: 3 })
            ? "#e0e0e0"
            : "white",
          cursor: "pointer",
        }}
      >
        H3
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive("paragraph") ? "is-active" : ""}
        style={{
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: editor.isActive("paragraph") ? "#e0e0e0" : "white",
          cursor: "pointer",
        }}
      >
        P
      </button>
      <div style={{ width: "1px", backgroundColor: "#ccc", margin: "0 4px" }} />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
        style={{
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: editor.isActive("bulletList") ? "#e0e0e0" : "white",
          cursor: "pointer",
        }}
      >
        Bullet List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
        style={{
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: editor.isActive("orderedList") ? "#e0e0e0" : "white",
          cursor: "pointer",
        }}
      >
        Ordered List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "is-active" : ""}
        style={{
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: editor.isActive("codeBlock") ? "#e0e0e0" : "white",
          cursor: "pointer",
        }}
      >
        Code Block
      </button>
      <div style={{ width: "1px", backgroundColor: "#ccc", margin: "0 4px" }} />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
        style={{
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: editor.isActive("blockquote") ? "#e0e0e0" : "white",
          cursor: "pointer",
        }}
      >
        Blockquote
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        style={{
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: "white",
          cursor: "pointer",
        }}
      >
        HR
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        style={{
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: "white",
          cursor: "pointer",
        }}
      >
        Undo
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        style={{
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: "white",
          cursor: "pointer",
        }}
      >
        Redo
      </button>
      <div style={{ width: "1px", backgroundColor: "#ccc", margin: "0 4px" }} />
      <button
        type="button"
        onClick={() => {
          const url = window.prompt("Image URL");
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        style={{
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: "white",
          cursor: "pointer",
        }}
      >
        Add Image
      </button>
      <button
        type="button"
        onClick={() => {
          const url = window.prompt("Link URL");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={editor.isActive("link") ? "is-active" : ""}
        style={{
          padding: "4px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: editor.isActive("link") ? "#e0e0e0" : "white",
          cursor: "pointer",
        }}
      >
        Add Link
      </button>
    </div>
  );
};

export const RichTextInput = (props: InputProps) => {
  const {
    field,
    fieldState: { error },
  } = useInput(props);
  
  const [isMounted, setIsMounted] = useState(false);
  const [linkTooltip, setLinkTooltip] = useState<{
    show: boolean;
    x: number;
    y: number;
    href: string;
  }>({ show: false, x: 0, y: 0, href: "" });
  const hideTooltipTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const currentLinkRef = React.useRef<HTMLAnchorElement | null>(null);

  // Ensure component only renders on client side and force light mode
  useEffect(() => {
    setIsMounted(true);
    
    // Force light mode for rich text editor
    const root = document.documentElement;
    root.classList.remove("dark");
    const body = document.body;
    body.classList.remove("dark");
    
    // Force MUI theme to light
    const muiTheme = document.querySelector('[data-mui-color-scheme]');
    if (muiTheme) {
      muiTheme.setAttribute('data-mui-color-scheme', 'light');
    }
    
    // Also ensure the editor container has light background
    const editorContainer = document.querySelector('.ProseMirror')?.closest('div');
    if (editorContainer) {
      (editorContainer as HTMLElement).style.backgroundColor = 'white';
      (editorContainer as HTMLElement).style.color = 'black';
    }
  }, []);

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        ResizableImage.configure({
          inline: true,
          allowBase64: true,
        }),
        Link.configure({
          openOnClick: false,
        }),
      ],
      content: field.value || "",
      onUpdate: ({ editor }) => {
        field.onChange(editor.getHTML());
      },
      editorProps: {
        attributes: {
          style: "min-height: 300px; padding: 16px; outline: none;",
        },
      },
      immediatelyRender: false,
    },
    [isMounted]
  );

  // Update editor content when field value changes externally
  useEffect(() => {
    if (editor && field.value !== editor.getHTML()) {
      editor.commands.setContent(field.value || "");
    }
  }, [field.value, editor]);

  // Inject global styles for rich text editor to match website rendering
  useEffect(() => {
    const styleId = 'blog-rich-text-editor-light-mode';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .blog-rich-text-editor {
          background-color: white !important;
          color: black !important;
          display: flex;
          justify-content: center;
        }
        .blog-rich-text-editor .ProseMirror {
          background-color: white !important;
          color: black !important;
          max-width: 827px;
          width: 100%;
          margin: 0 auto;
          font-size: 1rem;
          line-height: 160%;
          letter-spacing: 0;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .blog-rich-text-editor .ProseMirror * {
          color: black !important;
        }
        .blog-rich-text-editor .ProseMirror h1,
        .blog-rich-text-editor .ProseMirror h2,
        .blog-rich-text-editor .ProseMirror h3,
        .blog-rich-text-editor .ProseMirror h4,
        .blog-rich-text-editor .ProseMirror h5,
        .blog-rich-text-editor .ProseMirror h6 {
          font-weight: 600;
          line-height: 120%;
          margin: 0;
        }
        .blog-rich-text-editor .ProseMirror h1 {
          font-size: 2rem;
        }
        .blog-rich-text-editor .ProseMirror h2 {
          font-size: 1.75rem;
        }
        .blog-rich-text-editor .ProseMirror h3 {
          font-size: 1.5rem;
        }
        .blog-rich-text-editor .ProseMirror h4 {
          font-size: 1.25rem;
        }
        .blog-rich-text-editor .ProseMirror h5,
        .blog-rich-text-editor .ProseMirror h6 {
          font-size: 1.1rem;
        }
        .blog-rich-text-editor .ProseMirror p {
          color: black !important;
          margin: 0;
        }
        .blog-rich-text-editor .ProseMirror li {
          color: black !important;
        }
        .blog-rich-text-editor .ProseMirror ul,
        .blog-rich-text-editor .ProseMirror ol {
          padding-left: 2rem;
        }
        .blog-rich-text-editor .ProseMirror blockquote {
          border-left: 4px solid #2563eb;
          padding-left: 1.5rem;
          font-style: italic;
          color: #6b7280;
          margin: 0;
        }
        .blog-rich-text-editor .ProseMirror code {
          background-color: #f3f4f6;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.9em;
          color: #1f2937;
        }
        .blog-rich-text-editor .ProseMirror pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1.5rem;
          overflow-x: auto;
        }
        .blog-rich-text-editor .ProseMirror pre code {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }
        .blog-rich-text-editor .ProseMirror strong,
        .blog-rich-text-editor .ProseMirror b {
          font-weight: 600;
        }
        .blog-rich-text-editor .ProseMirror em,
        .blog-rich-text-editor .ProseMirror i {
          font-style: italic;
        }
        .blog-rich-text-editor .ProseMirror hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 2rem 0;
        }
        .blog-rich-text-editor [data-theme="dark"],
        .blog-rich-text-editor .dark {
          background-color: white !important;
          color: black !important;
        }
        .blog-rich-text-editor .ProseMirror a {
          color: #2563eb !important;
          text-decoration: underline !important;
          text-underline-offset: 2px;
        }
        .blog-rich-text-editor .ProseMirror a:hover {
          color: #1d4ed8 !important;
        }
        .blog-rich-text-editor .ProseMirror img {
          max-width: 100%;
          height: auto;
          display: block;
        }
        .blog-rich-text-editor .ProseMirror br.ProseMirror-trailingBreak {
          display: none !important;
        }
        .blog-editor-menubar {
          position: sticky !important;
          top: 0 !important;
          z-index: 100 !important;
          background-color: #f9f9f9 !important;
        }
        .resizable-image-wrapper {
          position: relative;
          display: inline-block;
          margin: 8px 0;
        }
        .resizable-image-wrapper.selected {
          outline: 2px solid #4a90e2;
          outline-offset: 2px;
        }
        .resize-handle {
          position: absolute;
          width: 12px;
          height: 12px;
          background-color: #4a90e2;
          border: 2px solid white;
          border-radius: 2px;
          z-index: 1000;
          transition: background-color 0.2s;
        }
        .resize-handle:hover {
          background-color: #357abd;
        }
        .resize-handle:active {
          background-color: #2a5f8f;
        }
        .link-tooltip {
          position: absolute;
          background-color: #1f2937;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 1000;
          pointer-events: auto;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transform: translate(-50%, -100%);
          margin-top: -4px;
        }
        .link-tooltip button {
          background-color: #ef4444;
          color: white;
          border: none;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
          margin-left: 8px;
        }
        .link-tooltip button:hover {
          background-color: #dc2626;
        }
        .link-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-top-color: #1f2937;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Continuously ensure light mode for editor
  useEffect(() => {
    if (!isMounted || !editor) return;

    const interval = setInterval(() => {
      // Force light mode styles on ProseMirror element
      const proseMirror = document.querySelector('.blog-rich-text-editor .ProseMirror');
      if (proseMirror) {
        const pmElement = proseMirror as HTMLElement;
        pmElement.style.backgroundColor = 'white';
        pmElement.style.color = 'black';
        pmElement.classList.remove('dark');
      }

      // Force light mode on parent containers
      const editorContainers = document.querySelectorAll('.blog-rich-text-editor, [data-testid*="editor"], .tiptap-editor');
      editorContainers.forEach((container) => {
        (container as HTMLElement).style.backgroundColor = 'white';
        (container as HTMLElement).style.color = 'black';
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isMounted, editor]);

  // Handle link hover tooltip
  useEffect(() => {
    if (!isMounted || !editor) return;

    const proseMirror = document.querySelector('.blog-rich-text-editor .ProseMirror') as HTMLElement;
    if (!proseMirror) return;

    const handleMouseOver = (e: MouseEvent) => {
      // Clear any pending hide timeout
      if (hideTooltipTimeoutRef.current) {
        clearTimeout(hideTooltipTimeoutRef.current);
        hideTooltipTimeoutRef.current = null;
      }

      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link) {
        const rect = link.getBoundingClientRect();
        const tooltipContainer = document.getElementById('editor-container-with-tooltip');
        const containerRect = tooltipContainer?.getBoundingClientRect();
        
        if (containerRect) {
          currentLinkRef.current = link as HTMLAnchorElement;
          setLinkTooltip({
            show: true,
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top,
            href: link.getAttribute('href') || '',
          });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      // If we're not over a link anymore, schedule hide (unless we're going to the tooltip itself)
      if (!link) {
        if (!hideTooltipTimeoutRef.current) {
          hideTooltipTimeoutRef.current = setTimeout(() => {
            setLinkTooltip(prev => ({ ...prev, show: false }));
            currentLinkRef.current = null;
            hideTooltipTimeoutRef.current = null;
          }, 100);
        }
        return;
      }

      // When over a link, make sure any pending hide is cleared and update tooltip position
      if (hideTooltipTimeoutRef.current) {
        clearTimeout(hideTooltipTimeoutRef.current);
        hideTooltipTimeoutRef.current = null;
      }

      const rect = link.getBoundingClientRect();
      const tooltipContainer = document.getElementById('editor-container-with-tooltip');
      const containerRect = tooltipContainer?.getBoundingClientRect();

      if (containerRect) {
        setLinkTooltip(prev => ({
          ...prev,
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top,
        }));
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const relatedTarget = e.relatedTarget as HTMLElement;
      const link = target.closest('a');
      const isMovingToTooltip = relatedTarget?.closest('.link-tooltip');
      const isMovingToLink = relatedTarget?.closest('a');
      
      // Only hide if we're not moving to the tooltip or another link
      if (!isMovingToTooltip && !isMovingToLink) {
        // Add a small delay to allow moving to tooltip
        hideTooltipTimeoutRef.current = setTimeout(() => {
          setLinkTooltip(prev => ({ ...prev, show: false }));
          currentLinkRef.current = null;
        }, 100);
      }
    };

    proseMirror.addEventListener('mouseover', handleMouseOver);
    proseMirror.addEventListener('mousemove', handleMouseMove);
    proseMirror.addEventListener('mouseout', handleMouseOut);

    return () => {
      proseMirror.removeEventListener('mouseover', handleMouseOver);
      proseMirror.removeEventListener('mousemove', handleMouseMove);
      proseMirror.removeEventListener('mouseout', handleMouseOut);
      if (hideTooltipTimeoutRef.current) {
        clearTimeout(hideTooltipTimeoutRef.current);
      }
    };
  }, [isMounted, editor]);

  if (!isMounted) {
    return (
      <div>
        <label style={{ marginBottom: "8px", display: "block", fontWeight: "bold" }}>
          {props.label || "Content"}
        </label>
        <div
          style={{
            border: error ? "2px solid red" : "1px solid #ccc",
            borderRadius: "4px",
            minHeight: "300px",
            padding: "16px",
            backgroundColor: "white",
          }}
        >
          Loading editor...
        </div>
        {error && (
          <div style={{ color: "red", marginTop: "4px", fontSize: "12px" }}>
            {error.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <label style={{ marginBottom: "8px", display: "block", fontWeight: "bold" }}>
        {props.label || "Content"}
      </label>
      <div
        style={{
          border: error ? "2px solid red" : "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: "white",
          colorScheme: "light",
          // Make this the scroll container so MenuBar sticks within it
          maxHeight: "80vh",
          overflowY: "auto",
          overflowX: "hidden",
          position: "relative",
        }}
      >
        <MenuBar editor={editor} />
        <div
          id="editor-container-with-tooltip"
          style={{
            backgroundColor: "white",
            color: "black",
            display: "flex",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <EditorContent
            editor={editor}
            style={{
              minHeight: "300px",
              backgroundColor: "white",
              color: "black",
              width: "100%",
            }}
            className="blog-rich-text-editor"
          />
          {linkTooltip.show && (
            <div
              className="link-tooltip"
              style={{
                left: `${linkTooltip.x}px`,
                top: `${linkTooltip.y}px`,
              }}
              onMouseEnter={(e) => {
                e.stopPropagation();
                // Clear any pending hide timeout
                if (hideTooltipTimeoutRef.current) {
                  clearTimeout(hideTooltipTimeoutRef.current);
                  hideTooltipTimeoutRef.current = null;
                }
                setLinkTooltip(prev => ({ ...prev, show: true }));
              }}
              onMouseLeave={(e) => {
                const relatedTarget = e.relatedTarget as HTMLElement;
                const isMovingToLink = relatedTarget?.closest('a');
                if (!isMovingToLink) {
                  // Add a small delay
                  hideTooltipTimeoutRef.current = setTimeout(() => {
                    setLinkTooltip(prev => ({ ...prev, show: false }));
                  }, 100);
                }
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (editor && currentLinkRef.current) {
                    const link = currentLinkRef.current;
                    
                    // Get positions using TipTap's view API
                    try {
                      const startPos = editor.view.posAtDOM(link, 0);
                      const endPos = editor.view.posAtDOM(link, -1);
                      
                      // Use transaction to directly unset the link
                      editor.chain()
                        .setTextSelection({ from: startPos, to: endPos })
                        .unsetLink()
                        .run();
                    } catch (err) {
                      // Fallback: select link via DOM and unset
                      const range = document.createRange();
                      range.selectNodeContents(link);
                      const selection = window.getSelection();
                      if (selection) {
                        selection.removeAllRanges();
                        selection.addRange(range);
                      }
                      
                      // Use requestAnimationFrame to ensure selection is processed
                      requestAnimationFrame(() => {
                        editor.chain()
                          .focus()
                          .extendMarkRange('link')
                          .unsetLink()
                          .run();
                      });
                    }
                  }
                  setLinkTooltip(prev => ({ ...prev, show: false }));
                  currentLinkRef.current = null;
                }}
              >
                Unlink
              </button>
            </div>
          )}
        </div>
      </div>
      {error && (
        <div style={{ color: "red", marginTop: "4px", fontSize: "12px" }}>
          {error.message}
        </div>
      )}
    </div>
  );
};

