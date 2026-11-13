"use client"

import { sql } from "@codemirror/lang-sql"
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
  ".cm-selectionBackground, ::selection": { backgroundColor: "var(--accent-dim) !important" },
  "&.cm-focused .cm-selectionBackground": { backgroundColor: "var(--accent-dim) !important" },
  ".cm-cursor": { borderColor: "var(--accent)" },
})

export function SqlEditorBox({
  value,
  onChange,
  disabled,
  placeholder = "-- Écris ta requête SQL ici",
}: {
  value: string
  onChange: (v: string) => void
  disabled: boolean
  placeholder?: string
}) {
  const { resolvedTheme } = useTheme()
  return (
    <div className="overflow-hidden rounded-md border border-[var(--border)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-2)] px-3 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-2)]">SQL</span>
        <span className="font-mono text-[10px] text-[var(--fg-3)]">{value.split("\n").length} ligne{value.split("\n").length > 1 ? "s" : ""}</span>
      </div>
      <CodeMirror
        value={value}
        height="200px"
        theme={resolvedTheme === "light" ? "light" : "dark"}
        editable={!disabled}
        extensions={[sql(), baseTheme]}
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
