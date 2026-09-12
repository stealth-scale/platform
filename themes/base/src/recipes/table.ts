import { defineSlotRecipe } from "@chakra-ui/react";
import { tableAnatomy } from "@chakra-ui/react/anatomy";

/**
 * Sets the header apart from the body, which Chakra leaves to the type alone.
 *
 * Chakra draws a header cell in the same ink and on the same surface as the rows under it, with one
 * rule between them. That is enough to parse and not enough to read: at a glance the first row of a
 * long table looks like data. Filling the header, tracking the letters out and lightening the ink
 * is what separates the label from the value.
 *
 * The footer is treated the same, since a total is a label for the column above it.
 */
export const table = defineSlotRecipe({
  slots: tableAnatomy.keys(),

  base: {
    columnHeader: {
      bg: "bg.subtle",
      color: "fg.muted",
      fontSize: "xs",
      fontWeight: "semibold",
      letterSpacing: "wide",
      textTransform: "uppercase",
    },

    footer: {
      bg: "bg.subtle",
      fontWeight: "semibold",
    },
  },
});
