/**
 * Shows the paragraph at every size, and in each ink a body of text takes.
 */

import { Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { Text } from "#text/text.ts";

/**
 * Every size the body scale offers.
 */
const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

/**
 * The three inks a paragraph is written in.
 */
const INKS = ["fg", "fg.muted", "fg.subtle"] as const;

export const sizes: Scene = {
  about:
    "Five steps, close enough together that a page can change register without changing voice. The same words at each, because a scale is judged on the gaps rather than on any one step.",
  draw: () => (
    <Matrix gap="4" knob="size" of={SIZES}>
      {(size) => (
        <Text fontSize={size} maxW="14rem">
          Four offers arrived overnight.
        </Text>
      )}
    </Matrix>
  ),
  title: "Sizes",
};

export const inks: Scene = {
  about:
    "Drawn at the smallest size on purpose. A muted tone that has gone too pale is still readable at `xl` and fails here, so this is the size the ink has to be judged at.",
  draw: () => (
    <Matrix direction="row" gap="6" knob="color" of={INKS}>
      {(color) => (
        <Text color={color} fontSize="xs" maxW="14rem">
          Four offers arrived overnight.
        </Text>
      )}
    </Matrix>
  ),
  title: "Inks",
};

export default specimen({
  about:
    "The paragraph. Five sizes off the body scale, each of which can be written in any of the three inks a body of text takes.",
  group: "Typography",
  id: "typography/text",
  scenes: [sizes, inks],
  title: "Text",
});
