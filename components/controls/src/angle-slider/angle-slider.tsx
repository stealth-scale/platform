/**
 * The angle slider: a value from 0 to 360 set by dragging a thumb around a dial.
 *
 * Ark supplies the behaviour, and the look is the recipe from Ark's own angle slider page retuned
 * to this repository's tokens.
 *
 * Four slots are declared past the anatomy, and Ark names no part for any of them. The ring is an
 * `<svg>` holding a track circle and a range circle rather than one element, so it takes three of
 * them, and the thumb's dot takes the fourth. The range is drawn by dashing its own circumference,
 * which is what ends the arc round rather than cut square. The svg is {@link AngleSliderRing}.
 *
 * Zag puts `--value` and `--angle` on the root and an inline `rotate` on the thumb and on every
 * marker. The thumb is therefore a full-height bar, pivoting about the middle of the dial, and its
 * indicator is a dot at the bar's top edge.
 *
 * The root is a square that centres what it holds, and the control lies over it, so the value and
 * the label sit inside the ring. A caller writes the control first, then the value, then the
 * label.
 */

import { type ReactElement } from "react";

import { type Assign } from "@ark-ui/react";
import { AngleSlider as Ark, useAngleSliderContext } from "@ark-ui/react/angle-slider";
import {
  chakra,
  type HTMLChakraProps,
  type RecipeVariantProps,
  type UnstyledProp,
} from "@chakra-ui/react";

import {
  PropsProvider,
  recipe,
  RING,
  withContext,
  withProvider,
} from "#angle-slider/angle-slider.recipe.ts";

/**
 * Describes what an angle slider takes beyond an element's own props.
 */
export interface AngleSliderRootBaseProps
  extends Assign<Ark.RootBaseProps, RecipeVariantProps<typeof recipe>>, UnstyledProp {}

/**
 * Describes the props of {@link AngleSliderRoot}.
 */
export interface AngleSliderRootProps extends HTMLChakraProps<"div", AngleSliderRootBaseProps> {}

/**
 * Holds the dial, owns the angle every part below reads, and centres the value inside the ring.
 */
export const AngleSliderRoot = withProvider<HTMLDivElement, AngleSliderRootProps>(
  Ark.Root,
  "root",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link AngleSliderRootProvider}.
 */
export interface AngleSliderRootProviderProps extends HTMLChakraProps<
  "div",
  Assign<Ark.RootProviderBaseProps, RecipeVariantProps<typeof recipe>> & UnstyledProp
> {}

/**
 * Holds the dial against state built outside it by `useAngleSlider`.
 */
export const AngleSliderRootProvider = withProvider<HTMLDivElement, AngleSliderRootProviderProps>(
  Ark.RootProvider,
  "root",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link AngleSliderControl}.
 */
export interface AngleSliderControlProps
  extends HTMLChakraProps<"div", Ark.ControlBaseProps>, UnstyledProp {}

/**
 * Lies over the whole dial, and is what a pointer turns.
 */
export const AngleSliderControl = withContext<HTMLDivElement, AngleSliderControlProps>(
  Ark.Control,
  "control",
  { forwardAsChild: true },
);

/**
 * The `<svg>` the ring is drawn in.
 */
const Ring = withContext<SVGSVGElement, HTMLChakraProps<"svg">>(chakra.svg, "ring");

/**
 * The circle the whole way round, under the filled part.
 */
const RingTrack = withContext<SVGCircleElement, HTMLChakraProps<"circle">>(
  chakra.circle,
  "ringTrack",
);

/**
 * The filled part, dashed to end wherever the angle does.
 */
const RingRange = withContext<SVGCircleElement, HTMLChakraProps<"circle">>(
  chakra.circle,
  "ringRange",
);

/**
 * Draws the ring: a track the whole way round and a range as far as the current angle.
 *
 * The range is one circle whose dash is its own circumference, offset by how much of the turn is
 * left, which is what gives a rounded end rather than a square one. Both numbers are worked out
 * here rather than in the recipe, because the offset changes on every pointer move and a value in
 * the recipe would mint a class for each degree.
 *
 * @returns The ring, sized by the root's `--size` and `--thickness`.
 */
export function AngleSliderRing(): ReactElement {
  const angleSlider = useAngleSliderContext();
  const circumference = 2 * Math.PI * (RING.size / 2 - RING.thickness / 2);

  return (
    <Ring aria-hidden viewBox={`0 0 ${String(RING.size)} ${String(RING.size)}`}>
      <RingTrack />
      <RingRange
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: circumference * (1 - angleSlider.value / 360),
        }}
      />
    </Ring>
  );
}

/**
 * Describes the props of {@link AngleSliderThumb}.
 */
export interface AngleSliderThumbProps
  extends HTMLChakraProps<"div", Ark.ThumbBaseProps>, UnstyledProp {}

/**
 * The bar a person drags. Zag turns it about the middle of the dial, so what a reader sees is the
 * indicator it holds at its top edge.
 */
export const AngleSliderThumb = withContext<HTMLDivElement, AngleSliderThumbProps>(
  Ark.Thumb,
  "thumb",
  { forwardAsChild: true },
);

/**
 * The dot on the ring, sitting at the top of the thumb's bar.
 */
export const AngleSliderThumbIndicator = withContext<HTMLSpanElement, HTMLChakraProps<"span">>(
  chakra.span,
  "thumbIndicator",
);

/**
 * Describes the props of {@link AngleSliderMarkerGroup}.
 */
export interface AngleSliderMarkerGroupProps
  extends HTMLChakraProps<"div", Ark.MarkerGroupBaseProps>, UnstyledProp {}

/**
 * Holds the markers, over the ring and out of the way of a pointer.
 */
export const AngleSliderMarkerGroup = withContext<HTMLDivElement, AngleSliderMarkerGroupProps>(
  Ark.MarkerGroup,
  "markerGroup",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link AngleSliderMarker}.
 */
export interface AngleSliderMarkerProps
  extends HTMLChakraProps<"div", Ark.MarkerBaseProps>, UnstyledProp {}

/**
 * One tick on the ring, coloured by whether the value has passed it.
 */
export const AngleSliderMarker = withContext<HTMLDivElement, AngleSliderMarkerProps>(
  Ark.Marker,
  "marker",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link AngleSliderValueText}.
 */
export interface AngleSliderValueTextProps
  extends HTMLChakraProps<"div", Ark.ValueTextBaseProps>, UnstyledProp {}

/**
 * Reads the angle out in figures, in the middle of the ring.
 */
export const AngleSliderValueText = withContext<HTMLDivElement, AngleSliderValueTextProps>(
  Ark.ValueText,
  "valueText",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link AngleSliderLabel}.
 */
export interface AngleSliderLabelProps
  extends HTMLChakraProps<"label", Ark.LabelBaseProps>, UnstyledProp {}

/**
 * Names the dial, under the value.
 */
export const AngleSliderLabel = withContext<HTMLLabelElement, AngleSliderLabelProps>(
  Ark.Label,
  "label",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link AngleSliderHiddenInput}.
 */
export interface AngleSliderHiddenInputProps
  extends HTMLChakraProps<"input", Ark.HiddenInputBaseProps>, UnstyledProp {}

/**
 * Carries the value into a form submission. Ark names no slot for it, so it takes no styling.
 */
export const AngleSliderHiddenInput = withContext<HTMLInputElement, AngleSliderHiddenInputProps>(
  Ark.HiddenInput,
  undefined,
  { forwardAsChild: true },
);

/**
 * Sets the props every angle slider under it takes by default.
 */
export const AngleSliderPropsProvider = PropsProvider;
