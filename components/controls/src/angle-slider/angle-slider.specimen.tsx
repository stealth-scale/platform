/**
 * Shows the angle slider plain, and with markers at every quarter turn.
 */

import { type ReactElement } from "react";

import { Column, Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { AngleSliderContext } from "#angle-slider/angle-slider.recipe.ts";
import {
  AngleSliderControl,
  AngleSliderHiddenInput,
  AngleSliderLabel,
  AngleSliderMarker,
  AngleSliderMarkerGroup,
  AngleSliderRing,
  AngleSliderRoot,
  AngleSliderThumb,
  AngleSliderThumbIndicator,
  AngleSliderValueText,
} from "#angle-slider/angle-slider.tsx";

/**
 * Where the markers sit, one at every quarter turn.
 */
const QUARTERS = [0, 90, 180, 270];

/**
 * Whether the dial carries markers, and what each case starts at.
 */
const DIALS = [
  { angle: 45, markers: false },
  { angle: 290, markers: true },
];

/**
 * Describes the props of {@link Dial}.
 */
interface DialProps {
  /**
   * Where the thumb starts, in degrees.
   */
  angle: number;

  /**
   * Whether the quarter-turn markers are drawn around the ring.
   */
  markers: boolean;
}

/**
 * Draws one dial: the ring and thumb inside the control, then the value and its caption in the
 * middle of the ring.
 *
 * The degree sign is the caller's, because `AngleSliderValueText` writes the figure alone.
 *
 * @param props - The dial. `DialProps` documents every member.
 * @returns One dial, ready to turn.
 */
function Dial(props: DialProps): ReactElement {
  return (
    <AngleSliderRoot colorPalette="primary" defaultValue={props.angle}>
      <AngleSliderControl>
        <AngleSliderRing />
        {props.markers ? (
          <AngleSliderMarkerGroup>
            {QUARTERS.map((value) => (
              <AngleSliderMarker key={value} value={value} />
            ))}
          </AngleSliderMarkerGroup>
        ) : null}
        <AngleSliderThumb>
          <AngleSliderThumbIndicator />
        </AngleSliderThumb>
      </AngleSliderControl>

      <Column align="center" gap="0">
        <AngleSliderContext>
          {(dial) => <AngleSliderValueText>{`${String(dial.value)}°`}</AngleSliderValueText>}
        </AngleSliderContext>
        <AngleSliderLabel>degrees</AngleSliderLabel>
      </Column>

      <AngleSliderHiddenInput />
    </AngleSliderRoot>
  );
}

export const markers: Scene = {
  about:
    "Drag around the ring, or focus the thumb and use the arrow keys. The markers are what make a quarter turn findable without looking at the figure — reach for them where the value means something at particular angles.",
  draw: () => (
    <Matrix
      direction="row"
      gap="12"
      knob="markers"
      label={(dial) => String(dial.markers)}
      of={DIALS}
    >
      {(dial) => <Dial angle={dial.angle} markers={dial.markers} />}
    </Matrix>
  ),
  title: "With and without markers",
};

export default specimen({
  about:
    "A value picked by turning a ring, in degrees. Reach for it where the value is an angle — a gradient, a rotation, a heading — and for a slider everywhere else.",
  group: "Controls",
  id: "controls/angle-slider",
  scenes: [markers],
  title: "Angle slider",
});
