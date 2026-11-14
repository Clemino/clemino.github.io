"use client"

import type { NnLayer } from "./types"
import { FigureFrame } from "./FigureFrame"

const R = 13 // neuron radius
const NEURON_GAP = 16 // vertical gap between neuron centres' edges
const LAYER_GAP = 110 // horizontal gap between layer columns
const PAD = 28
const LABEL_H = 30 // headroom for the layer label above the column

const ROLE_LABEL: Record<NonNullable<NnLayer["role"]>, string> = {
  input: "entrée",
  hidden: "cachée",
  output: "sortie",
}

/** A feed-forward neural network diagram for neural-network exercises. */
export function NeuralNetDiagram({
  layers,
  caption,
}: {
  layers: NnLayer[]
  caption?: string
}) {
  const step = 2 * R + NEURON_GAP
  const maxNeurons = layers.reduce((m, l) => Math.max(m, l.neurons), 1)
  const columnH = maxNeurons * step

  const width = PAD * 2 + Math.max(layers.length - 1, 0) * LAYER_GAP + 2 * R
  const height = PAD * 2 + LABEL_H + columnH

  const xOf = (i: number) => PAD + R + i * LAYER_GAP
  // centre each layer's column vertically within the tallest column
  const yOf = (layerIdx: number, neuronIdx: number) => {
    const n = layers[layerIdx].neurons
    const colTop = PAD + LABEL_H + (columnH - n * step) / 2
    return colTop + step / 2 + neuronIdx * step
  }

  return (
    <FigureFrame label="Réseau de neurones" caption={caption}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block"
        role="img"
        aria-label="Diagramme de réseau de neurones"
      >
        {/* edges between consecutive layers */}
        {layers
          .slice(0, -1)
          .flatMap((layer, li) =>
            Array.from({ length: layer.neurons }).flatMap((_, a) =>
              Array.from({ length: layers[li + 1].neurons }).map((__, b) => (
                <line
                  key={`e-${li}-${a}-${b}`}
                  x1={xOf(li) + R}
                  y1={yOf(li, a)}
                  x2={xOf(li + 1) - R}
                  y2={yOf(li + 1, b)}
                  stroke="var(--border)"
                  strokeWidth={1}
                />
              ))
            )
          )}

        {/* neurons + layer labels */}
        {layers.map((layer, li) => {
          const role = layer.role
          const label =
            layer.label ??
            (role ? `Couche ${ROLE_LABEL[role]}` : `Couche ${li + 1}`)
          const fill =
            role === "input"
              ? "var(--bg-3)"
              : role === "output"
                ? "var(--accent-dim)"
                : "var(--bg-2)"
          const stroke =
            role === "output" ? "var(--accent)" : "var(--border-strong)"
          return (
            <g key={`layer-${li}`}>
              {Array.from({ length: layer.neurons }).map((_, n) => (
                <circle
                  key={n}
                  cx={xOf(li)}
                  cy={yOf(li, n)}
                  r={R}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={1.5}
                />
              ))}
              <text
                x={xOf(li)}
                y={PAD + 8}
                textAnchor="middle"
                fontSize={10.5}
                fontFamily="var(--font-mono)"
                fontWeight={600}
                fill="var(--fg-1)"
              >
                {label}
              </text>
              <text
                x={xOf(li)}
                y={PAD + 21}
                textAnchor="middle"
                fontSize={9.5}
                fontFamily="var(--font-mono)"
                fill="var(--fg-2)"
              >
                {layer.neurons} neurone{layer.neurons > 1 ? "s" : ""}
              </text>
            </g>
          )
        })}
      </svg>
    </FigureFrame>
  )
}
