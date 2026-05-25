import { Mark, mergeAttributes } from "@tiptap/core";

export const UnderlineMark = Mark.create({
  name: "underline",

  parseHTML() {
    return [
      { tag: "u" },
      {
        style: "text-decoration",
        getAttrs: (value) =>
          typeof value === "string" && value.includes("underline")
            ? {}
            : false,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["u", mergeAttributes(HTMLAttributes), 0];
  },

  addKeyboardShortcuts() {
    return {
      "Mod-u": () => this.editor.commands.toggleMark(this.name),
    };
  },
});
