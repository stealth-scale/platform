import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Draws the toggle, which Chakra ships without a recipe of its own.
 *
 * Chakra's `Toggle` asks the system for a recipe under the key `toggle`, and no such recipe exists:
 * the lookup falls back to an empty object rather than failing, so the component renders with no
 * styles at all and pressing it changes nothing a reader can see. Ark still sets `data-state` on
 * the root either way, so what is missing is only the look.
 *
 * It is written to read as one button of a toggle group with the group taken away: the same
 * heights, the same pressed fill, the same released ghost.
 */
export const toggle = defineSlotRecipe({
  className: "scale-toggle",
  slots: ["root", "indicator"],

  base: {
    root: {
      alignItems: "center",
      appearance: "none",
      bg: "transparent",
      borderRadius: "l2",
      color: "fg.muted",
      cursor: "button",
      display: "inline-flex",
      flexShrink: "0",
      fontWeight: "medium",
      gap: "2",
      justifyContent: "center",
      outline: "none",
      transitionDuration: "normal",
      transitionProperty: "background, color, border-color",
      userSelect: "none",

      _disabled: { cursor: "not-allowed", opacity: "0.5" },
      _focusVisible: { focusRing: "outside" },
      _hover: { bg: "colorPalette.subtle", color: "colorPalette.fg" },

      "&[data-state=on]": {
        bg: "colorPalette.subtle",
        color: "colorPalette.fg",

        _hover: { bg: "colorPalette.muted" },
      },
    },

    indicator: {
      alignItems: "center",
      display: "inline-flex",
      justifyContent: "center",
    },
  },

  variants: {
    variant: {
      ghost: {},

      outline: {
        root: {
          borderColor: "border",
          borderWidth: "1px",

          "&[data-state=on]": { borderColor: "colorPalette.emphasized" },
        },
      },

      solid: {
        root: {
          "&[data-state=on]": {
            bg: "colorPalette.solid",
            color: "colorPalette.contrast",

            _hover: { bg: "colorPalette.solid" },
          },
        },
      },
    },

    size: {
      sm: {
        root: { height: "9", minWidth: "9", paddingInline: "2.5", textStyle: "sm" },

        indicator: { "& svg": { boxSize: "4" } },
      },

      md: {
        root: { height: "10", minWidth: "10", paddingInline: "3", textStyle: "sm" },

        indicator: { "& svg": { boxSize: "4.5" } },
      },

      lg: {
        root: { height: "11", minWidth: "11", paddingInline: "3.5", textStyle: "md" },

        indicator: { "& svg": { boxSize: "5" } },
      },
    },
  },

  defaultVariants: { size: "md", variant: "ghost" },
});
