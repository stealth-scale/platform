/**
 * Shows the colour picker at every size, with the area, the sliders and the swatches.
 */

import { type ReactElement } from "react";

import { Column, Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  ColorPickerArea,
  ColorPickerAreaBackground,
  ColorPickerAreaThumb,
  ColorPickerChannelInput,
  ColorPickerChannelSlider,
  ColorPickerChannelSliderThumb,
  ColorPickerChannelSliderTrack,
  ColorPickerContent,
  ColorPickerControl,
  ColorPickerEyeDropperTrigger,
  ColorPickerFormatSelect,
  ColorPickerHiddenInput,
  ColorPickerInput,
  ColorPickerLabel,
  ColorPickerPositioner,
  ColorPickerRoot,
  type ColorPickerRootProps,
  ColorPickerSwatch,
  ColorPickerSwatchGroup,
  ColorPickerSwatchIndicator,
  ColorPickerSwatchTrigger,
  ColorPickerTrigger,
  ColorPickerValueSwatch,
  parseColor,
} from "#color-picker/color-picker.ts";

/**
 * How the trigger is bordered.
 */
const VARIANTS = ["outline", "subtle"] as const;

/**
 * How large it is.
 */
const SIZES = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl"] as const;

/**
 * What the swatch row offers.
 */
const SWATCHES = ["#3b82f6", "#a855f7", "#f97316", "#22c55e", "#ef4444"];

/**
 * Draws one picker: the field and its swatch, and the panel it opens.
 *
 * @param props - Whichever of them the scene is turning. `ColorPickerRootProps` documents every
 *   member.
 * @returns One picker.
 */
function Picker(props: Omit<ColorPickerRootProps, "children">): ReactElement {
  return (
    <ColorPickerRoot defaultValue={parseColor("#3b82f6")} width="12rem" {...props}>
      <ColorPickerHiddenInput />
      <ColorPickerLabel>Brand colour</ColorPickerLabel>
      <ColorPickerControl>
        <ColorPickerInput />
        <ColorPickerTrigger>
          <ColorPickerValueSwatch />
        </ColorPickerTrigger>
      </ColorPickerControl>
      <ColorPickerPositioner>
        <ColorPickerContent>
          <ColorPickerArea>
            <ColorPickerAreaBackground />
            <ColorPickerAreaThumb />
          </ColorPickerArea>

          <Row gap="2">
            <ColorPickerEyeDropperTrigger />
            <Column gap="1" grows>
              <ColorPickerChannelSlider channel="hue">
                <ColorPickerChannelSliderTrack />
                <ColorPickerChannelSliderThumb />
              </ColorPickerChannelSlider>
              <ColorPickerChannelSlider channel="alpha">
                <ColorPickerChannelSliderTrack />
                <ColorPickerChannelSliderThumb />
              </ColorPickerChannelSlider>
            </Column>
          </Row>

          <Row gap="2">
            <ColorPickerFormatSelect />
            <ColorPickerChannelInput channel="hex" />
          </Row>

          <ColorPickerSwatchGroup>
            {SWATCHES.map((swatch) => (
              <ColorPickerSwatchTrigger key={swatch} value={swatch}>
                <ColorPickerSwatch value={swatch}>
                  <ColorPickerSwatchIndicator />
                </ColorPickerSwatch>
              </ColorPickerSwatchTrigger>
            ))}
          </ColorPickerSwatchGroup>
        </ColorPickerContent>
      </ColorPickerPositioner>
    </ColorPickerRoot>
  );
}

export const variants: Scene = {
  about:
    "Open one. The area sets two channels at once and the sliders under it set the third and the alpha, which is why the panel has to be drawn to be judged at all.",
  draw: () => (
    <Matrix direction="row" gap="6" knob="variant" of={VARIANTS}>
      {(variant) => <Picker variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "What the size sets is the field and its swatch; the panel is the same in all of them, because a picker that shrank its own area would be a picker nobody could aim in.",
  draw: () => (
    <Matrix direction="row" gap="4" knob="size" of={SIZES}>
      {(size) => <Picker size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const states: Scene = {
  about:
    "The translucent one is the case to watch: the swatch has to show a chequerboard behind the colour, or a half-transparent value looks like a lighter opaque one.",
  draw: () => (
    <Row align="start" gap="6">
      <Picker disabled />
      <Picker defaultValue={parseColor("hsla(217, 91%, 60%, 0.4)")} />
    </Row>
  ),
  title: "Disabled and translucent",
};

export default specimen({
  about:
    "A colour picked by eye, by figure, or from a set of swatches. The field and the panel are separate parts, so a picker can be a field, a swatch, or both.",
  group: "Controls",
  id: "controls/color-picker",
  scenes: [variants, sizes, states],
  title: "Color picker",
});
