/**
 * Shows the heading at every size the type scale offers.
 */

import { Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { Heading } from "#heading/heading.ts";

/**
 * Every size a heading takes.
 */
const SIZES = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl"] as const;

export const scale: Scene = {
  about:
    "The same words at each size, which is the only way to judge whether the steps between them are even. Drawn as paragraphs so that eleven of them do not make eleven headings for a screen reader to announce.",
  draw: () => (
    <Matrix gap="4" knob="size" of={SIZES}>
      {(size) => (
        <Heading as="p" size={size}>
          Settled in full
        </Heading>
      )}
    </Matrix>
  ),
  title: "The scale",
};

export default specimen({
  about:
    "The heading. Eleven steps, from a label barely larger than body text to the one a landing page opens on.",
  group: "Typography",
  id: "typography/heading",
  scenes: [scale],
  title: "Heading",
});
