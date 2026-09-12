/**
 * Shows the flat patch of colour, at every size and in every shape.
 */

import { Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { ColorSwatch, ColorSwatchMix } from "#color-swatch/color-swatch.ts";

/**
 * How large the patch is.
 */
const SIZES = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "full"] as const;

/**
 * How its edges are cut.
 */
const SHAPES = ["square", "rounded", "circle"] as const;

/**
 * What the mixes are made of.
 */
const MIXED = ["#3b82f6", "#a855f7", "#f97316"];

export const shapes: Scene = {
  about:
    "How the edges are cut. Circle is what a picker uses for the value in hand; square is what a palette uses, where a row of circles leaves gaps between the colours.",
  draw: () => (
    <Matrix direction="row" gap="6" knob="shape" of={SHAPES}>
      {(shape) => <ColorSwatch shape={shape} size="lg" value="#3b82f6" />}
    </Matrix>
  ),
  title: "Shapes",
};

export const sizes: Scene = {
  about:
    "`full` is not a step on the scale: it takes whatever room it is given, which is what a swatch sitting behind a picker needs.",
  draw: () => (
    <Matrix direction="row" gap="4" knob="size" of={SIZES}>
      {(size) => <ColorSwatch size={size} value="#3b82f6" />}
    </Matrix>
  ),
  title: "Sizes",
};

export const translucent: Scene = {
  about:
    "The case worth drawing: a swatch has to show a chequerboard behind the colour, or a half-transparent value looks like a lighter opaque one. The two beside it are mixes, which stack several colours into one patch.",
  draw: () => (
    <Row gap="6">
      <ColorSwatch size="lg" value="hsla(217, 91%, 60%, 0.4)" />
      <ColorSwatchMix items={MIXED} size="lg" />
      <ColorSwatchMix items={MIXED.slice(0, 2)} size="lg" />
    </Row>
  ),
  title: "Translucent, and mixed",
};

export default specimen({
  about:
    "A flat patch of one colour, with a chequerboard behind it so a translucent value reads as translucent.",
  group: "Controls",
  id: "controls/color-swatch",
  scenes: [shapes, sizes, translucent],
  title: "Color swatch",
});
