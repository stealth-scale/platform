/**
 * Shows the list in each of the ways it can be marked.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { ListItem, ListRoot, type ListRootProps } from "#list/list.ts";

/**
 * Every way a list marks its items.
 */
const VARIANTS = ["marker", "plain"] as const;

/**
 * Which element the list is, which is what decides whether items are numbered.
 */
const KINDS = ["ul", "ol"] as const;

/**
 * Every marker a numbered list can count with, and every bullet an unnumbered one can use.
 *
 * `ol` and `ul` decide only whether the browser counts; which glyph it counts in is
 * `listStyleType`, and CSS offers far more of them than the two elements suggest.
 */
const MARKERS = ["decimal", "lower-alpha", "upper-roman", "disc", "circle", "square"] as const;

/**
 * The bullets, as against the things that count.
 */
const BULLETS = new Set(["circle", "disc", "square"]);

/**
 * Draws the same three items, however the list around them is set.
 *
 * @param props - Whichever of them the scene is turning. `ListRootProps` documents every member.
 * @returns One list of three.
 */
function Steps(props: ListRootProps): ReactElement {
  return (
    <ListRoot {...props}>
      <ListItem>Raise the offer</ListItem>
      <ListItem>Await acceptance</ListItem>
      <ListItem>Settle and archive</ListItem>
    </ListRoot>
  );
}

export const variants: Scene = {
  about:
    "Whether the marker is drawn at all. A plain list is still a list to a screen reader, which is the reason to reach for one rather than for a stack of lines.",
  draw: () => (
    <Matrix knob="variant" of={VARIANTS}>
      {(variant) => <Steps variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const kinds: Scene = {
  about:
    "Ordered or not. This is the one decision that belongs in the markup, because it is the one a reader is told about rather than shown.",
  draw: () => (
    <Matrix direction="row" gap="10" knob="as" of={KINDS}>
      {(kind) => <Steps as={kind} />}
    </Matrix>
  ),
  title: "Ordered and unordered",
};

export const markers: Scene = {
  about:
    "The glyph down the side is a style property rather than an element, so roman numerals and lettered clauses need no markup of their own — only a list that was already ordered.",
  draw: () => (
    <Matrix direction="row" gap="10" knob="listStyleType" of={MARKERS}>
      {(marker) => <Steps as={BULLETS.has(marker) ? "ul" : "ol"} listStyleType={marker} />}
    </Matrix>
  ),
  title: "Markers",
};

export default specimen({
  about:
    "A run of items, marked or not. Whether they are counted is markup; what they are counted in is style.",
  group: "Typography",
  id: "typography/list",
  scenes: [variants, kinds, markers],
  title: "List",
});
