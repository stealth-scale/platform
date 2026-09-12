/**
 * How an angle slider is drawn, and the context every part of one reads.
 *
 * Apart from the components because a file exporting both stops fast refresh working: the recipe,
 * the styling context and the hooks Ark supplies are shared between the parts rather than being
 * parts themselves.
 */

import { angleSliderAnatomy, AngleSlider as Ark } from "@ark-ui/react/angle-slider";
import { createSlotRecipeContext, defineSlotRecipe } from "@chakra-ui/react";

/**
 * How wide the dial is drawn, in pixels, and how thick its ring is.
 */
export const RING = { size: 200, thickness: 20 };

/**
 * States how an angle slider is drawn.
 */
export const recipe = defineSlotRecipe({
  className: "scale-angle-slider",
  slots: [...angleSliderAnatomy.keys(), "ring", "ringRange", "ringTrack", "thumbIndicator"],

  base: {
    root: {
      "--size": `${String(RING.size)}px`,
      "--thickness": `${String(RING.thickness)}px`,
      alignItems: "center",
      display: "flex",
      height: "var(--size)",
      justifyContent: "center",
      position: "relative",
      width: "var(--size)",

      _disabled: { layerStyle: "disabled" },
    },

    control: {
      inset: "0",
      position: "absolute",
    },

    ring: {
      height: "var(--size)",
      width: "var(--size)",
    },

    ringTrack: {
      "--radius": "calc(var(--size) / 2 - var(--thickness) / 2)",
      cx: "calc(var(--size) / 2)",
      cy: "calc(var(--size) / 2)",
      fill: "transparent",
      r: "var(--radius)",
      stroke: "bg.muted",
      strokeWidth: "var(--thickness)",
    },

    ringRange: {
      "--radius": "calc(var(--size) / 2 - var(--thickness) / 2)",
      cx: "calc(var(--size) / 2)",
      cy: "calc(var(--size) / 2)",
      fill: "transparent",
      r: "var(--radius)",
      stroke: "colorPalette.solid",
      strokeLinecap: "round",
      strokeWidth: "var(--thickness)",
      transform: "rotate(-90deg)",
      transformOrigin: "center",
    },

    thumb: {
      alignItems: "flex-start",
      display: "flex",
      height: "full",
      insetBlock: "0",
      insetInlineEnd: "0",
      insetInlineStart: "calc(50% - 1.5px)",
      outline: "0",
      pointerEvents: "none",
      position: "absolute",
      width: "3px",

      _focusVisible: {
        "& > *": { outline: "2px solid {colors.colorPalette.focusRing}", outlineOffset: "1px" },
      },
    },

    thumbIndicator: {
      bg: { _dark: "colorPalette.300", _light: "colorPalette.500" },
      borderRadius: "full",
      boxSize: "5",
      flexShrink: "0",
      scale: "1.25",
    },

    valueText: {
      color: "colorPalette.fg",
      textStyle: "4xl",
    },

    label: {
      textStyle: "sm",
    },

    markerGroup: {
      inset: "0",
      pointerEvents: "none",
      position: "absolute",
    },

    marker: {
      insetBlock: "0",
      insetInlineStart: "calc(50% - 1px)",
      position: "absolute",
      width: "2px",

      _before: {
        bg: "border.emphasized",
        borderRadius: "full",
        content: '""',
        height: "2",
        insetBlockStart: "calc(var(--thickness) / 2 - {sizes.1})",
        insetInlineStart: "50%",
        position: "absolute",
        transform: "translateX(-50%)",
        width: "2px",
      },

      "&[data-state=at-value]": { _before: { bg: "colorPalette.fg" } },
      "&[data-state=under-value]": { _before: { bg: "colorPalette.contrast" } },
    },
  },
});

/**
 * Binds the recipe to the parts below, and carries the resolved styles down the tree.
 */
export const { PropsProvider, useStyles, withContext, withProvider } = createSlotRecipeContext({
  recipe,
});

/**
 * Reads the dial's state where a child needs it, as a render prop.
 */
export const AngleSliderContext = Ark.Context;

/**
 * Reads the styles the recipe resolved, for a part the components file does not wrap.
 */
export const useAngleSliderStyles = useStyles;

export {
  useAngleSlider,
  useAngleSliderContext,
  type UseAngleSliderContext,
  type UseAngleSliderProps,
  type UseAngleSliderReturn,
} from "@ark-ui/react/angle-slider";
