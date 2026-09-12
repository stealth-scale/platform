/**
 * Shows the box joined to the end of a field, which carries a unit or a fixed part of the value.
 */

import { Column, Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { InputAddon } from "#input-addon/input-addon.ts";
import { Input } from "#input/input.ts";

/**
 * How the addon is bordered, which has to match the field beside it.
 */
const VARIANTS = ["outline", "subtle", "flushed"] as const;

/**
 * How large the pair is.
 */
const SIZES = ["xs", "sm", "md", "lg"] as const;

export const variants: Scene = {
  about:
    "An addon is not an overlay: it sits beside the field and takes its own space, so the two share one border and only the outer corners stay round. That is what `attached` on the group buys, and it is why the variants have to be told to the pair rather than to either half.",
  draw: () => (
    <Matrix gap="8" knob="variant" of={VARIANTS}>
      {(variant) => (
        <Row attached>
          <InputAddon variant={variant}>£</InputAddon>
          <Input placeholder="0.00" variant={variant} />
        </Row>
      )}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "Both halves take the size, because the addon has to be exactly as tall as the field or the shared border steps.",
  draw: () => (
    <Matrix gap="4" knob="size" of={SIZES}>
      {(size) => (
        <Row attached>
          <InputAddon size={size}>£</InputAddon>
          <Input placeholder="0.00" size={size} />
        </Row>
      )}
    </Matrix>
  ),
  title: "Sizes",
};

export const ends: Scene = {
  about:
    "At either end, or both. Reach for an addon where the part it carries is fixed and belongs to the value — a currency, a domain, a unit — and for an input group where it is a control.",
  draw: () => (
    <Column gap="4" width="md">
      <Row attached>
        <Input placeholder="stealthscale" />
        <InputAddon>.com</InputAddon>
      </Row>
      <Row attached>
        <InputAddon>£</InputAddon>
        <Input placeholder="0.00" />
        <InputAddon>per payout</InputAddon>
      </Row>
    </Column>
  ),
  title: "At either end",
};

export default specimen({
  about:
    "A box joined to a field, carrying a fixed part of the value. It shares the field’s border, so the two read as one control.",
  group: "Controls",
  id: "controls/input-addon",
  scenes: [variants, sizes, ends],
  title: "Input addon",
});
