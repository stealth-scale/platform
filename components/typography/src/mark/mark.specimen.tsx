/**
 * Shows a word picked out of a line, in every way the mark can be filled.
 */

import { Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { Mark } from "#mark/mark.ts";
import { Text } from "#text/text.ts";

/**
 * Every way a mark is filled.
 */
const VARIANTS = ["subtle", "solid", "text", "plain"] as const;

export const variants: Scene = {
  about:
    "Drawn inside a line rather than on its own, because a mark is judged on whether the word stays readable — and that is a question about the line around it.",
  draw: () => (
    <Matrix direction="row" knob="variant" of={VARIANTS}>
      {(variant) => (
        <Text maxW="12rem">
          Four <Mark variant={variant}>offers</Mark> waiting
        </Text>
      )}
    </Matrix>
  ),
  title: "Variants",
};

export default specimen({
  about:
    "Picks a word out of a line — a search term, a changed value, a warning. `Highlight` is what marks several at once without the sentence being split by hand.",
  group: "Typography",
  id: "typography/mark",
  scenes: [variants],
  title: "Mark",
});
