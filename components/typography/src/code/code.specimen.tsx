/**
 * Shows inline code at every size.
 */

import { Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { Code } from "#code/code.ts";
import { Text } from "#text/text.ts";

/**
 * Every size a snippet takes.
 */
const SIZES = ["xs", "sm", "md", "lg"] as const;

export const sizes: Scene = {
  about:
    "Set inside a line of prose rather than on its own, because a snippet that sits too tall or too short only gives itself away against the words either side of it.",
  draw: () => (
    <Matrix knob="size" of={SIZES}>
      {(size) => (
        <Row gap="2">
          <Text fontSize={size}>Run</Text>
          <Code size={size}>vp run ci</Code>
          <Text fontSize={size}>before handing over.</Text>
        </Row>
      )}
    </Matrix>
  ),
  title: "Sizes",
};

export default specimen({
  about:
    "A snippet set into running prose. It takes the size of the line it sits in, so the two share a baseline.",
  group: "Typography",
  id: "typography/code",
  scenes: [sizes],
  title: "Code",
});
