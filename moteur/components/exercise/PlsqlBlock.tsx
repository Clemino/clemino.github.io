"use client"

import { SqlEditorBox } from "./SqlEditorBox"

export function PlsqlBlock({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled: boolean }) {
  return (
    <SqlEditorBox
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder="-- Écris ton bloc PL/SQL : CREATE OR REPLACE ... BEGIN ... END;"
    />
  )
}
