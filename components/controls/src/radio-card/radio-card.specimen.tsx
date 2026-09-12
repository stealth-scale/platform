/**
 * Shows the radio card in every variant and size, and in each way its parts can be arranged.
 */

import { type ReactElement } from "react";

import { Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  RadioCardItem,
  RadioCardItemAddon,
  RadioCardItemContent,
  RadioCardItemControl,
  RadioCardItemDescription,
  RadioCardItemHiddenInput,
  RadioCardItemIndicator,
  RadioCardItemText,
  RadioCardLabel,
  RadioCardRoot,
  type RadioCardRootProps,
} from "#radio-card/radio-card.ts";

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
 * What can be picked, and what each says.
 */
const WINDOWS = [
  { description: "Leaves before six.", label: "Same day" },
  { description: "Leaves overnight.", label: "Next day" },
];

/**
 * Draws one set of cards.
 *
 * @param props - Whichever of them the scene is turning. `RadioCardRootProps` documents every
 *   member.
 * @returns One set of cards, the first picked.
 */
function Cards(props: Omit<RadioCardRootProps, "children">): ReactElement {
  return (
    <RadioCardRoot
      colorPalette="primary"
      defaultValue={WINDOWS[0]?.label}
      maxW="20rem"
      variant="surface"
      {...props}
    >
      <Row align="stretch" gap="3">
        {WINDOWS.map((window) => (
          <RadioCardItem key={window.label} value={window.label}>
            <RadioCardItemHiddenInput />
            <RadioCardItemControl>
              <RadioCardItemContent>
                <RadioCardItemText>{window.label}</RadioCardItemText>
                <RadioCardItemDescription>{window.description}</RadioCardItemDescription>
              </RadioCardItemContent>
              <RadioCardItemIndicator />
            </RadioCardItemControl>
          </RadioCardItem>
        ))}
      </Row>
    </RadioCardRoot>
  );
}

export const variants: Scene = {
  about:
    "Two cards side by side rather than one, because they have to be the same height however much each says — which is what stretching them buys, and what a single card would never show.",
  draw: () => (
    <Matrix gap="8" knob="variant" of={VARIANTS}>
      {(variant) => <Cards variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about: "The padding and the words step together, so a pair of cards keeps its proportions.",
  draw: () => (
    <Matrix gap="6" knob="size" of={SIZES}>
      {(size) => <Cards size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const arrangements: Scene = {
  about:
    "Vertical puts the indicator above the words. The addon underneath is the one part that has to keep the card’s corner radius, and the label above the set is what a screen reader announces before the options.",
  draw: () => (
    <Matrix gap="8" knob="orientation" of={ORIENTATIONS}>
      {(orientation) => <Cards orientation={orientation} />}
    </Matrix>
  ),
  title: "Orientations",
};

export const addon: Scene = {
  about:
    "The row under the card’s own border, for a price or a note that is about the option rather than part of describing it.",
  draw: () => (
    <RadioCardRoot colorPalette="primary" defaultValue="Priority" maxW="20rem">
      <RadioCardLabel>Payout window</RadioCardLabel>
      <RadioCardItem value="Priority">
        <RadioCardItemHiddenInput />
        <RadioCardItemControl>
          <RadioCardItemContent>
            <RadioCardItemText>Priority</RadioCardItemText>
          </RadioCardItemContent>
          <RadioCardItemIndicator />
        </RadioCardItemControl>
        <RadioCardItemAddon>£12 per payout</RadioCardItemAddon>
      </RadioCardItem>
    </RadioCardRoot>
  ),
  title: "With a label and an addon",
};

export default specimen({
  about:
    "One choice out of several, each with room to explain itself. The whole card is the hit area, and every card in a set is the same height.",
  group: "Controls",
  id: "controls/radio-card",
  scenes: [variants, sizes, arrangements, addon],
  title: "Radio card",
});
