/**
 * Shows the toggle group in both variants and every size, single-select and multiple.
 */

import { type ReactElement } from "react";

import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";

import { Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  ToggleGroupItem,
  ToggleGroupRoot,
  type ToggleGroupRootProps,
} from "#toggle-group/toggle-group.ts";

/**
 * How the items are drawn.
 */
const VARIANTS = ["outline", "ghost"] as const;

/**
 * How large they are.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * What the segmented row offers.
 */
const ALIGNMENTS = ["Left", "Center", "Right"];

/**
 * What the multiple-select row offers, against the icon each carries.
 */
const MARKS = [
  { Icon: BoldIcon, value: "bold" },
  { Icon: ItalicIcon, value: "italic" },
  { Icon: UnderlineIcon, value: "underline" },
];

/**
 * Draws the three alignments as one group.
 *
 * @param props - Whichever of them the scene is turning. `ToggleGroupRootProps` documents every
 *   member.
 * @returns One group of three.
 */
function Alignments(props: Omit<ToggleGroupRootProps, "children">): ReactElement {
  return (
    <ToggleGroupRoot colorPalette="primary" defaultValue={["Left"]} {...props}>
      {ALIGNMENTS.map((alignment) => (
        <ToggleGroupItem key={alignment} value={alignment}>
          {alignment}
        </ToggleGroupItem>
      ))}
    </ToggleGroupRoot>
  );
}

export const variants: Scene = {
  about:
    "Outline draws a box around the whole strip and rules between the items; ghost leaves them to the page until one is pressed.",
  draw: () => (
    <Matrix gap="6" knob="variant" of={VARIANTS}>
      {(variant) => <Alignments variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "The same steps a button takes, so a group sitting in a toolbar lines up with the rest of it.",
  draw: () => (
    <Matrix direction="row" gap="8" knob="size" of={SIZES}>
      {(size) => <Alignments size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const multiple: Scene = {
  about:
    "Single-select releases the other item and reads as a segmented control; multiple leaves several on and reads as a set of filters. Which one it is has to be legible before anything is pressed.",
  draw: () => (
    <ToggleGroupRoot colorPalette="primary" defaultValue={["bold"]} multiple variant="outline">
      {MARKS.map((mark) => (
        <ToggleGroupItem key={mark.value} value={mark.value}>
          <mark.Icon size={16} />
        </ToggleGroupItem>
      ))}
    </ToggleGroupRoot>
  ),
  title: "Several at once",
};

export default specimen({
  about:
    "Several toggles that behave as one control. One at a time is a segmented choice; several at once is a set of filters.",
  group: "Controls",
  id: "controls/toggle-group",
  scenes: [variants, sizes, multiple],
  title: "Toggle group",
});
