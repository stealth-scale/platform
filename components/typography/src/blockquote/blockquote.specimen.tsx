/**
 * Shows the blockquote in each variant, and on each side.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  BlockquoteCaption,
  BlockquoteContent,
  BlockquoteRoot,
  type BlockquoteRootProps,
} from "#blockquote/blockquote.ts";
import { Span } from "#span/span.ts";

/**
 * Every way a quotation is marked off.
 */
const VARIANTS = ["subtle", "solid", "plain"] as const;

/**
 * Which side the rule runs down.
 */
const SIDES = ["start", "end"] as const;

/**
 * Draws the same quotation, however the blockquote around it is set.
 *
 * @param props - Whichever of them the scene is turning. `BlockquoteRootProps` documents every
 *   member.
 * @returns One quotation, with its source under it.
 */
function Quote(props: BlockquoteRootProps): ReactElement {
  return (
    <BlockquoteRoot maxW="sm" {...props}>
      <BlockquoteContent>
        A rule that is punctuation is hidden, and a rule that is structure is drawn.
      </BlockquoteContent>
      <BlockquoteCaption>
        — <Span as="cite">The house style</Span>
      </BlockquoteCaption>
    </BlockquoteRoot>
  );
}

export const variants: Scene = {
  about:
    "How far the quotation is set off from the prose around it: a tinted panel, a filled rule, or nothing but the indent.",
  draw: () => (
    <Matrix knob="variant" of={VARIANTS}>
      {(variant) => <Quote variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sides: Scene = {
  about:
    "The rule and the padding have to swap together. A quotation that turns its rule but keeps its indent on the left reads as a mistake in every right-to-left locale, and this is where that shows.",
  draw: () => (
    <Matrix direction="row" gap="8" knob="justify" of={SIDES}>
      {(justify) => <Quote justify={justify} variant="subtle" />}
    </Matrix>
  ),
  title: "Sides",
};

export default specimen({
  about:
    "A quotation set off from the prose around it, with the source under it. The rule runs down whichever side the text starts on.",
  group: "Typography",
  id: "typography/blockquote",
  scenes: [variants, sides],
  title: "Blockquote",
});
