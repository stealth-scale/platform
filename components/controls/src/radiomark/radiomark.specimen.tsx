/**
 * Shows the dot on its own, which is what every radio in the kit is drawn from.
 */

import { Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { Radiomark } from "#radiomark/radiomark.ts";

/**
 * How the dot is filled.
 */
const VARIANTS = ["solid", "subtle", "outline", "inverted"] as const;

/**
 * How large it is.
 */
const SIZES = ["xs", "sm", "md", "lg"] as const;

export const variants: Scene = {
  about:
    "Inverted is the one drawn on a fill rather than on the page, which is what a selected card needs.",
  draw: () => (
    <Matrix direction="row" gap="6" knob="variant" of={VARIANTS}>
      {(variant) => <Radiomark checked colorPalette="primary" variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "The ring and the dot inside it step together. At `xs` the dot is a couple of pixels across, which is the size at which a colour that is close to the ring stops reading as on.",
  draw: () => (
    <Matrix direction="row" gap="6" knob="size" of={SIZES}>
      {(size) => <Radiomark checked colorPalette="primary" size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const states: Scene = {
  about:
    "A radio group and a radio card both borrow this part, so anything wrong with the dot elsewhere is wrong here first.",
  draw: () => (
    <Row gap="6">
      <Radiomark colorPalette="primary" />
      <Radiomark checked colorPalette="primary" filled />
      <Radiomark checked colorPalette="primary" disabled />
    </Row>
  ),
  title: "States",
};

export default specimen({
  about:
    "The dot alone, without a label or a hit area. Every radio in the kit is drawn from this one.",
  group: "Controls",
  id: "controls/radiomark",
  scenes: [variants, sizes, states],
  title: "Radiomark",
});
