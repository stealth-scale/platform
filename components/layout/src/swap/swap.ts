/**
 * The swap: two marks in the same square, one of which is showing.
 *
 * Ark supplies the behaviour and this file supplies the look, joined by a slot recipe. The recipe
 * is declared here rather than in a theme because it is written in semantic tokens throughout, so a
 * theme that retints `bg`, `fg` and `colorPalette` restyles it without naming it.
 *
 * Ark lays the two marks out itself, inline: the root is an `inline-grid` and both indicators sit
 * in the same cell, so neither the box nor anything beside it moves as they change over. What is
 * left for the recipe is how the change reads, which is the `transition` variant.
 *
 * A mark on its way out is still in the document, so the leaving animation is the shorter of the
 * two: the arriving mark has to be legible before the leaving one has finished.
 */

import { type Assign } from "@ark-ui/react";
import { Swap as Ark, swapAnatomy } from "@ark-ui/react/swap";
import {
  createSlotRecipeContext,
  defineSlotRecipe,
  type HTMLChakraProps,
  type RecipeVariantProps,
  type UnstyledProp,
} from "@chakra-ui/react";

/**
 * States how a swap is drawn.
 *
 * A blank line separates the physical properties from the states, which is what keeps the sorter
 * from alphabetising a size scale into `lg, md, sm, xs`.
 */
const recipe = defineSlotRecipe({
  className: "scale-swap",
  slots: swapAnatomy.keys(),

  base: {
    root: {
      alignItems: "center",
      justifyContent: "center",
      lineHeight: "1",
    },

    indicator: {
      alignItems: "center",
      animationFillMode: "forwards",
      justifyContent: "center",
      transformOrigin: "center",
    },
  },

  variants: {
    transition: {
      fade: {
        indicator: {
          animationDuration: { _closed: "fastest", _open: "moderate" },
          animationName: { _closed: "fade-out", _open: "fade-in" },
        },
      },

      scale: {
        indicator: {
          animationDuration: { _closed: "fastest", _open: "moderate" },
          animationName: { _closed: "fade-out, scale-out", _open: "fade-in, scale-in" },
        },
      },

      slide: {
        indicator: {
          animationDuration: { _closed: "fastest", _open: "moderate" },
          animationName: { _closed: "fade-out, slide-to-top", _open: "fade-in, slide-from-bottom" },
        },
      },

      none: {
        indicator: { animationName: "none" },
      },
    },
  },

  defaultVariants: { transition: "scale" },
});

/**
 * Binds the recipe to the parts below, and carries the resolved styles down the tree.
 */
const { PropsProvider, useStyles, withContext, withProvider } = createSlotRecipeContext({ recipe });

/**
 * Describes what a swap takes beyond an element's own props.
 */
export interface SwapRootBaseProps
  extends Assign<Ark.RootBaseProps, RecipeVariantProps<typeof recipe>>, UnstyledProp {}

/**
 * Describes the props of {@link SwapRoot}.
 */
export interface SwapRootProps extends HTMLChakraProps<"span", SwapRootBaseProps> {}

/**
 * Holds the two marks, and says which of them is showing.
 */
export const SwapRoot = withProvider<HTMLSpanElement, SwapRootProps>(Ark.Root, "root", {
  forwardAsChild: true,
});

/**
 * Describes the props of {@link SwapRootProvider}.
 */
export interface SwapRootProviderProps extends HTMLChakraProps<
  "span",
  Assign<Ark.RootProviderBaseProps, RecipeVariantProps<typeof recipe>> & UnstyledProp
> {}

/**
 * Holds the swap against state built outside it by `useSwap`.
 */
export const SwapRootProvider = withProvider<HTMLSpanElement, SwapRootProviderProps>(
  Ark.RootProvider,
  "root",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link SwapIndicator}.
 */
export interface SwapIndicatorProps
  extends HTMLChakraProps<"span", Ark.IndicatorBaseProps>, UnstyledProp {}

/**
 * One of the two marks: `on` while the swap is turned on, `off` while it is not.
 */
export const SwapIndicator = withContext<HTMLSpanElement, SwapIndicatorProps>(
  Ark.Indicator,
  "indicator",
  { forwardAsChild: true },
);

/**
 * Sets the props every swap under it takes by default.
 */
export const SwapPropsProvider = PropsProvider;

/**
 * Reads the styles the recipe resolved, for a part this file does not wrap.
 */
export const useSwapStyles = useStyles;

export { useSwap, useSwapContext, type UseSwapProps, type UseSwapReturn } from "@ark-ui/react/swap";
