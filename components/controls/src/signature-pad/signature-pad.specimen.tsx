/**
 * Shows the signature pad at every size, with the guide line and the clear button.
 */

import { type ReactElement, useState } from "react";

import { EraserIcon } from "lucide-react";

import { Column, Matrix, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import {
  SignaturePadClearTrigger,
  SignaturePadControl,
  SignaturePadGuide,
  SignaturePadHiddenInput,
  SignaturePadLabel,
  SignaturePadRoot,
  SignaturePadSegment,
} from "#signature-pad/signature-pad.ts";

/**
 * How tall the pad is.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Draws a pad per size, each keeping what was signed so the clear button has something to clear.
 *
 * The clear button only appears once there is a stroke, so the line below says whether anything has
 * been drawn yet. Its label is a `title` rather than a tooltip: a tooltip trigger wraps the button
 * and takes the pointer events the pad is listening for, so pressing clear drew a stroke instead of
 * erasing one.
 *
 * @returns The pads, and what they have been signed with.
 */
function Pads(): ReactElement {
  const [signed, setSigned] = useState("");

  return (
    <Column gap="6" width="md">
      <Matrix gap="6" knob="size" of={SIZES}>
        {(size) => (
          <SignaturePadRoot
            colorPalette="primary"
            name="signature"
            onDrawEnd={(details) => {
              setSigned(details.paths.join(""));
            }}
            size={size}
          >
            <SignaturePadLabel>Signature</SignaturePadLabel>
            <SignaturePadControl>
              <SignaturePadSegment />
              <SignaturePadClearTrigger
                aria-label="Clear the signature"
                title="Clear the signature"
              >
                <EraserIcon size={14} />
              </SignaturePadClearTrigger>
              <SignaturePadGuide />
            </SignaturePadControl>
            <SignaturePadHiddenInput value={signed} />
          </SignaturePadRoot>
        )}
      </Matrix>

      <Text muted size="xs">
        {signed === "" ? "Nothing signed yet." : "Signed."}
      </Text>
    </Column>
  );
}

export const sizes: Scene = {
  about:
    "All three are drawable. What the size sets is the height, since the width comes from whatever the pad is put in — a signature is drawn at the size of the hand, not of the form.",
  draw: Pads,
  title: "Sizes",
};

export default specimen({
  about:
    "A pad to sign on, with a guide line under it and a button to start again. What it hands back is the path, so it can be stored as a drawing rather than a picture.",
  group: "Controls",
  id: "controls/signature-pad",
  scenes: [sizes],
  title: "Signature pad",
});
