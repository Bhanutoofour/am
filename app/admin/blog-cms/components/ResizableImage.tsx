import Image from "@tiptap/extension-image";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import React, { useEffect, useRef, useState } from "react";

interface ResizableImageProps {
  node: ProseMirrorNode;
  updateAttributes: (attrs: Record<string, any>) => void;
  selected: boolean;
  editor: any;
  getPos: (() => number | undefined) | undefined;
}

function ResizableImageComponent({
  node,
  updateAttributes,
  selected,
  editor,
  getPos,
}: ResizableImageProps): React.ReactElement {
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });

  // Parse width and height from style attribute or node attributes
  const getCurrentSize = () => {
    const style = node.attrs.style || "";
    const widthMatch = style.match(/width:\s*(\d+)px/);
    const heightMatch = style.match(/height:\s*(\d+)px/);
    
    const width = widthMatch ? parseInt(widthMatch[1]) : (imgRef.current?.naturalWidth || 500);
    const height = heightMatch ? parseInt(heightMatch[1]) : (imgRef.current?.naturalHeight || 300);
    
    return { width, height };
  };

  const [size, setSize] = useState(getCurrentSize());

  useEffect(() => {
    if (imgRef.current) {
      const currentSize = getCurrentSize();
      setSize(currentSize);
    }
  }, [node.attrs.style]);

  const handleMouseDown = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    
    const rect = imgRef.current?.getBoundingClientRect();
    if (rect) {
      setStartPos({ x: e.clientX, y: e.clientY });
      setStartSize({ width: rect.width, height: rect.height });
    }
  };

  useEffect(() => {
    if (!isResizing || !resizeHandle) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!imgRef.current) return;

      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;

      let newWidth = startSize.width;
      let newHeight = startSize.height;

      switch (resizeHandle) {
        case "nw": // top-left
          newWidth = Math.max(50, startSize.width - deltaX);
          newHeight = Math.max(50, startSize.height - deltaY);
          break;
        case "ne": // top-right
          newWidth = Math.max(50, startSize.width + deltaX);
          newHeight = Math.max(50, startSize.height - deltaY);
          break;
        case "sw": // bottom-left
          newWidth = Math.max(50, startSize.width - deltaX);
          newHeight = Math.max(50, startSize.height + deltaY);
          break;
        case "se": // bottom-right
          newWidth = Math.max(50, startSize.width + deltaX);
          newHeight = Math.max(50, startSize.height + deltaY);
          break;
        case "n": // top
          newHeight = Math.max(50, startSize.height - deltaY);
          break;
        case "s": // bottom
          newHeight = Math.max(50, startSize.height + deltaY);
          break;
        case "w": // left
          newWidth = Math.max(50, startSize.width - deltaX);
          break;
        case "e": // right
          newWidth = Math.max(50, startSize.width + deltaX);
          break;
      }

      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      if (resizeHandle) {
        // Update the node attributes with new size as inline style
        const style = `width: ${size.width}px; height: ${size.height}px;`;
        updateAttributes({ style });
      }
      setIsResizing(false);
      setResizeHandle(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, resizeHandle, startPos, startSize, size, updateAttributes]);

  const handles = ["nw", "ne", "sw", "se", "n", "s", "w", "e"];
  const handlePositions: Record<string, { top?: string; bottom?: string; left?: string; right?: string; cursor: string; transform?: string }> = {
    nw: { top: "-6px", left: "-6px", cursor: "nwse-resize" },
    ne: { top: "-6px", right: "-6px", cursor: "nesw-resize" },
    sw: { bottom: "-6px", left: "-6px", cursor: "nesw-resize" },
    se: { bottom: "-6px", right: "-6px", cursor: "nwse-resize" },
    n: { top: "-6px", left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" },
    s: { bottom: "-6px", left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" },
    w: { top: "50%", left: "-6px", transform: "translateY(-50%)", cursor: "ew-resize" },
    e: { top: "50%", right: "-6px", transform: "translateY(-50%)", cursor: "ew-resize" },
  };

  return (
    <NodeViewWrapper
      ref={containerRef}
      className={`resizable-image-wrapper ${selected ? "selected" : ""}`}
      style={{ display: "inline-block", position: "relative", margin: "8px 0" }}
    >
      <img
        ref={imgRef}
        src={node.attrs.src}
        alt={node.attrs.alt || ""}
        style={{
          width: `${size.width}px`,
          height: `${size.height}px`,
          maxWidth: "100%",
          display: "block",
          userSelect: "none",
          cursor: selected ? "default" : "pointer",
        }}
        draggable={false}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // Select the image node when clicked
          if (typeof getPos === "function" && editor) {
            const pos = getPos();
            if (pos !== undefined && pos !== null) {
              editor.commands.setTextSelection(pos);
              editor.commands.setNodeSelection(pos);
            }
          }
        }}
        onLoad={() => {
          // Update size when image loads if no style is set
          if (!node.attrs.style && imgRef.current) {
            const naturalWidth = imgRef.current.naturalWidth;
            const naturalHeight = imgRef.current.naturalHeight;
            if (naturalWidth && naturalHeight) {
              setSize({ width: naturalWidth, height: naturalHeight });
            }
          }
        }}
      />
      {selected && (
        <>
          {handles.map((handle) => (
            <div
              key={handle}
              className={`resize-handle resize-handle-${handle}`}
              onMouseDown={(e) => handleMouseDown(e, handle)}
              style={{
                position: "absolute",
                width: "12px",
                height: "12px",
                backgroundColor: "#4a90e2",
                border: "2px solid white",
                borderRadius: "2px",
                zIndex: 1000,
                ...handlePositions[handle],
              }}
            />
          ))}
          {/* Size Display */}
          <div
            style={{
              position: "absolute",
              bottom: "-30px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "white",
              padding: "4px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              fontWeight: "500",
            }}
          >
            {size.width} × {size.height}px
          </div>
        </>
      )}
    </NodeViewWrapper>
  );
}

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          if (!attributes.style) {
            return {};
          }
          return {
            style: attributes.style,
          };
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer((props) => {
      const [selected, setSelected] = useState(false);

      useEffect(() => {
        const updateSelection = () => {
          const { selection } = props.editor.state;
          const pos = typeof props.getPos === "function" ? props.getPos() : undefined;
          
          // Check if the image node is selected
          if (pos !== undefined && pos !== null) {
            const { from, to } = selection;
            const nodeSize = props.node.nodeSize;
            // Image is selected if selection includes the node position
            const isSelected = from <= pos && to >= pos + nodeSize;
            
            setSelected(isSelected);
          } else {
            setSelected(false);
          }
        };

        props.editor.on("selectionUpdate", updateSelection);
        props.editor.on("transaction", updateSelection);
        updateSelection();

        return () => {
          props.editor.off("selectionUpdate", updateSelection);
          props.editor.off("transaction", updateSelection);
        };
      }, [props.editor, props.getPos, props.node]);

      const updateAttributes = (attrs: Record<string, any>) => {
        const pos = typeof props.getPos === "function" ? props.getPos() : null;
        if (pos !== null) {
          props.editor.commands.updateAttributes("image", attrs);
        }
      };

      return (
        <ResizableImageComponent
          node={props.node}
          updateAttributes={updateAttributes}
          selected={selected}
          editor={props.editor}
          getPos={props.getPos}
        />
      );
    });
  },
});

