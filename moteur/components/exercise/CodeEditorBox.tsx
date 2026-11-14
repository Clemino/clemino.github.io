"use client"

import { cpp } from "@codemirror/lang-cpp"
import { EditorView } from "@codemirror/view"
import CodeMirror from "@uiw/react-codemirror"
import { useTheme } from "next-themes"

const baseTheme = EditorView.theme({
  "&": {
    backgroundColor: "var(--bg-1)",
    color: "var(--fg-0)",
    fontFamily: "var(--font-mono)",
    fontSize: "13px",
  },
  ".cm-content": { caretColor: "var(--accent)" },
  ".cm-gutters": {
    backgroundColor: "var(--bg-1)",
    color: "var(--fg-3)",
    borderRight: "1px solid var(--border)",
  },
  ".cm-activeLine": { backgroundColor: "transparent" },
  ".cm-activeLineGutter": { backgroundColor: "transparent" },
  ".cm-selectionBackground, ::selection": {
    backgroundColor: "var(--accent-dim) !important",
  },
  "&.cm-focused .cm-selectionBackground": {
    backgroundColor: "var(--accent-dim) !important",
  },
  ".cm-cursor": { borderColor: "var(--accent)" },
})

export function CodeEditorBox({
  value,
  onChange,
  disabled,
  readOnly = false,
  height = "260px",
  placeholder = "// Écris ton code ici",
}: {
  value: string
  onChange: (v: string) => void
  disabled: boolean
  readOnly?: boolean
  height?: string
  placeholder?: string
}) {
  const { resolvedTheme } = useTheme()
  const lines = value.split("\n").length
  return (
    <div className="overflow-hidden rounded-md border border-[var(--border)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-2)] px-3 py-1.5">
        <span className="font-mono text-[10px] tracking-wider text-[var(--fg-2)] uppercase">
          Code
        </span>
        <span className="font-mono text-[10px] text-[var(--fg-3)]">
          {lines} ligne{lines > 1 ? "s" : ""}
        </span>
      </div>
      <CodeMirror
        value={value}
        height={height}
        theme={resolvedTheme === "light" ? "light" : "dark"}
        editable={!disabled && !readOnly}
        readOnly={readOnly}
        extensions={[cpp(), baseTheme]}
        onChange={(v) => onChange(v)}
        placeholder={placeholder}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: false,
          highlightActiveLine: false,
          foldGutter: false,
          tabSize: 2,
        }}
      />
    </div>
  )
}
