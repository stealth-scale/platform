/**
 * Shows the checkbox in every variant and size, in each state it can hold, and in a group.
 */

import { type ReactElement } from "react";

import { Column, Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  CheckboxControl,
  CheckboxGroup,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  type CheckboxRootProps,
} from "#checkbox/checkbox.ts";

/**
 * How the box is filled once it is on.
 */
const VARIANTS = ["outline", "solid", "subtle"] as const;

/**
 * How large it is.
 */
const SIZES = ["xs", "sm", "md", "lg"] as const;

/**
 * What the group offers.
 */
const NOTICES = ["Payouts", "Queries", "Exports"];

/**
 * Describes the props of {@link Tick}.
 */
interface TickProps extends Omit<CheckboxRootProps, "children"> {
  /**
   * What the box is labelled.
   */
  label: string;
}

/**
 * Draws one box and its label.
 *
 * @param props - The box. `TickProps` documents every member.
 * @returns One labelled box.
 */
function Tick(props: TickProps): ReactElement {
  const { label, ...root } = props;

  return (
    <CheckboxRoot colorPalette="primary" {...root}>
      <CheckboxHiddenInput />
      <CheckboxControl>
        <CheckboxIndicator />
      </CheckboxControl>
      <CheckboxLabel>{label}</CheckboxLabel>
    </CheckboxRoot>
  );
}

export const variants: Scene = {
  about:
    "How the box is filled once it is on. Off it is the same in all three, so every one here is drawn checked.",
  draw: () => (
    <Matrix gap="6" knob="variant" of={VARIANTS}>
      {(variant) => <Tick defaultChecked label="Notify me" variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "The box and its label step together, so a column of mixed controls lines up on the label rather than on the box.",
  draw: () => (
    <Matrix direction="row" gap="8" knob="size" of={SIZES}>
      {(size) => <Tick defaultChecked label="Notify me" size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const states: Scene = {
  about:
    "Indeterminate is the one that has to be set rather than reached: it is what a parent box shows when some of its children are on, so nothing a reader does here will produce it.",
  draw: () => (
    <Row gap="8">
      <Tick checked={false} label="Off" />
      <Tick checked label="On" />
      <Tick checked="indeterminate" label="Indeterminate" />
      <Tick disabled label="Disabled" />
      <Tick invalid label="Invalid" />
      <Tick label="Read only" readOnly />
    </Row>
  ),
  title: "States",
};

export const grouped: Scene = {
  about:
    "A group holds the value for every box under it, so each one states only what it is worth rather than whether it is on.",
  draw: () => (
    <CheckboxGroup defaultValue={["Payouts"]}>
      <Column gap="2">
        {NOTICES.map((notice) => (
          <Tick key={notice} label={notice} value={notice} />
        ))}
      </Column>
    </CheckboxGroup>
  ),
  title: "In a group",
};

export default specimen({
  about:
    "A box that is on, off, or neither. The third is for a parent standing over children that disagree.",
  group: "Controls",
  id: "controls/checkbox",
  scenes: [variants, sizes, states, grouped],
  title: "Checkbox",
});
