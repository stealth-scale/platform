import { defineSlotRecipe } from "@chakra-ui/react";
import { accordionAnatomy } from "@chakra-ui/react/anatomy";

/**
 * Makes an open panel read on the grey palette, which is the one an accordion falls back to.
 *
 * Chakra fills an open item with `colorPalette.subtle`. Against a page that is already near-white
 * the grey step of that scale is all but invisible, so a `subtle` accordion with nothing coloured
 * about it reads as a ragged stack: two panels faintly tinted, the closed one a hole between them.
 *
 * The fill is a surface rather than a palette step, so it reads the same whatever palette is set
 * and stays a shade of the page rather than a shade of the brand.
 */
export const accordion = defineSlotRecipe({
  slots: accordionAnatomy.keys(),

  variants: {
    variant: {
      subtle: {
        item: { _open: { bg: "bg.subtle" } },
      },
    },
  },
});
