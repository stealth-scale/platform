/**
 * Shows the slider in both variants and every size, upright, ranged, and with marks.
 */

import { type ReactElement } from "react";

import { Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  SliderControl,
  SliderLabel,
  SliderMarker,
  SliderMarkerGroup,
  SliderMarkerIndicator,
  SliderMarkerLabel,
  SliderRange,
  SliderRoot,
  type SliderRootProps,
  SliderThumb,
  SliderTrack,
  SliderValueText,
} from "#slider/slider.ts";

/**
 * How the track is drawn.
 */
const VARIANTS = ["outline", "solid"] as const;

/**
 * How thick it is.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Where the marks sit.
 */
const MARKS = [0, 25, 50, 75, 100];

/**
 * Draws one slider, with a thumb per value it holds.
 *
 * A range is two thumbs on one track, so the thumbs are drawn from the value rather than written
 * out: that way one slider and two are the same markup.
 *
 * @param props - Whichever of them the scene is turning. `SliderRootProps` documents every member.
 * @returns One slider.
 */
function Dial(props: Omit<SliderRootProps, "children">): ReactElement {
  const values = props.defaultValue ?? [40];

  return (
    <SliderRoot colorPalette="primary" {...props}>
      <SliderControl>
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        {values.map((value, index) => (
          <SliderThumb index={index} key={value} />
        ))}
      </SliderControl>
    </SliderRoot>
  );
}

export const variants: Scene = {
  about:
    "Whether the part behind the thumb is a rule or a fill. Outline is the one to check on a panel, where a hairline track can vanish into the surface under it.",
  draw: () => (
    <Matrix gap="8" knob="variant" of={VARIANTS}>
      {(variant) => <Dial variant={variant} width="16rem" />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "The thumb grows with the track. What matters at the small end is the thumb rather than the track: it is the part that has to be caught with a finger.",
  draw: () => (
    <Matrix gap="6" knob="size" of={SIZES}>
      {(size) => <Dial size={size} width="16rem" />}
    </Matrix>
  ),
  title: "Sizes",
};

export const shapes: Scene = {
  about:
    "A range is two thumbs on one track and neither may pass the other. Upright, the same component runs bottom to top, which is what a volume or a level wants.",
  draw: () => (
    <Row align="end" gap="10">
      <Dial defaultValue={[20, 70]} width="16rem" />
      <Dial defaultValue={[60]} height="8rem" orientation="vertical" />
      <SliderRoot colorPalette="primary" defaultValue={[40]} width="12rem">
        <Row justify="space-between">
          <SliderLabel>Threshold</SliderLabel>
          <SliderValueText />
        </Row>
        <SliderControl>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>
          <SliderThumb index={0} />
        </SliderControl>
      </SliderRoot>
    </Row>
  ),
  title: "Ranged, upright and labelled",
};

export const marks: Scene = {
  about:
    "Each mark sits at its own value along the track and its label hangs under it, so an off-by-one in the arithmetic shows immediately — the first and last are the ones to check.",
  draw: () => (
    <SliderRoot colorPalette="primary" defaultValue={[50]} width="16rem">
      <SliderControl>
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        <SliderThumb index={0} />
        <SliderMarkerGroup>
          {MARKS.map((mark) => (
            <SliderMarker key={mark} value={mark}>
              <SliderMarkerIndicator />
              <SliderMarkerLabel>{mark}</SliderMarkerLabel>
            </SliderMarker>
          ))}
        </SliderMarkerGroup>
      </SliderControl>
    </SliderRoot>
  ),
  title: "With marks",
};

export default specimen({
  about:
    "A value picked along a track, or two values picked as a range. Reach for it where the figure is approximate; reach for a number field where it is exact.",
  group: "Controls",
  id: "controls/slider",
  scenes: [variants, sizes, shapes, marks],
  title: "Slider",
});
