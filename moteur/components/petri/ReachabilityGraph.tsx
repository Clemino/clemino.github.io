"use client"

export function ReachabilityGraph({
  nodes,
  edges,
}: {
  nodes: Array<{ id: string; label: string; marking: Record<string, number>; x?: number; y?: number }>
  edges: Array<{ from: string; to: string; transitionId: string }>
}) {
  const laidOut = nodes.map((node, index) => ({
    ...node,
    x: node.x ?? 110 + (index % 3) * 220,
    y: node.y ?? 90 + Math.floor(index / 3) * 120,
  }))
  const byId = new Map(laidOut.map((node) => [node.id, node]))

  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--bg-0)] p-3">
      <svg viewBox="0 0 720 360" role="img" aria-label="Graphe des marquages accessibles" className="h-auto w-full">
        <defs>
          <marker id="reach-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="var(--fg-2)" />
          </marker>
        </defs>
        {edges.map((edge, index) => {
          const from = byId.get(edge.from)
          const to = byId.get(edge.to)
          if (!from || !to) return null
          const dx = to.x - from.x
          const dy = to.y - from.y
          const length = Math.hypot(dx, dy) || 1
          const x1 = from.x + (dx / length) * 42
          const y1 = from.y + (dy / length) * 42
          const x2 = to.x - (dx / length) * 42
          const y2 = to.y - (dy / length) * 42
          return (
            <g key={`${edge.from}-${edge.to}-${edge.transitionId}-${index}`}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--fg-2)" strokeWidth="2" markerEnd="url(#reach-arrow)" />
              <text x={(x1 + x2) / 2 + 5} y={(y1 + y2) / 2 - 5} className="fill-[var(--accent)] font-mono text-[13px]">
                {edge.transitionId}
              </text>
            </g>
          )
        })}
        {laidOut.map((node) => (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="42" fill="var(--bg-1)" stroke="var(--border-strong)" strokeWidth="2" />
            <text x={node.x} y={node.y - 5} textAnchor="middle" className="fill-[var(--fg-0)] font-mono text-[13px]">
              {node.label}
            </text>
            <text x={node.x} y={node.y + 13} textAnchor="middle" className="fill-[var(--fg-2)] font-mono text-[11px]">
              ({Object.values(node.marking).join(",")})
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
