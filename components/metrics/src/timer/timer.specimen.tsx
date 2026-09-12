/**
 * Shows the timer counting, in both variants, at every size, and over each unit it can show.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  TimerActionTrigger,
  TimerArea,
  TimerControl,
  TimerItem,
  TimerRoot,
  type TimerRootProps,
  TimerSeparator,
} from "#timer/timer.ts";

/**
 * How the digits are drawn.
 */
const VARIANTS = ["plain", "tiles"] as const;

/**
 * How large they are.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Two days, three hours and change, so every unit has something in it.
 */
const LONG = 2 * 86_400_000 + 3 * 3_600_000 + 14 * 60_000 + 5000;

/**
 * Draws the buttons that drive a timer.
 *
 * @returns The four actions a timer takes.
 */
function Controls(): ReactElement {
  return (
    <TimerControl>
      <TimerActionTrigger action="start">Start</TimerActionTrigger>
      <TimerActionTrigger action="pause">Pause</TimerActionTrigger>
      <TimerActionTrigger action="resume">Resume</TimerActionTrigger>
      <TimerActionTrigger action="reset">Reset</TimerActionTrigger>
    </TimerControl>
  );
}

/**
 * Draws a running countdown over minutes and seconds.
 *
 * It starts itself, since a timer at rest says nothing about a timer.
 *
 * @param props - Whichever of them the scene is turning. `TimerRootProps` documents every member.
 * @returns One countdown, with the buttons that drive it.
 */
function Countdown(props: Omit<TimerRootProps, "children">): ReactElement {
  return (
    <TimerRoot autoStart colorPalette="primary" countdown startMs={125_000} {...props}>
      <TimerArea>
        <TimerItem type="minutes" />
        <TimerSeparator>:</TimerSeparator>
        <TimerItem type="seconds" />
      </TimerArea>
      <Controls />
    </TimerRoot>
  );
}

export const variants: Scene = {
  about:
    "Tiles put each digit in a box of its own, which stops the row from shuffling as the numbers change width. Plain leaves them to the type, which is right where the timer is a line of prose rather than a display.",
  draw: () => (
    <Matrix gap="12" knob="variant" of={VARIANTS}>
      {(variant) => <Countdown variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about: "The digits and the separators step together, so the colon stays centred at every size.",
  draw: () => (
    <Matrix direction="row" gap="10" knob="size" of={SIZES}>
      {(size) => <Countdown size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const units: Scene = {
  about:
    "Every unit it can show, over a span long enough that none of them sits at zero. A unit left out is not rolled into the next one, so a timer showing only minutes counts past sixty.",
  draw: () => (
    <TimerRoot autoStart colorPalette="primary" countdown startMs={LONG} variant="tiles">
      <TimerArea>
        <TimerItem type="days" />
        <TimerSeparator>:</TimerSeparator>
        <TimerItem type="hours" />
        <TimerSeparator>:</TimerSeparator>
        <TimerItem type="minutes" />
        <TimerSeparator>:</TimerSeparator>
        <TimerItem type="seconds" />
      </TimerArea>
    </TimerRoot>
  ),
  title: "Units",
};

export const counting: Scene = {
  about:
    "Counting up rather than down, and ticking every sixteen milliseconds. Milliseconds only move if the machine is asked to tick faster than its default second — shown without that, the last two digits sit still and the component looks broken.",
  draw: () => (
    <TimerRoot autoStart colorPalette="primary" interval={16}>
      <TimerArea>
        <TimerItem type="minutes" />
        <TimerSeparator>:</TimerSeparator>
        <TimerItem type="seconds" />
        <TimerSeparator>.</TimerSeparator>
        <TimerItem type="milliseconds" />
      </TimerArea>
      <Controls />
    </TimerRoot>
  ),
  title: "Counting up",
};

export default specimen({
  about:
    "Counts time down to an instant, or up from one. Which units it shows is stated rather than derived, so a timer showing only minutes keeps counting past sixty.",
  group: "Metrics",
  id: "metrics/timer",
  scenes: [variants, sizes, units, counting],
  title: "Timer",
});
