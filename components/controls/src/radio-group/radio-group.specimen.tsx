/**
 * Shows the radio group in every variant and size, in both directions, and in each state.
 */

import { type ReactElement, type ReactNode } from "react";

import { Column, Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupLabel,
  RadioGroupRoot,
  type RadioGroupRootProps,
} from "#radio-group/radio-group.ts";

/**
 * How the dot is filled once it is on.
 */
const VARIANTS = ["outline", "subtle", "solid"] as const;

/**
 * How large it is.
 */
const SIZES = ["xs", "sm", "md", "lg"] as const;

/**
 * What can be picked.
 */
const WINDOWS = ["Same day", "Next day", "Weekly"];

/**
 * Describes the props of {@link Windows}.
 */
interface WindowsProps extends Omit<RadioGroupRootProps, "children"> {
  /**
   * What sits above the items, where the group is labelled.
   */
  children?: ReactNode;

  /**
   * Which item is unavailable.
   */
  closed?: string;

  /**
   * Lays the items out across rather than down.
   */
  inline?: boolean;
}

/**
 * Draws the three windows as one group.
 *
 * @param props - The group. `WindowsProps` documents every member.
 * @returns One group of three.
 */
function Windows(props: WindowsProps): ReactElement {
  const { children, closed, inline = false, ...root } = props;
  const Line = inline ? Row : Column;

  return (
    <RadioGroupRoot colorPalette="primary" {...root}>
      {children}
      <Line gap={inline ? "6" : "2"}>
        {WINDOWS.map((window) => (
          <RadioGroupItem disabled={window === closed} key={window} value={window}>
            <RadioGroupItemHiddenInput />
            <RadioGroupItemControl />
            <RadioGroupItemText>{window}</RadioGroupItemText>
          </RadioGroupItem>
        ))}
      </Line>
    </RadioGroupRoot>
  );
}

export const variants: Scene = {
  about:
    "Only one item can be on, so the same one is picked in every cell: what changes is the dot, not which row is chosen.",
  draw: () => (
    <Matrix direction="row" gap="10" knob="variant" of={VARIANTS}>
      {(variant) => <Windows defaultValue="Same day" variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "The dot and the words step together, so a column of items keeps its rhythm at every size.",
  draw: () => (
    <Matrix direction="row" gap="10" knob="size" of={SIZES}>
      {(size) => <Windows defaultValue="Same day" size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const states: Scene = {
  about:
    "A group is labelled once rather than each item being labelled, which is what makes a screen reader announce the question before the answers. Invalid is stated on the group for the same reason: it is the choice that is wrong, not any one option.",
  draw: () => (
    <Column gap="8">
      <Windows closed="Weekly" defaultValue="Next day" inline>
        <RadioGroupLabel>Payout window</RadioGroupLabel>
      </Windows>
      <Windows inline invalid />
    </Column>
  ),
  title: "Labelled, disabled and invalid",
};

export default specimen({
  about:
    "One choice out of several, all of them on show. Reach for a select where there are too many to show, and for a switch where the choice is yes or no.",
  group: "Controls",
  id: "controls/radio-group",
  scenes: [variants, sizes, states],
  title: "Radio group",
});
