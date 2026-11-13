/**
 * FigureSpec — the shared, `kind`-discriminated description of a visual figure.
 *
 * Exercise content (JSON payloads) and the figure components both depend on
 * these types. Each variant carries exactly the data its figure needs to
 * render. Keep this file free of React imports — it is pure data.
 */

import type { Candle } from "@/lib/ohlc"

/* ── game-tree ────────────────────────────────────────────────────────── */

/**
 * A node of a two-player game tree (minimax / alpha-beta).
 * `value` is OPTIONAL on internal `max`/`min` nodes so that an ALGO_TRACE
 * exercise can hide them for the student to fill in. Leaf nodes normally
 * carry a value.
 */
export type GameTreeNode = {
  type: "max" | "min" | "leaf"
  value?: number
  label?: string
  children?: GameTreeNode[]
}

/* ── search-tree ──────────────────────────────────────────────────────── */

/** A labelled state in a state-space search graph, optionally with g/h costs. */
export type SearchNode = {
  id: string
  label: string
  /** Cost from the start node. */
  g?: number
  /** Heuristic estimate to a goal. */
  h?: number
}

/** A directed edge between two search nodes, optionally with a step cost. */
export type SearchEdge = {
  from: string
  to: string
  cost?: number
}

/* ── decision-tree ────────────────────────────────────────────────────── */

/**
 * A node of a decision tree.
 * - `attribute`: an internal node — `label` is the tested attribute; its
 *   `branches` are keyed by attribute value.
 * - `leaf`: `label` is the predicted class.
 */
export type DecisionTreeNode = {
  type: "attribute" | "leaf"
  label: string
  branches?: { edgeLabel: string; child: DecisionTreeNode }[]
}

/* ── nn-diagram ───────────────────────────────────────────────────────── */

/** One layer of a feed-forward neural network. */
export type NnLayer = {
  neurons: number
  label?: string
  role?: "input" | "hidden" | "output"
}

/* ── training-curve ───────────────────────────────────────────────────── */

/** One plotted series of a training curve. */
export type CurveSeries = {
  label: string
  points: { x: number; y: number }[]
  tone?: "accent" | "info" | "warning" | "error" | "success"
}

/* ── grid-world ───────────────────────────────────────────────────────── */

/** One cell of a reinforcement-learning grid world. */
export type GridCell = {
  row: number
  col: number
  reward?: number
  wall?: boolean
  terminal?: boolean
  start?: boolean
  label?: string
  policy?: "up" | "down" | "left" | "right"
}

/* ── candlestick ──────────────────────────────────────────────────────── */

/** A line drawn over the candles (e.g. a moving average); `null` where undefined. */
export type ChartOverlay = {
  label: string
  values: (number | null)[]
  tone?: "accent" | "info" | "warning" | "error" | "success"
}

/** A horizontal price level (support, resistance, stop…). */
export type ChartLevel = {
  price: number
  label?: string
  tone?: "accent" | "info" | "warning" | "error" | "success"
}

/* ── the discriminated union ──────────────────────────────────────────── */

export type FigureSpec =
  | { kind: "game-tree"; root: GameTreeNode; caption?: string }
  | {
      kind: "search-tree"
      nodes: SearchNode[]
      edges: SearchEdge[]
      startId?: string
      goalIds?: string[]
      caption?: string
    }
  | { kind: "decision-tree"; root: DecisionTreeNode; caption?: string }
  | {
      kind: "data-table"
      columns: string[]
      rows: (string | number)[][]
      highlightRows?: number[]
      highlightCols?: number[]
      caption?: string
    }
  | { kind: "confusion-matrix"; classes: string[]; matrix: number[][]; caption?: string }
  | { kind: "nn-diagram"; layers: NnLayer[]; caption?: string }
  | {
      kind: "training-curve"
      series: CurveSeries[]
      xLabel?: string
      yLabel?: string
      caption?: string
    }
  | { kind: "grid-world"; rows: number; cols: number; cells: GridCell[]; caption?: string }
  | {
      kind: "candlestick"
      candles: Candle[]
      overlays?: ChartOverlay[]
      levels?: ChartLevel[]
      showVolume?: boolean
      caption?: string
    }

/** The set of all figure kinds — handy for exhaustive iteration in tests. */
export type FigureKind = FigureSpec["kind"]
