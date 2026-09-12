import { defineSlotRecipe } from "@chakra-ui/react";
import { tabsAnatomy } from "@chakra-ui/react/anatomy";

/**
 * Hides the sliding indicator on the variants that mark the selected tab themselves.
 *
 * `line` and `subtle` move an indicator under the tabs; `outline` and `enclosed` draw the selected
 * trigger as a shape instead. The indicator is styled the same either way, so composing one into an
 * outline set paints a shadowed bar across the bottom of the selected tab — which reads as a rule
 * the variant is meant not to have.
 *
 * Hiding it here rather than asking the caller to compose differently keeps one markup for all
 * five.
 */
export const tabs = defineSlotRecipe({
  slots: tabsAnatomy.keys(),

  variants: {
    variant: {
      enclosed: { indicator: { display: "none" } },

      outline: { indicator: { display: "none" } },
    },
  },
});
