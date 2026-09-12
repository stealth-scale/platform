/**
 * Shows the button: every variant against every size, the states, and the icon-only shapes.
 */

import { ArrowRightIcon, PlusIcon, TrashIcon, XIcon } from "lucide-react";

import { Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { Button, ButtonGroup, CloseButton, IconButton } from "#button/button.ts";

/**
 * How the button is filled.
 */
const VARIANTS = ["solid", "subtle", "surface", "outline", "ghost", "plain"] as const;

/**
 * How large it is.
 */
const SIZES = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl"] as const;

export const variants: Scene = {
  about:
    "Six ways a button is set off from the page, crossed with every size it comes in. Solid is the one that means “do this, now”; every other variant is quieter on purpose.",
  draw: () => (
    <Matrix gap="8" knob="variant" of={VARIANTS}>
      {(variant) => (
        <Matrix direction="row" gap="4" knob="size" of={SIZES}>
          {(size) => (
            <Button colorPalette="primary" size={size} variant={variant}>
              Release
            </Button>
          )}
        </Matrix>
      )}
    </Matrix>
  ),
  title: "Variants and sizes",
};

export const states: Scene = {
  about:
    "Loading is the state worth looking at: the spinner takes the place of the icon rather than being added to it, so the button keeps its width while it works and the row around it does not reflow.",
  draw: () => (
    <Row gap="3">
      <Button colorPalette="primary">
        <PlusIcon /> Add a payout
      </Button>
      <Button colorPalette="primary">
        Continue <ArrowRightIcon />
      </Button>
      <Button colorPalette="primary" disabled>
        Disabled
      </Button>
      <Button colorPalette="primary" loading loadingText="Releasing">
        Release
      </Button>
    </Row>
  ),
  title: "States",
};

export const shapes: Scene = {
  about:
    "An icon button carries no words, so it carries a label instead — without one it is a square nobody can name. A group attaches its children into one control.",
  draw: () => (
    <Row gap="6">
      <IconButton aria-label="Void the payout" colorPalette="red" variant="outline">
        <TrashIcon />
      </IconButton>
      <CloseButton aria-label="Dismiss" />
      <ButtonGroup attached colorPalette="primary" size="sm" variant="outline">
        <Button>Week</Button>
        <Button>Month</Button>
        <IconButton aria-label="Clear">
          <XIcon />
        </IconButton>
      </ButtonGroup>
    </Row>
  ),
  title: "Icon buttons and groups",
};

export default specimen({
  about:
    "The control a reader presses. Every variant carries every size, and the size is what a row of mixed controls lines up on.",
  group: "Controls",
  id: "controls/button",
  scenes: [variants, states, shapes],
  title: "Button",
});
