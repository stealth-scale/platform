import { defineRecipe } from "@chakra-ui/react";

/**
 * Draws a key as a key: square unless the word on it is wider than one glyph.
 *
 * Chakra sizes a `kbd` by height alone and pads it by a quarter of a step, so a single letter comes
 * out half as wide as it is tall and reads as a chip rather than a key. A minimum width equal to
 * the height is what squares it, and centring keeps the glyph in the middle once a longer word —
 * `Shift`, `Enter` — pushes it wider.
 *
 * Only the properties that were wrong are stated. Chakra merges a recipe over its own, so the
 * variants, the colours and the raised border all still come from there.
 */
export const kbd = defineRecipe({
  base: {
    justifyContent: "center",
    paddingInline: "1.5",
  },

  variants: {
    size: {
      sm: { height: "5", minWidth: "5" },

      md: { height: "6", minWidth: "6" },

      lg: { height: "7", minWidth: "7" },
    },
  },
});
