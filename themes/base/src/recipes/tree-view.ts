import { defineSlotRecipe } from "@chakra-ui/react";
import { treeViewAnatomy } from "@chakra-ui/react/anatomy";

/**
 * Makes a picked row look picked.
 *
 * Chakra fills the selected row with `colorPalette.subtle`. On the grey palette — the one a tree
 * falls back to when it is given no palette of its own — that step is two per cent off the surface
 * it sits on, so clicking a row appears to do nothing at all even though the machine has selected
 * it and marked it.
 *
 * A step further down the scale reads on grey and stays quiet under a brand palette. It is stated
 * against the variant rather than the base, because that is where Chakra states it: a base rule is
 * applied first and the variant's own `subtle` fill lands on top of it.
 */
export const treeView = defineSlotRecipe({
  slots: treeViewAnatomy.keys(),

  variants: {
    variant: {
      subtle: {
        branchControl: { _selected: { bg: "colorPalette.muted" } },
        item: { _selected: { bg: "colorPalette.muted" } },
      },
    },
  },
});
