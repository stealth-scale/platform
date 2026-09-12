/**
 * The table of contents: a rail of links to the headings on a page, marking whichever is on screen.
 *
 * Ark supplies the behaviour and this file supplies the look, joined by a slot recipe written in
 * semantic tokens throughout.
 *
 * Zag measures the active item and puts its box on the root as `--top`, `--left`, `--width` and
 * `--height`, then gives the indicator `position: absolute` and nothing else. The indicator reads
 * the top and the height off that and stays flush with the list's leading edge, which is what makes
 * it slide down the rail rather than jump. Each item carries its own `--depth`, and a heading one
 * level in is indented by it.
 *
 * `Nav` and `Content` take no slot. The anatomy names neither, and `Nav` already carries the root's
 * attributes because Ark hands it `getRootProps` too, so both are styled where they are used.
 */

import { type Assign } from "@ark-ui/react";
import { Toc as Ark, tocAnatomy } from "@ark-ui/react/toc";
import {
  createSlotRecipeContext,
  defineSlotRecipe,
  type HTMLChakraProps,
  type RecipeVariantProps,
  type UnstyledProp,
} from "@chakra-ui/react";

/**
 * States how a table of contents is drawn.
 */
const recipe = defineSlotRecipe({
  className: "scale-toc",
  slots: tocAnatomy.keys(),

  base: {
    root: {
      alignItems: "flex-start",
      display: "flex",
      gap: "8",
      position: "relative",
      width: "full",
    },

    title: {
      color: "fg.muted",
      fontSize: "0.6875rem",
      fontWeight: "semibold",
      letterSpacing: "0.06em",
      paddingInline: "2",
      textTransform: "uppercase",
    },

    list: {
      listStyle: "none",
      margin: "0",
      padding: "0",
      position: "relative",
    },

    item: {
      paddingInlineStart: "calc((var(--depth) - 2) * {spacing.4})",
    },

    link: {
      borderRadius: "l2",
      color: "fg.muted",
      display: "block",
      paddingBlock: "1.5",
      paddingInline: "2",
      paddingInlineStart: "3.5",
      textDecoration: "none",
      textStyle: "sm",
      transition: "color 0.15s",

      _focusVisible: { focusRing: "outside" },
      _hover: { color: "fg" },

      "&[data-active]": { color: "colorPalette.fg", fontWeight: "medium" },
    },

    indicator: {
      bg: "colorPalette.solid",
      borderRadius: "full",
      height: "var(--height)",
      insetInlineStart: "0",
      top: "var(--top)",
      transition: "height 0.2s, top 0.2s",
      width: "2px",
    },
  },
});

/**
 * Binds the recipe to the parts below, and carries the resolved styles down the tree.
 */
const { PropsProvider, useStyles, withContext, withProvider } = createSlotRecipeContext({ recipe });

/**
 * Describes what a table of contents takes beyond an element's own props.
 */
export interface TocRootBaseProps
  extends Assign<Ark.RootBaseProps, RecipeVariantProps<typeof recipe>>, UnstyledProp {}

/**
 * Describes the props of {@link TocRoot}.
 */
export interface TocRootProps extends HTMLChakraProps<"div", TocRootBaseProps> {}

/**
 * Holds the rail, watches the page, and is the box the indicator is placed against.
 */
export const TocRoot = withProvider<HTMLDivElement, TocRootProps>(Ark.Root, "root", {
  forwardAsChild: true,
});

/**
 * Describes the props of {@link TocRootProvider}.
 */
export interface TocRootProviderProps extends HTMLChakraProps<
  "div",
  Assign<Ark.RootProviderBaseProps, RecipeVariantProps<typeof recipe>> & UnstyledProp
> {}

/**
 * Holds the rail against state built outside it by `useToc`.
 */
export const TocRootProvider = withProvider<HTMLDivElement, TocRootProviderProps>(
  Ark.RootProvider,
  "root",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link TocNav}.
 */
export interface TocNavProps extends HTMLChakraProps<"nav", Ark.NavBaseProps>, UnstyledProp {}

/**
 * Wraps the title and the list in a landmark, on whichever side the page puts it.
 */
export const TocNav = withContext<HTMLElement, TocNavProps>(Ark.Nav, undefined, {
  forwardAsChild: true,
});

/**
 * Describes the props of {@link TocContent}.
 */
export interface TocContentProps
  extends HTMLChakraProps<"article", Ark.ContentBaseProps>, UnstyledProp {}

/**
 * Holds the prose the headings are in, which is what Ark watches for the active one.
 */
export const TocContent = withContext<HTMLElement, TocContentProps>(Ark.Content, undefined, {
  forwardAsChild: true,
});

/**
 * Describes the props of {@link TocTitle}.
 */
export interface TocTitleProps extends HTMLChakraProps<"h2", Ark.TitleBaseProps>, UnstyledProp {}

/**
 * Names the rail, and is what its landmark is labelled by.
 */
export const TocTitle = withContext<HTMLHeadingElement, TocTitleProps>(Ark.Title, "title", {
  forwardAsChild: true,
});

/**
 * Describes the props of {@link TocList}.
 */
export interface TocListProps extends HTMLChakraProps<"ul", Ark.ListBaseProps>, UnstyledProp {}

/**
 * Holds the items, unbulleted.
 */
export const TocList = withContext<HTMLUListElement, TocListProps>(Ark.List, "list", {
  forwardAsChild: true,
});

/**
 * Describes the props of {@link TocItem}.
 */
export interface TocItemProps extends HTMLChakraProps<"li", Ark.ItemBaseProps>, UnstyledProp {}

/**
 * One heading in the rail, indented by how deep it sits.
 */
export const TocItem = withContext<HTMLLIElement, TocItemProps>(Ark.Item, "item", {
  forwardAsChild: true,
});

/**
 * Describes the props of {@link TocLink}.
 */
export interface TocLinkProps extends HTMLChakraProps<"a", Ark.LinkBaseProps>, UnstyledProp {}

/**
 * Jumps to the heading, and reads as current while that heading is on screen.
 */
export const TocLink = withContext<HTMLAnchorElement, TocLinkProps>(Ark.Link, "link", {
  forwardAsChild: true,
});

/**
 * Describes the props of {@link TocIndicator}.
 */
export interface TocIndicatorProps
  extends HTMLChakraProps<"div", Ark.IndicatorBaseProps>, UnstyledProp {}

/**
 * Marks where the active heading is, sliding to it.
 */
export const TocIndicator = withContext<HTMLDivElement, TocIndicatorProps>(
  Ark.Indicator,
  "indicator",
  { forwardAsChild: true },
);

/**
 * Reads the rail's state where a child needs it, as a render prop.
 */
export const TocContext = Ark.Context;

/**
 * Sets the props every table of contents under it takes by default.
 */
export const TocPropsProvider = PropsProvider;

/**
 * Reads the styles the recipe resolved, for a part this file does not wrap.
 */
export const useTocStyles = useStyles;

export {
  type TocActiveChangeDetails,
  type TocItemData,
  useToc,
  useTocContext,
  type UseTocContext,
  type UseTocProps,
  type UseTocReturn,
} from "@ark-ui/react/toc";
