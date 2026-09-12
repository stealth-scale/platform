/**
 * Shows the checkbox card in every variant and size, and in each way its parts can be arranged.
 */

import { type ReactElement, type ReactNode } from "react";

import { Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  CheckboxCardAddon,
  CheckboxCardContent,
  CheckboxCardControl,
  CheckboxCardDescription,
  CheckboxCardHiddenInput,
  CheckboxCardIndicator,
  CheckboxCardLabel,
  CheckboxCardRoot,
  type CheckboxCardRootProps,
} from "#checkbox-card/checkbox-card.ts";

/**
 * How the card is filled once it is on.
 */
const VARIANTS = ["surface", "subtle", "outline", "solid"] as const;

/**
 * How large it is.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Which way the indicator sits against the words.
 */
const ORIENTATIONS = ["horizontal", "vertical"] as const;

/**
 * Describes the props of {@link Card}.
 */
interface CardProps extends Omit<CheckboxCardRootProps, "children"> {
  /**
   * What sits under the card's own border, where anything does.
   */
  addon?: ReactNode;

  /**
   * What the card says under its name.
   */
  description?: string;

  /**
   * What the card is called.
   */
  label: string;
}

/**
 * Draws one card, the indicator after the words.
 *
 * @param props - The card. `CardProps` documents every member.
 * @returns One card.
 */
function Card(props: CardProps): ReactElement {
  const { addon, description, label, ...root } = props;

  return (
    <CheckboxCardRoot colorPalette="primary" maxW="14rem" variant="surface" {...root}>
      <CheckboxCardHiddenInput />
      <CheckboxCardControl>
        {root.orientation === "vertical" ? <CheckboxCardIndicator /> : null}
        <CheckboxCardContent>
          <CheckboxCardLabel>{label}</CheckboxCardLabel>
          {description === undefined ? null : (
            <CheckboxCardDescription>{description}</CheckboxCardDescription>
          )}
        </CheckboxCardContent>
        {root.orientation === "vertical" ? null : <CheckboxCardIndicator />}
      </CheckboxCardControl>
      {addon === undefined ? null : <CheckboxCardAddon>{addon}</CheckboxCardAddon>}
    </CheckboxCardRoot>
  );
}

export const variants: Scene = {
  about:
    "A card is a checkbox with room to explain itself, so the whole card is the hit area rather than a box beside it. Solid is the one to check — the description has to stay readable on a fill.",
  draw: () => (
    <Matrix direction="row" gap="4" knob="variant" of={VARIANTS}>
      {(variant) => (
        <Card
          defaultChecked
          description="Leaves before six."
          label="Same-day payout"
          variant={variant}
        />
      )}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "The padding and the words step together, so a row of cards keeps its rhythm at every size.",
  draw: () => (
    <Matrix direction="row" gap="4" knob="size" of={SIZES}>
      {(size) => (
        <Card defaultChecked description="Leaves before six." label="Same-day payout" size={size} />
      )}
    </Matrix>
  ),
  title: "Sizes",
};

export const arrangements: Scene = {
  about:
    "Vertical puts the indicator above the words rather than after them, which is what a wide card in a narrow column wants. The addon is the row under the card’s own border — where a price or a note goes — and it is the one part that has to keep the card’s corner radius.",
  draw: () => (
    <Row align="start" gap="6">
      {ORIENTATIONS.map((orientation) => (
        <Card
          description="Someone checks it first."
          key={orientation}
          label="Hold for review"
          orientation={orientation}
        />
      ))}
      <Card addon="£12 per payout" label="Priority" />
      <Card description="Needs a verified account." disabled label="Not available" />
    </Row>
  ),
  title: "Orientations and addons",
};

export default specimen({
  about:
    "A checkbox with room to explain itself. The whole card is the hit area, which is what makes it worth reaching for over a box and a label.",
  group: "Controls",
  id: "controls/checkbox-card",
  scenes: [variants, sizes, arrangements],
  title: "Checkbox card",
});
