import { defineSlotRecipe } from "@chakra-ui/react";
import { segmentGroupAnatomy } from "@chakra-ui/react/anatomy";

/**
 * Sets the picked segment inside the track rather than flush against it.
 *
 * Chakra sizes the indicator to the item exactly and gives the track no padding, so the pill behind
 * the picked segment runs edge to edge and touches whatever is beside it. Padding the track is what
 * puts air around the pill, and the inner radius is stepped down so its corners sit concentrically
 * inside the track's rather than matching them.
 */
export const segmentGroup = defineSlotRecipe({
  slots: segmentGroupAnatomy.keys(),

  base: {
    root: {
      "--segment-radius": "radii.l1",

      borderRadius: "l2",
      padding: "1",
    },
  },
});
