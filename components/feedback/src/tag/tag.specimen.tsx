/**
 * Shows the tag in every variant and size, with and without something to close it.
 */

import { type ReactElement } from "react";

import { HashIcon } from "lucide-react";

import { Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  TagCloseTrigger,
  TagLabel,
  TagRoot,
  type TagRootProps,
  TagStartElement,
} from "#tag/tag.ts";

/**
 * Every way a tag is filled.
 */
const VARIANTS = ["subtle", "solid", "outline", "surface"] as const;

/**
 * Every size a tag takes.
 */
const SIZES = ["sm", "md", "lg", "xl"] as const;

/**
 * Draws a plain tag, one carrying a mark, and one that can be dismissed.
 *
 * The three together are the check that a tag keeps its height whatever is put inside it.
 *
 * @param props - Whichever of them the scene is turning. `TagRootProps` documents every member.
 * @returns Three tags, side by side.
 */
function Three(props: TagRootProps): ReactElement {
  return (
    <Row gap="2">
      <TagRoot {...props}>
        <TagLabel>ledger</TagLabel>
      </TagRoot>
      <TagRoot colorPalette="primary" {...props}>
        <TagStartElement>
          <HashIcon />
        </TagStartElement>
        <TagLabel>payouts</TagLabel>
      </TagRoot>
      <TagRoot {...props}>
        <TagLabel>archived</TagLabel>
        <TagCloseTrigger />
      </TagRoot>
    </Row>
  );
}

export const variants: Scene = {
  about:
    "The close trigger is the part to watch across the fills: it has to stay findable on a solid tag, where it is drawn on the fill rather than on the page.",
  draw: () => (
    <Matrix knob="variant" of={VARIANTS}>
      {(variant) => <Three variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "A tag holds its height whatever is inside it, so a row of tags with and without marks still lines up. That is what the three together check at each size.",
  draw: () => (
    <Matrix direction="row" gap="6" knob="size" of={SIZES}>
      {(size) => <Three size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export default specimen({
  about:
    "A short label attached to something, optionally with a mark before it or a way to take it off.",
  group: "Feedback",
  id: "feedback/tag",
  scenes: [variants, sizes],
  title: "Tag",
});
