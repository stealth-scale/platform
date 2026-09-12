/**
 * The toggle group: a row of buttons of which one, or several, stay pressed.
 *
 * Ark supplies the behaviour and this file supplies the look, joined by a slot recipe. The recipe
 * is declared here rather than in a theme because it is written in semantic tokens throughout, so a
 * theme that retints `bg`, `fg` and `colorPalette` restyles it without naming it.
 *
 * Zag marks a pressed item with `data-state="on"`, and sets `aria-checked` only in single-select
 * mode and `aria-pressed` only in multiple. Chakra ships no `_on`, and `_checked` and `_pressed`
 * each cover one of those modes, so the state selector reads the data attribute and covers both.
 *
 * `outline` frames the whole group with one border on the root and a rule between each item, and
 * `ghost` drops the frame, spaces the items and rounds each one on its own.
 *
 * Ark's own recipe sizes an item square, because its examples hold single icons. Inline padding is
 * added here so an item carrying a word is not cut off by the rule beside it.
 */

import { type Assign } from "@ark-ui/react";
import { ToggleGroup as Ark, toggleGroupAnatomy } from "@ark-ui/react/toggle-group";
import {
  createSlotRecipeContext,
  defineSlotRecipe,
  type HTMLChakraProps,
  type RecipeVariantProps,
  type UnstyledProp,
} from "@chakra-ui/react";

/**
 * States how a toggle group is drawn.
 *
 * A blank line separates the physical properties from the states, which is what keeps the sorter
 * from alphabetising a size scale into `lg, md, sm, xs`.
 */
const recipe = defineSlotRecipe({
  className: "scale-toggle-group",
  slots: toggleGroupAnatomy.keys(),

  base: {
    root: {
      display: "flex",
      overflow: "hidden",
      position: "relative",
      width: "max-content",

      _vertical: { flexDirection: "column" },
    },

    item: {
      alignItems: "center",
      appearance: "none",
      bg: "transparent",
      color: "fg.subtle",
      cursor: "button",
      display: "inline-flex",
      fontWeight: "semibold",
      justifyContent: "center",
      minWidth: "0",
      outline: "none",
      position: "relative",
      transition: "background-color 0.15s, border-color 0.15s, box-shadow 0.15s, color 0.15s",
      userSelect: "none",
      verticalAlign: "middle",
      whiteSpace: "nowrap",

      _disabled: {
        color: "fg.subtle",
        cursor: "not-allowed",

        _hover: { bg: "transparent", color: "fg.subtle" },
      },

      _hover: { bg: "gray.subtle" },

      "&[data-state=on]": {
        bg: "gray.muted",
        color: "fg",

        _hover: { bg: "gray.muted" },
      },
    },
  },

  variants: {
    size: {
      sm: {
        item: {
          gap: "2",
          height: "9",
          minWidth: "9",
          paddingInline: "2.5",
          textStyle: "sm",

          "& svg": { boxSize: "4.5" },
        },
      },

      md: {
        item: {
          gap: "2",
          height: "10",
          minWidth: "10",
          paddingInline: "3",
          textStyle: "sm",

          "& svg": { boxSize: "5" },
        },
      },

      lg: {
        item: {
          gap: "2",
          height: "11",
          minWidth: "11",
          paddingInline: "3.5",
          textStyle: "md",

          "& svg": { boxSize: "5" },
        },
      },
    },

    variant: {
      ghost: {
        item: { borderRadius: "l2" },

        root: { gap: "1" },
      },

      outline: {
        item: {
          borderColor: "border",

          _focusVisible: { bg: "gray.muted", color: "fg" },
        },

        root: {
          borderColor: "border",
          borderRadius: "l2",
          borderWidth: "1px",

          _horizontal: { "& > *:not(:first-of-type)": { borderInlineStartWidth: "1px" } },
          _vertical: { "& > *:not(:first-of-type)": { borderBlockStartWidth: "1px" } },
        },
      },
    },
  },

  defaultVariants: { size: "md", variant: "outline" },
});

/**
 * Binds the recipe to the parts below, and carries the resolved styles down the tree.
 */
const { PropsProvider, useStyles, withContext, withProvider } = createSlotRecipeContext({ recipe });

/**
 * Describes what a toggle group takes beyond an element's own props.
 */
export interface ToggleGroupRootBaseProps
  extends Assign<Ark.RootBaseProps, RecipeVariantProps<typeof recipe>>, UnstyledProp {}

/**
 * Describes the props of {@link ToggleGroupRoot}.
 */
export interface ToggleGroupRootProps extends HTMLChakraProps<"div", ToggleGroupRootBaseProps> {}

/**
 * Holds the group, and decides whether pressing one item releases the others.
 */
export const ToggleGroupRoot = withProvider<HTMLDivElement, ToggleGroupRootProps>(
  Ark.Root,
  "root",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link ToggleGroupRootProvider}.
 */
export interface ToggleGroupRootProviderProps extends HTMLChakraProps<
  "div",
  Assign<Ark.RootProviderBaseProps, RecipeVariantProps<typeof recipe>> & UnstyledProp
> {}

/**
 * Holds the group against state built outside it by `useToggleGroup`.
 */
export const ToggleGroupRootProvider = withProvider<HTMLDivElement, ToggleGroupRootProviderProps>(
  Ark.RootProvider,
  "root",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link ToggleGroupItem}.
 */
export interface ToggleGroupItemProps
  extends HTMLChakraProps<"button", Ark.ItemBaseProps>, UnstyledProp {}

/**
 * One button in the group, pressed or not.
 */
export const ToggleGroupItem = withContext<HTMLButtonElement, ToggleGroupItemProps>(
  Ark.Item,
  "item",
  { forwardAsChild: true },
);

/**
 * Reads the group's state where a child needs it, as a render prop.
 */
export const ToggleGroupContext = Ark.Context;

/**
 * Sets the props every toggle group under it takes by default.
 */
export const ToggleGroupPropsProvider = PropsProvider;

/**
 * Reads the styles the recipe resolved, for a part this file does not wrap.
 */
export const useToggleGroupStyles = useStyles;

export {
  type ToggleGroupValueChangeDetails,
  useToggleGroup,
  useToggleGroupContext,
  type UseToggleGroupContext,
  type UseToggleGroupProps,
  type UseToggleGroupReturn,
} from "@ark-ui/react/toggle-group";
