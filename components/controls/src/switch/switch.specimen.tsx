/**
 * Shows the switch in both variants and every size, in each state, and carrying its own marks.
 */

import { type ReactElement } from "react";

import { CheckIcon, XIcon } from "lucide-react";

import { Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchRoot,
  type SwitchRootProps,
  SwitchThumb,
  SwitchThumbIndicator,
} from "#switch/switch.ts";

/**
 * How the track is drawn.
 */
const VARIANTS = ["solid", "raised"] as const;

/**
 * How large it is.
 */
const SIZES = ["xs", "sm", "md", "lg"] as const;

/**
 * Describes the props of {@link Toggle}.
 */
interface ToggleProps extends Omit<SwitchRootProps, "children"> {
  /**
   * What the switch is labelled.
   */
  label: string;
}

/**
 * Draws one switch and its label.
 *
 * @param props - The switch. `ToggleProps` documents every member.
 * @returns One labelled switch.
 */
function Toggle(props: ToggleProps): ReactElement {
  const { label, ...root } = props;

  return (
    <SwitchRoot colorPalette="primary" {...root}>
      <SwitchHiddenInput />
      <SwitchControl>
        <SwitchThumb />
      </SwitchControl>
      <SwitchLabel>{label}</SwitchLabel>
    </SwitchRoot>
  );
}

export const variants: Scene = {
  about:
    "Drawn off as well as on, because off is the state that fails: a raised knob is white on a pale track, and with only a hairline shadow under it there is nothing to see.",
  draw: () => (
    <Matrix gap="6" knob="variant" of={VARIANTS}>
      {(variant) => (
        <Row gap="8">
          <Toggle label="Off" variant={variant} />
          <Toggle defaultChecked label="On" variant={variant} />
        </Row>
      )}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "The track, the knob and the label step together. At `xs` the knob is small enough that the travel is the only thing saying which way it is set.",
  draw: () => (
    <Matrix direction="row" gap="8" knob="size" of={SIZES}>
      {(size) => <Toggle defaultChecked label="Notify" size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const states: Scene = {
  about:
    "A switch takes effect the moment it is moved, so there is no submitting it. That is the reason to reach for one instead of a checkbox — and the reason not to, where the change should wait.",
  draw: () => (
    <Row gap="8">
      <Toggle label="Off" />
      <Toggle defaultChecked disabled label="Disabled" />
      <Toggle invalid label="Invalid" />
      <Toggle label="Read only" readOnly />
    </Row>
  ),
  title: "States",
};

export const marks: Scene = {
  about:
    "The thumb indicator puts a mark inside the knob rather than on the track, so it swaps as the switch moves. It has to stay legible at the smallest size, which is what rules out anything with detail in it.",
  draw: () => (
    <SwitchRoot colorPalette="primary" defaultChecked size="lg">
      <SwitchHiddenInput />
      <SwitchControl>
        <SwitchThumb>
          <SwitchThumbIndicator fallback={<XIcon size={10} />}>
            <CheckIcon size={10} />
          </SwitchThumbIndicator>
        </SwitchThumb>
      </SwitchControl>
      <SwitchLabel>With marks</SwitchLabel>
    </SwitchRoot>
  ),
  title: "With a mark in the knob",
};

export default specimen({
  about:
    "On or off, taking effect the moment it moves. Reach for a checkbox where the change should wait for a form to be submitted.",
  group: "Controls",
  id: "controls/switch",
  scenes: [variants, sizes, states, marks],
  title: "Switch",
});
