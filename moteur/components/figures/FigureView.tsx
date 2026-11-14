"use client"

import type { FigureSpec } from "./types"
import { CandlestickChart } from "./CandlestickChart"
import { ConfusionMatrix } from "./ConfusionMatrix"
import { DataTable } from "./DataTable"
import { DecisionTree } from "./DecisionTree"
import { GameTree } from "./GameTree"
import { GridWorld } from "./GridWorld"
import { NeuralNetDiagram } from "./NeuralNetDiagram"
import { SearchTree } from "./SearchTree"
import { TrainingCurve } from "./TrainingCurve"

/**
 * Router for the figures library: given a `FigureSpec`, renders the matching
 * figure component. The `switch` is exhaustive — adding a new `kind` to
 * `FigureSpec` without handling it here is a compile error.
 */
export function FigureView({ spec }: { spec: FigureSpec }) {
  switch (spec.kind) {
    case "game-tree":
      return <GameTree root={spec.root} caption={spec.caption} />
    case "search-tree":
      return (
        <SearchTree
          nodes={spec.nodes}
          edges={spec.edges}
          startId={spec.startId}
          goalIds={spec.goalIds}
          caption={spec.caption}
        />
      )
    case "decision-tree":
      return <DecisionTree root={spec.root} caption={spec.caption} />
    case "data-table":
      return (
        <DataTable
          columns={spec.columns}
          rows={spec.rows}
          highlightRows={spec.highlightRows}
          highlightCols={spec.highlightCols}
          caption={spec.caption}
        />
      )
    case "confusion-matrix":
      return (
        <ConfusionMatrix
          classes={spec.classes}
          matrix={spec.matrix}
          caption={spec.caption}
        />
      )
    case "nn-diagram":
      return <NeuralNetDiagram layers={spec.layers} caption={spec.caption} />
    case "training-curve":
      return (
        <TrainingCurve
          series={spec.series}
          xLabel={spec.xLabel}
          yLabel={spec.yLabel}
          caption={spec.caption}
        />
      )
    case "grid-world":
      return (
        <GridWorld
          rows={spec.rows}
          cols={spec.cols}
          cells={spec.cells}
          caption={spec.caption}
        />
      )
    case "candlestick":
      return (
        <CandlestickChart
          candles={spec.candles}
          overlays={spec.overlays}
          levels={spec.levels}
          showVolume={spec.showVolume}
          caption={spec.caption}
        />
      )
    default: {
      const _exhaustive: never = spec
      return _exhaustive
    }
  }
}
