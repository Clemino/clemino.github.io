import type { ComponentProps } from "react"

export const mdxComponents = {
  h1: (props: ComponentProps<"h1">) => <h1 className="mb-6 font-mono text-3xl tracking-tight" {...props} />,
  h2: (props: ComponentProps<"h2">) => (
    <h2 className="mb-3 mt-10 border-b border-[var(--border)] pb-2 font-mono text-xl tracking-tight" {...props} />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3 className="mb-2 mt-6 font-mono text-base font-medium" {...props} />
  ),
  p: (props: ComponentProps<"p">) => <p className="my-4 text-[15px] leading-relaxed text-[var(--fg-1)]" {...props} />,
  ul: (props: ComponentProps<"ul">) => <ul className="my-4 list-disc space-y-1 pl-5 text-[15px] text-[var(--fg-1)]" {...props} />,
  ol: (props: ComponentProps<"ol">) => <ol className="my-4 list-decimal space-y-1 pl-5 text-[15px] text-[var(--fg-1)]" {...props} />,
  li: (props: ComponentProps<"li">) => <li className="leading-relaxed" {...props} />,
  code: (props: ComponentProps<"code">) => (
    <code
      className="rounded-[3px] bg-[var(--bg-2)] px-1.5 py-0.5 font-mono text-[13px] text-[var(--fg-0)]"
      {...props}
    />
  ),
  pre: (props: ComponentProps<"pre">) => (
    <pre
      className="my-4 overflow-x-auto rounded-md border border-[var(--border)] bg-[var(--bg-1)] p-4 font-mono text-[13px] leading-relaxed"
      {...props}
    />
  ),
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote
      className="my-6 border-l-2 border-[var(--accent)] bg-[var(--bg-1)] px-4 py-3 text-[15px] text-[var(--fg-1)]"
      {...props}
    />
  ),
  table: (props: ComponentProps<"table">) => (
    <div className="my-6 overflow-x-auto rounded-md border border-[var(--border)]">
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  th: (props: ComponentProps<"th">) => (
    <th
      className="border-b border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-left font-mono text-xs font-medium uppercase tracking-wide"
      {...props}
    />
  ),
  td: (props: ComponentProps<"td">) => <td className="border-b border-[var(--border)] px-3 py-2" {...props} />,
  strong: (props: ComponentProps<"strong">) => <strong className="font-semibold text-[var(--fg-0)]" {...props} />,
  em: (props: ComponentProps<"em">) => <em className="italic text-[var(--fg-0)]" {...props} />,
  hr: () => <hr className="my-8 border-[var(--border)]" />,
}
