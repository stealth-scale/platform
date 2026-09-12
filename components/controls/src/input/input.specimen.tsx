/**
 * Shows the field in every variant and size, and in each state a form can put it in.
 */

import { Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { Input } from "#input/input.ts";

/**
 * How the field is bordered.
 */
const VARIANTS = ["outline", "subtle", "flushed"] as const;

/**
 * How large it is.
 */
const SIZES = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl"] as const;

export const variants: Scene = {
  about:
    "How much of a box the field draws around itself. Flushed has none at all, which is what to reach for in a dense table where a full border on every cell is noise.",
  draw: () => (
    <Matrix knob="variant" of={VARIANTS}>
      {(variant) => <Input maxW="12rem" placeholder="Account name" variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "The height is what a row of mixed controls lines up on, so these have to match the button and the select step for step.",
  draw: () => (
    <Matrix direction="row" gap="4" knob="size" of={SIZES}>
      {(size) => <Input maxW="12rem" placeholder="Account name" size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const states: Scene = {
  about:
    "Disabled and read-only look alike and are not: a read-only field can still be focused and copied from, which is what to reach for when the value matters but cannot be changed here.",
  draw: () => (
    <Row gap="4">
      <Input defaultValue="Bridge Ledger" maxW="12rem" />
      <Input disabled maxW="12rem" placeholder="Disabled" />
      <Input aria-invalid="true" maxW="12rem" placeholder="Invalid" />
      <Input maxW="12rem" readOnly value="Read only" />
    </Row>
  ),
  title: "States",
};

export default specimen({
  about:
    "One line of text. The plainest control there is, and the one every form is mostly made of.",
  group: "Controls",
  id: "controls/input",
  scenes: [variants, sizes, states],
  title: "Input",
});
