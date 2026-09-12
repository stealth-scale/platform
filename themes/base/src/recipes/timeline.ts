import { defineSlotRecipe } from "@chakra-ui/react";
import { timelineAnatomy } from "@chakra-ui/react/anatomy";

/**
 * Stops the rail running through the numbers on the plain variant.
 *
 * The rail is one absolutely positioned line down the whole item, and an indicator sits over it and
 * hides the stretch it covers — which works because every other variant fills the indicator.
 * `plain` fills nothing, so the line passes straight through the figure inside it.
 *
 * Filling it with the page's own surface keeps the variant plain to look at and still masks the
 * rail.
 */
export const timeline = defineSlotRecipe({
  slots: timelineAnatomy.keys(),

  variants: {
    variant: {
      plain: { indicator: { bg: "bg" } },
    },
  },
});
