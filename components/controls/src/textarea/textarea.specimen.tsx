/**
 * Shows the multi-line field in every variant and size, and set to grow with what is typed.
 */

import { Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { Textarea } from "#textarea/textarea.ts";

/**
 * How the field is bordered.
 */
const VARIANTS = ["outline", "subtle", "flushed"] as const;

/**
 * How large it is.
 */
const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

/**
 * What sits in the field by default.
 */
const NOTE = "Held while the account is verified. Raised again on Friday.";

export const variants: Scene = {
  about:
    "The same three borders the single-line field takes, so the two match wherever a form puts them side by side.",
  draw: () => (
    <Matrix knob="variant" of={VARIANTS}>
      {(variant) => <Textarea maxW="14rem" placeholder="Why it was held" variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "What the size sets is the text and the padding; how many lines it opens on is separate, which is why every one of these is the same height.",
  draw: () => (
    <Matrix direction="row" gap="4" knob="size" of={SIZES}>
      {(size) => <Textarea maxW="14rem" placeholder="Why it was held" size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const states: Scene = {
  about:
    "The last one grows as it is typed into: it has no scrollbar and adds a line at a time instead, up to whatever height it is capped at. Type into it — that is the only way to see it work.",
  draw: () => (
    <Row align="start" gap="4">
      <Textarea defaultValue={NOTE} maxW="14rem" />
      <Textarea disabled maxW="14rem" placeholder="Disabled" />
      <Textarea aria-invalid="true" maxW="14rem" placeholder="Invalid" />
      <Textarea autoresize defaultValue={NOTE} maxH="10rem" maxW="14rem" />
    </Row>
  ),
  title: "States, and one that grows",
};

export default specimen({
  about:
    "Several lines of text. Left alone it scrolls; told to resize it grows a line at a time up to a cap.",
  group: "Controls",
  id: "controls/textarea",
  scenes: [variants, sizes, states],
  title: "Textarea",
});
