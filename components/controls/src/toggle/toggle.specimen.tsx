/**
 * Shows the single button that stays pressed, which is what a toggle group is made of.
 */

import { BellIcon, BellOffIcon, StarIcon } from "lucide-react";

import { Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { ToggleIndicator, ToggleRoot } from "#toggle/toggle.ts";

/**
 * How a pressed toggle is filled.
 */
const VARIANTS = ["ghost", "outline", "solid"] as const;

/**
 * How large it is.
 */
const SIZES = ["sm", "md", "lg"] as const;

export const variants: Scene = {
  about:
    "Both states side by side, because that is the pair the recipe exists to separate. Chakra ships no recipe under the `toggle` key and the lookup fails quietly, so until this theme supplied one a toggle rendered as bare text and pressing it changed nothing a reader could see.",
  draw: () => (
    <Matrix gap="6" knob="variant" of={VARIANTS}>
      {(variant) => (
        <Row gap="3">
          <ToggleRoot colorPalette="primary" variant={variant}>
            <StarIcon size={16} /> Off
          </ToggleRoot>
          <ToggleRoot colorPalette="primary" defaultPressed variant={variant}>
            <StarIcon size={16} /> On
          </ToggleRoot>
        </Row>
      )}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "The same steps a button takes, so a toggle sitting in a row of buttons lines up with them.",
  draw: () => (
    <Matrix direction="row" gap="6" knob="size" of={SIZES}>
      {(size) => (
        <ToggleRoot colorPalette="primary" defaultPressed size={size}>
          <StarIcon size={16} /> On
        </ToggleRoot>
      )}
    </Matrix>
  ),
  title: "Sizes",
};

export const states: Scene = {
  about:
    "The indicator is the part that swaps: it takes what to draw when pressed and a fallback for when it is not, so the button changes meaning without changing size.",
  draw: () => (
    <Row gap="6">
      <ToggleRoot colorPalette="primary">
        <StarIcon size={16} /> Off
      </ToggleRoot>
      <ToggleRoot colorPalette="primary" disabled>
        <StarIcon size={16} /> Disabled
      </ToggleRoot>
      <ToggleRoot colorPalette="primary" defaultPressed>
        <ToggleIndicator fallback={<BellOffIcon size={16} />}>
          <BellIcon size={16} />
        </ToggleIndicator>
        With an indicator
      </ToggleRoot>
    </Row>
  ),
  title: "States",
};

export default specimen({
  about:
    "A button that keeps its own pressed state. Several that release one another is a toggle group.",
  group: "Controls",
  id: "controls/toggle",
  scenes: [variants, sizes, states],
  title: "Toggle",
});
