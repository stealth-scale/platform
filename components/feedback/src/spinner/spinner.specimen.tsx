/**
 * Shows the spinner at every size, in each ink, and at a slower turn.
 */

import { Matrix, Row, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Spinner } from "#spinner/spinner.ts";

/**
 * Every size a spinner takes.
 */
const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

export const sizes: Scene = {
  about:
    "The stroke thickens with the diameter, so the arc reads as the same shape at every size rather than as a hairline at the small end.",
  draw: () => (
    <Matrix direction="row" gap="6" knob="size" of={SIZES}>
      {(size) => <Spinner colorPalette="primary" size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const inks: Scene = {
  about:
    "Its colour and the ring it leaves behind are separate: `colorPalette` sets the moving arc and the track colour sets what it runs over, so a spinner on a dark panel needs both. The last one turns slowly, which is what to reach for when the wait is long enough that a fast spinner reads as panic.",
  draw: () => (
    <Row gap="8">
      <Spinner colorPalette="red" />
      <Spinner color="fg.muted" />
      <Spinner
        borderWidth="3px"
        colorPalette="primary"
        css={{ "--spinner-track-color": "colors.bg.emphasized" }}
      />
      <Spinner animationDuration="1.4s" colorPalette="primary" />
    </Row>
  ),
  title: "Inks and speed",
};

export const inline: Scene = {
  about:
    "At `inherit` it is the height of the line it sits in, which is what puts one inside a button or beside a sentence without the row growing.",
  draw: () => (
    <Row gap="3">
      <Spinner colorPalette="primary" size="inherit" />
      <Text>Sits on the line with the text beside it</Text>
    </Row>
  ),
  title: "On the line",
};

export default specimen({
  about:
    "Says that something is happening without saying how far along it is. Reach for it where there is no progress to report; where there is, report it.",
  group: "Feedback",
  id: "feedback/spinner",
  scenes: [sizes, inks, inline],
  title: "Spinner",
});
