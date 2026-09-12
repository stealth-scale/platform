import { defineRecipe } from "@chakra-ui/react";

/**
 * Gives a flushed addon room to breathe, which Chakra takes away entirely.
 *
 * The bordered variants pad an addon by the size scale, and `flushed` sets that padding to zero on
 * the reasoning that a flushed control has no box to pad inside. The effect is that the unit and
 * the value it belongs to are printed hard against one another — `£4120.00` rather than `£ 4120.00`
 * — with only the underline running beneath both to say they are separate fields.
 *
 * A single step of inline padding is enough to part them without reintroducing a box, and it works
 * whichever end the addon sits at.
 */
export const inputAddon = defineRecipe({
  variants: {
    variant: {
      flushed: { paddingInline: "2" },
    },
  },
});
