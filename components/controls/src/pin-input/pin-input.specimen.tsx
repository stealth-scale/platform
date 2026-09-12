/**
 * Shows the code field in every variant and size, attached, masked, and with more boxes.
 */

import { type ReactElement } from "react";

import { Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  PinInputControl,
  PinInputHiddenInput,
  PinInputInput,
  PinInputLabel,
  PinInputRoot,
  type PinInputRootProps,
} from "#pin-input/pin-input.ts";

/**
 * How the boxes are bordered.
 */
const VARIANTS = ["outline", "subtle", "flushed"] as const;

/**
 * How large they are.
 */
const SIZES = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl"] as const;

/**
 * Describes the props of {@link Code}.
 */
interface CodeProps extends Omit<PinInputRootProps, "children"> {
  /**
   * How many boxes to draw.
   */
  count?: number;
}

/**
 * Draws one code field with as many boxes as it is asked for.
 *
 * @param props - The code field. `CodeProps` documents every member.
 * @returns One code field.
 */
function Code(props: CodeProps): ReactElement {
  const { count = 4, ...root } = props;

  return (
    <PinInputRoot colorPalette="primary" {...root}>
      <PinInputHiddenInput />
      <PinInputControl>
        {Array.from({ length: count }, (_, index) => (
          <PinInputInput index={index} key={index} />
        ))}
      </PinInputControl>
    </PinInputRoot>
  );
}

export const variants: Scene = {
  about:
    "A code field is several boxes that behave as one control: typing moves to the next, backspace moves back, and pasting a whole code fills them all.",
  draw: () => (
    <Matrix knob="variant" of={VARIANTS}>
      {(variant) => <Code variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "Each box is square, so the size sets both dimensions at once. At `2xs` a six-figure code still fits on a narrow phone, which is the reason the small end goes as far as it does.",
  draw: () => (
    <Matrix gap="4" knob="size" of={SIZES}>
      {(size) => <Code size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const shapes: Scene = {
  about:
    "Attached joins the boxes into one strip, which is the shape a one-time code usually takes. Masked hides the figures the way a passphrase field does, and the type decides whether letters are accepted at all.",
  draw: () => (
    <Row align="end" gap="8">
      <Code attached />
      <Code defaultValue={["1", "2", "3", "4"]} mask />
      <Code count={6} />
      <Code type="alphanumeric" />
      <PinInputRoot colorPalette="primary">
        <PinInputLabel>One-time code</PinInputLabel>
        <PinInputHiddenInput />
        <PinInputControl>
          {Array.from({ length: 4 }, (_, index) => (
            <PinInputInput index={index} key={index} />
          ))}
        </PinInputControl>
      </PinInputRoot>
    </Row>
  ),
  title: "Attached, masked and labelled",
};

export default specimen({
  about:
    "Several boxes that behave as one control, for a code that arrives by message. Typing moves along, and pasting a whole code fills every box.",
  group: "Controls",
  id: "controls/pin-input",
  scenes: [variants, sizes, shapes],
  title: "Pin input",
});
