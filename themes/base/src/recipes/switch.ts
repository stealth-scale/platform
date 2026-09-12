import { defineSlotRecipe } from "@chakra-ui/react";
import { switchAnatomy } from "@chakra-ui/react/anatomy";

/**
 * Keeps the raised knob visible when the switch is off.
 *
 * The raised variant floats a white knob over a track and separates the two with `xs` — a shadow so
 * faint that on a white page the knob disappears into the surface behind it and the switch reads as
 * an empty groove. A hairline around the knob gives it an edge at any lightness.
 *
 * The shadow under it is mixed from the palette rather than taken from the grey scale, so a knob on
 * a coloured track is lifted by a wash of its own colour instead of a grey that belongs to
 * neither.
 */
export const switchRecipe = defineSlotRecipe({
  slots: switchAnatomy.keys(),

  variants: {
    variant: {
      raised: {
        thumb: {
          borderColor: "border",
          borderWidth: "1px",
          boxShadow: "0 1px 3px {colors.colorPalette.solid/35}",

          _checked: {
            borderColor: "colorPalette.solid",
            boxShadow: "0 1px 4px {colors.colorPalette.solid/55}",
          },
        },
      },
    },
  },
});
