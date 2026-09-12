/**
 * Shows the date typed a segment at a time, at every size and over several locales.
 */

import { type ReactElement } from "react";

import { Column, Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  DateInputControl,
  DateInputHiddenInput,
  DateInputLabel,
  DateInputRoot,
  type DateInputRootProps,
  DateInputSegments,
} from "#date-input/date-input.ts";

/**
 * How large the field is.
 */
const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

/**
 * Which locales are worth trying, since each orders the segments differently.
 */
const LOCALES = ["en-GB", "en-US", "ja-JP"] as const;

/**
 * Draws one field, one box per segment of the date.
 *
 * @param props - Whichever of them the scene is turning. `DateInputRootProps` documents every
 *   member.
 * @returns One field.
 */
function Segments(props: Omit<DateInputRootProps, "children">): ReactElement {
  return (
    <DateInputRoot colorPalette="primary" {...props}>
      <DateInputHiddenInput />
      <DateInputControl>
        <DateInputSegments />
      </DateInputControl>
    </DateInputRoot>
  );
}

export const sizes: Scene = {
  about:
    "Each segment is its own box, and typing moves along them. Arrow keys step the segment under the cursor rather than moving between them, which is what makes a date typeable without a calendar.",
  draw: () => (
    <Matrix gap="6" knob="size" of={SIZES}>
      {(size) => <Segments size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const locales: Scene = {
  about:
    "Which segments there are and what order they come in is the locale’s decision, which is why the component draws them rather than the caller. Nothing below states day-month-year.",
  draw: () => (
    <Matrix gap="6" knob="locale" of={LOCALES}>
      {(locale) => <Segments locale={locale} />}
    </Matrix>
  ),
  title: "Locales",
};

export const states: Scene = {
  about:
    "A label sits above the whole field rather than on any one segment, since the segments are one control between them.",
  draw: () => (
    <Column align="start" gap="4">
      <DateInputRoot colorPalette="primary">
        <DateInputLabel>Raised on</DateInputLabel>
        <DateInputHiddenInput />
        <DateInputControl>
          <DateInputSegments />
        </DateInputControl>
      </DateInputRoot>
      <Segments disabled />
    </Column>
  ),
  title: "Labelled and disabled",
};

export default specimen({
  about:
    "A date typed a segment at a time, with no calendar. Which segments there are comes from the locale, so nothing here states an order.",
  group: "Controls",
  id: "controls/date-input",
  scenes: [sizes, locales, states],
  title: "Date input",
});
