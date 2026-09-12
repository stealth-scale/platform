/**
 * Shows the field that turns what is typed into tags, in every variant and size.
 */

import { type ReactElement } from "react";

import { Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  TagsInputClearTrigger,
  TagsInputControl,
  TagsInputHiddenInput,
  TagsInputInput,
  TagsInputItems,
  TagsInputLabel,
  TagsInputRoot,
  type TagsInputRootProps,
} from "#tags-input/tags-input.ts";

/**
 * How the field is bordered.
 */
const VARIANTS = ["outline", "subtle", "flushed"] as const;

/**
 * How large it is.
 */
const SIZES = ["xs", "sm", "md", "lg"] as const;

/**
 * What is already in the field.
 */
const ACCOUNTS = ["Bridge Ledger", "Halden & Co"];

/**
 * Draws one field already holding two accounts.
 *
 * `TagsInputItems` draws the chips: the preview that gives each one its fill, the text inside it
 * and the button that removes it. Composing those by hand is what a field with a custom chip does,
 * and leaving out the preview is what leaves the words sitting bare on the control.
 *
 * @param props - Whichever of them the scene is turning. `TagsInputRootProps` documents every
 *   member.
 * @returns One tags field.
 */
function Accounts(props: Omit<TagsInputRootProps, "children">): ReactElement {
  return (
    <TagsInputRoot colorPalette="primary" defaultValue={ACCOUNTS} {...props}>
      <TagsInputHiddenInput />
      <TagsInputControl>
        <TagsInputItems />
        <TagsInputInput placeholder="Add an account" />
      </TagsInputControl>
    </TagsInputRoot>
  );
}

export const variants: Scene = {
  about:
    "The same three borders the plain field takes. Type a name and press enter — the chips sit inside the control, so the control grows rather than scrolling.",
  draw: () => (
    <Matrix gap="8" knob="variant" of={VARIANTS}>
      {(variant) => <Accounts variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "The chips step with the field, so a tag never looks pasted on. At `xs` the remove button is the part that stops being separately hittable.",
  draw: () => (
    <Matrix gap="4" knob="size" of={SIZES}>
      {(size) => <Accounts size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const capped: Scene = {
  about:
    "Capped at three: the field stops accepting once it is full rather than silently dropping what is typed. The clear button empties it in one press, which is the only way out of a full field on a phone.",
  draw: () => (
    <TagsInputRoot colorPalette="primary" defaultValue={ACCOUNTS} max={3}>
      <TagsInputLabel>Accounts</TagsInputLabel>
      <TagsInputHiddenInput />
      <TagsInputControl>
        <TagsInputItems />
        <TagsInputInput placeholder="Add an account" />
      </TagsInputControl>
      <Row justify="flex-end">
        <TagsInputClearTrigger>Clear</TagsInputClearTrigger>
      </Row>
    </TagsInputRoot>
  ),
  title: "Capped, labelled and clearable",
};

export default specimen({
  about:
    "Turns what is typed into chips that can be removed one at a time. Reach for it where the values are free text; reach for a select where they are a known list.",
  group: "Controls",
  id: "controls/tags-input",
  scenes: [variants, sizes, capped],
  title: "Tags input",
});
