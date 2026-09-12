/**
 * Shows the tick on its own, which is what every box in the kit is drawn from.
 */

import { Column, Matrix, Row, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Checkmark } from "#checkmark/checkmark.ts";

/**
 * How the tick is filled.
 */
const VARIANTS = ["solid", "outline", "subtle", "plain", "inverted"] as const;

/**
 * How large it is.
 */
const SIZES = ["xs", "sm", "md", "lg"] as const;

/**
 * What it can show.
 */
const STATES = [
  { checked: true, label: "checked" },
  { indeterminate: true, label: "indeterminate" },
  { disabled: true, label: "disabled" },
  { checked: true, invalid: true, label: "invalid, checked" },
] as const;

export const variants: Scene = {
  about:
    "Inverted is the one drawn on a fill rather than on the page, which is what a menu item and a selected row need.",
  draw: () => (
    <Matrix direction="row" gap="6" knob="variant" of={VARIANTS}>
      {(variant) => <Checkmark checked colorPalette="primary" variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "The stroke thickens with the box, so the tick reads as the same mark at every size rather than as a hairline at the small end.",
  draw: () => (
    <Matrix direction="row" gap="6" knob="size" of={SIZES}>
      {(size) => <Checkmark checked colorPalette="primary" size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const states: Scene = {
  about:
    "This is the part a checkbox, a radio card and a menu item all borrow, so whatever is wrong with a tick anywhere else is wrong here first.",
  draw: () => (
    <Row gap="6">
      {STATES.map((state) => (
        <Column align="center" gap="2" key={state.label}>
          <Checkmark colorPalette="primary" {...state} />
          <Text muted size="xs">
            {state.label}
          </Text>
        </Column>
      ))}
      <Column align="center" gap="2">
        <Checkmark checked colorPalette="primary" filled />
        <Text muted size="xs">
          filled
        </Text>
      </Column>
    </Row>
  ),
  title: "States",
};

export default specimen({
  about:
    "The tick alone, without a label or a hit area. Every box in the kit is drawn from this one, so it is worth looking at on its own.",
  group: "Controls",
  id: "controls/checkmark",
  scenes: [variants, sizes, states],
  title: "Checkmark",
});
