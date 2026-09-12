/**
 * Shows the key in every variant, and at every size.
 */

import { type ReactElement } from "react";

import { ArrowBigUpIcon, CommandIcon } from "lucide-react";

import { Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { Kbd, type KbdProps } from "#kbd/kbd.ts";

/**
 * Every size a key takes.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Every way a key is drawn.
 */
const VARIANTS = ["raised", "outline", "subtle", "plain"] as const;

/**
 * Draws a chord rather than a key, since a key is nearly always pressed with another.
 *
 * @param props - Whichever of them the scene is turning. `KbdProps` documents every member.
 * @returns Three keys, spaced as a chord.
 */
function Chord(props: KbdProps): ReactElement {
  return (
    <Row gap="1">
      <Kbd {...props}>
        <CommandIcon size={12} />
      </Kbd>
      <Kbd {...props}>
        <ArrowBigUpIcon size={12} />
      </Kbd>
      <Kbd {...props}>K</Kbd>
    </Row>
  );
}

export const variants: Scene = {
  about:
    "Raised is the one that reads as a key rather than as a word: it carries a shadow under it, which is the whole of what makes a rectangle look pressable.",
  draw: () => (
    <Matrix knob="variant" of={VARIANTS}>
      {(variant) => <Chord variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "A key is set beside running text far more often than on its own, so the sizes have to line up with the body scale rather than with each other.",
  draw: () => (
    <Matrix direction="row" gap="6" knob="size" of={SIZES}>
      {(size) => <Chord size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export default specimen({
  about: "A key as it is printed on a keyboard, for telling a reader what to press.",
  group: "Typography",
  id: "typography/kbd",
  scenes: [variants, sizes],
  title: "Kbd",
});
