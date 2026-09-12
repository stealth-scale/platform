/**
 * Shows the badge in every variant, at every size, and carrying every palette.
 */

import { Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { Badge } from "#badge/badge.ts";

/**
 * Every way a badge is filled.
 */
const VARIANTS = ["subtle", "solid", "outline", "surface", "plain"] as const;

/**
 * Every size a badge takes.
 */
const SIZES = ["xs", "sm", "md", "lg"] as const;

/**
 * The palettes a badge is usually asked to carry.
 */
const PALETTES = ["gray", "primary", "green", "orange", "red"] as const;

export const variants: Scene = {
  about:
    "How loudly the badge is stated. Solid is the one to check: it is the only fill that has to carry its own label rather than borrow the page’s ink.",
  draw: () => (
    <Matrix knob="variant" of={VARIANTS}>
      {(variant) => (
        <Badge colorPalette="primary" variant={variant}>
          Paid
        </Badge>
      )}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "A badge is nearly always set beside text, so its sizes line up with the body scale rather than with each other.",
  draw: () => (
    <Matrix direction="row" gap="4" knob="size" of={SIZES}>
      {(size) => (
        <Badge colorPalette="primary" size={size}>
          Paid
        </Badge>
      )}
    </Matrix>
  ),
  title: "Sizes",
};

export const palettes: Scene = {
  about:
    "On one line, because a status badge is read against its neighbours: two palettes that are too close to each other are legible alone and useless in a column of rows.",
  draw: () => (
    <Matrix knob="variant" of={VARIANTS}>
      {(variant) => (
        <Row gap="2">
          {PALETTES.map((palette) => (
            <Badge colorPalette={palette} key={palette} variant={variant}>
              Paid
            </Badge>
          ))}
        </Row>
      )}
    </Matrix>
  ),
  title: "Palettes",
};

export default specimen({
  about:
    "A word about the thing beside it — a state, a count, a label. Its palette is what carries the meaning, so the palettes have to stay apart from one another.",
  group: "Feedback",
  id: "feedback/badge",
  scenes: [variants, sizes, palettes],
  title: "Badge",
});
