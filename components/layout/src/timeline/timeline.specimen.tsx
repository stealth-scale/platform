/**
 * Shows the timeline in every variant, and at every size.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineIndicator,
  TimelineItem,
  TimelineRoot,
  type TimelineRootProps,
  TimelineSeparator,
  TimelineTitle,
} from "#timeline/timeline.ts";

/**
 * Every way the rail is drawn.
 */
const VARIANTS = ["solid", "subtle", "outline", "plain"] as const;

/**
 * Every size a timeline takes.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * What happened, in the order it happened.
 */
const EVENTS = [
  { at: "Tuesday", what: "Offer raised" },
  { at: "Wednesday", what: "Accepted" },
  { at: "Friday", what: "Settled" },
] as const;

/**
 * Draws the same three events, however the timeline around them is set.
 *
 * @param props - Whichever of them the scene is turning. `TimelineRootProps` documents every
 *   member.
 * @returns One timeline.
 */
function Events(props: TimelineRootProps): ReactElement {
  return (
    <TimelineRoot colorPalette="primary" maxW="14rem" {...props}>
      {EVENTS.map((event, index) => (
        <TimelineItem key={event.what}>
          <TimelineConnector>
            <TimelineSeparator />
            <TimelineIndicator>{index + 1}</TimelineIndicator>
          </TimelineConnector>
          <TimelineContent>
            <TimelineTitle>{event.what}</TimelineTitle>
            <TimelineDescription>{event.at}</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      ))}
    </TimelineRoot>
  );
}

export const variants: Scene = {
  about:
    "Three events is the fewest that shows the rail doing its job: the separator runs between the first indicator and the last and stops there, and a rail that overshoots only gives itself away at the ends.",
  draw: () => (
    <Matrix knob="variant" of={VARIANTS}>
      {(variant) => <Events variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "The indicator, the rail and the text all step together. What changes with the size is the diameter of the indicator, and the rail has to stay centred under it at every one.",
  draw: () => (
    <Matrix direction="row" gap="10" knob="size" of={SIZES}>
      {(size) => <Events size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export default specimen({
  about:
    "What happened, in the order it happened, against a rail that runs the length of the entries and no further.",
  group: "Layout",
  id: "layout/timeline",
  scenes: [variants, sizes],
  title: "Timeline",
});
