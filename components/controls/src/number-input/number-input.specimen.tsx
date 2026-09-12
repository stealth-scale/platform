/**
 * Shows the number field in every variant and size, formatted, clamped, and scrubbable.
 */

import { type ReactElement } from "react";

import { Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  NumberInputControl,
  NumberInputDecrementTrigger,
  NumberInputIncrementTrigger,
  NumberInputInput,
  NumberInputLabel,
  NumberInputRoot,
  type NumberInputRootProps,
  NumberInputScrubber,
} from "#number-input/number-input.ts";

/**
 * How the field is bordered.
 */
const VARIANTS = ["outline", "subtle", "flushed"] as const;

/**
 * How large it is.
 */
const SIZES = ["xs", "sm", "md", "lg"] as const;

/**
 * Draws one number field with the two steppers beside it.
 *
 * @param props - Whichever of them the scene is turning. `NumberInputRootProps` documents every
 *   member.
 * @returns One number field.
 */
function Count(props: Omit<NumberInputRootProps, "children">): ReactElement {
  return (
    <NumberInputRoot defaultValue="4" maxW="9rem" {...props}>
      <NumberInputInput />
      <NumberInputControl>
        <NumberInputIncrementTrigger />
        <NumberInputDecrementTrigger />
      </NumberInputControl>
    </NumberInputRoot>
  );
}

export const variants: Scene = {
  about:
    "The same three borders the plain field takes. The steppers sit inside the box in all of them, so a flushed field still has somewhere to put them.",
  draw: () => (
    <Matrix knob="variant" of={VARIANTS}>
      {(variant) => <Count variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "The steppers are stacked in the same width at every size, so the smallest one is where they stop being separately hittable.",
  draw: () => (
    <Matrix direction="row" gap="4" knob="size" of={SIZES}>
      {(size) => <Count size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const formatted: Scene = {
  about:
    "Formatting is the browser’s, so a currency knows its own symbol and separators without anything here saying what they are. Clamping is stated: the second one will not go past ten.",
  draw: () => (
    <Row align="end" gap="6">
      <NumberInputRoot
        defaultValue="4120.00"
        formatOptions={{ currency: "GBP", style: "currency" }}
        maxW="11rem"
      >
        <NumberInputLabel>Amount</NumberInputLabel>
        <NumberInputInput />
        <NumberInputControl>
          <NumberInputIncrementTrigger />
          <NumberInputDecrementTrigger />
        </NumberInputControl>
      </NumberInputRoot>

      <Count defaultValue="10" max={10} min={0} />
      <Count disabled />
    </Row>
  ),
  title: "Formatted and clamped",
};

export const scrubber: Scene = {
  about:
    "A strip that is dragged sideways to change the figure. It is the one part with no keyboard of its own, so the field beside it is what carries that — a scrubber alone would be unreachable.",
  draw: () => (
    <NumberInputRoot defaultValue="4" maxW="9rem">
      <Row gap="2">
        <NumberInputScrubber />
        <NumberInputInput />
      </Row>
    </NumberInputRoot>
  ),
  title: "With a scrubber",
};

export default specimen({
  about:
    "A figure, with steppers, clamping, and the browser’s own formatting. Reach for it where the value is counted rather than typed.",
  group: "Controls",
  id: "controls/number-input",
  scenes: [variants, sizes, formatted, scrubber],
  title: "Number input",
});
