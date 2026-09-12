import { defineSlotRecipe } from "@chakra-ui/react";
import { menuAnatomy } from "@chakra-ui/react/anatomy";

/**
 * Lightens the caret's edge to match the panel it points out of.
 *
 * The tip is a square rotated forty-five degrees, filled with the panel's own background and given
 * a top and a left border so that two of its edges continue the panel's outline. A menu here is a
 * shadow on a surface rather than an outlined box, so that border has nothing to continue and reads
 * as a hard grey angle stuck to a soft panel. It cannot simply be removed — those two edges are the
 * only thing that separates the caret from the page — so it is lightened to `border.muted`, the
 * quietest rule this theme states. A step the theme does not define resolves to nothing at all, and
 * a caret with no edge is a caret nobody can see.
 */
export const menu = defineSlotRecipe({
  slots: menuAnatomy.keys(),

  base: {
    arrowTip: {
      borderColor: "border.muted",
    },
  },
});
