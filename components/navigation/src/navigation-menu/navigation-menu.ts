/**
 * The navigation menu: a menubar whose items open panels, for the top of a site.
 *
 * Ark supplies the behaviour and this file supplies the look, joined by a slot recipe written in
 * semantic tokens throughout.
 *
 * Zag measures the open trigger and the panel and publishes both on the root and the viewport, as
 * `--trigger-width`, `--trigger-height`, `--trigger-x`, `--trigger-y` and the four `--viewport-*`.
 * The indicator and the viewport get `position: absolute` inline and nothing else, so reading those
 * variables is what slides the bar between items rather than jumping it.
 *
 * `--trigger-x` is measured from the trigger's offset parent. An item is therefore `static`
 * wherever the list holds an indicator, so the offsets resolve against the list; the panel anchors
 * to the item instead and only the bar moves.
 *
 * This is the site-wide menubar rather than `menu`, which is a menu a button opens and lives in the
 * overlays package.
 */

import { type Assign } from "@ark-ui/react";
import { NavigationMenu as Ark, navigationMenuAnatomy } from "@ark-ui/react/navigation-menu";
import {
  createSlotRecipeContext,
  defineSlotRecipe,
  type HTMLChakraProps,
  type RecipeVariantProps,
  type UnstyledProp,
} from "@chakra-ui/react";

/**
 * States how a navigation menu is drawn.
 */
const recipe = defineSlotRecipe({
  className: "scale-navigation-menu",
  slots: navigationMenuAnatomy.keys(),

  base: {
    root: {
      display: "flex",
      position: "relative",
      zIndex: "dropdown",

      _vertical: { flexDirection: "column" },
    },

    list: {
      alignItems: "center",
      display: "flex",
      gap: "1",
      listStyle: "none",
      margin: "0",
      padding: "0",
      position: "relative",

      _vertical: { alignItems: "stretch", flexDirection: "column" },

      "&:has(> [data-part=indicator]) [data-part=content][data-state=closed]": {
        animationName: "none",
      },
      "&:has(> [data-part=indicator]) [data-part=item]": { position: "static" },
    },

    item: {
      position: "relative",
    },

    trigger: {
      alignItems: "center",
      borderTopRadius: "l2",
      color: "fg.muted",
      cursor: "button",
      display: "inline-flex",
      fontWeight: "medium",
      gap: "1.5",
      justifyContent: "center",
      transition: "background-color 0.15s, color 0.15s",
      whiteSpace: "nowrap",

      _disabled: { layerStyle: "disabled" },
      _focusVisible: { focusRing: "outside" },
      _hover: { bg: "bg.subtle", color: "fg" },

      "& svg": { boxSize: "4", transition: "rotate 0.2s" },

      "&[data-state=open]": { bg: "bg.muted", color: "fg" },
      "&[data-state=open] svg": { rotate: "-180deg" },
    },

    itemIndicator: {
      transition: "rotate 0.2s",

      "&[data-state=open]": { rotate: "180deg" },
    },

    viewportPositioner: {
      display: "flex",
      insetInline: "0",
      justifyContent: "flex-start",
      position: "absolute",
      top: "calc(var(--trigger-height) + {spacing.2})",
    },

    viewport: {
      bg: "bg.panel",
      borderColor: "border",
      borderRadius: "l3",
      borderWidth: "1px",
      boxShadow: "2xl",
      height: "var(--viewport-height)",
      overflow: "hidden",
      transition: "height 0.2s, translate 0.2s, width 0.2s",
      translate: "var(--trigger-x) 0",
      width: "var(--viewport-width, max-content)",

      "&[data-state=closed]": { opacity: "0" },
      "&[data-state=open]": { opacity: "1" },

      "& [data-part=content]": {
        borderRadius: "0",
        borderWidth: "0",
        boxShadow: "none",
        insetInlineStart: "auto",
        marginBlockStart: "0",
        position: "static",
        top: "auto",
      },
    },

    content: {
      bg: "bg.panel",
      borderColor: "border",
      borderRadius: "l3",
      borderWidth: "1px",
      boxShadow: "2xl",
      display: "flex",
      flexDirection: "column",
      gap: "0.5",
      insetInlineStart: "0",
      marginBlockStart: "2",
      maxWidth: "min(40rem, calc(100vw - {spacing.12}))",
      outline: "none",
      padding: "4",
      position: "absolute",
      top: "100%",
      transformOrigin: "top left",
      width: "max-content",

      _rtl: { insetInlineStart: "unset", right: "0", transformOrigin: "top right" },

      "&[data-state=closed]": { animationDuration: "fastest", animationName: "fade-out" },
      "&[data-state=open]": { animationDuration: "fast", animationName: "scale-in, fade-in" },
    },

    link: {
      borderRadius: "l2",
      color: "fg",
      display: "block",
      textDecoration: "none",
      transition: "background-color 0.15s",

      _focusVisible: { focusRing: "outside" },
      _hover: { bg: "bg.subtle" },

      "&[data-current]": { color: "colorPalette.fg", fontWeight: "medium" },
    },

    indicator: {
      bg: "colorPalette.solid",
      borderRadius: "full",
      bottom: "0",
      display: "flex",
      height: "2px",
      insetInlineStart: "0",
      transition: "translate 0.2s, width 0.2s",
      translate: "var(--trigger-x) 0",
      width: "var(--trigger-width)",

      "&[data-state=closed]": { opacity: "0" },
      "&[data-state=open]": { animationDuration: "fast", animationName: "fade-in", opacity: "1" },
    },

    arrow: {
      display: "none",
    },
  },

  variants: {
    size: {
      sm: {
        link: { paddingBlock: "1.5", paddingInline: "2.5", textStyle: "sm" },
        trigger: { height: "8", paddingInline: "2.5", textStyle: "sm" },
      },

      md: {
        link: { paddingBlock: "2", paddingInline: "3", textStyle: "sm" },
        trigger: { height: "10", paddingInline: "3", textStyle: "sm" },
      },
    },
  },

  defaultVariants: { size: "md" },
});

/**
 * The panel opens under the item that raised it rather than centred on it, and it takes its width
 * from what it holds. Both are stated with a fallback, because the measurements Ark publishes are
 * not there on the first frame: a viewport with no width to read stretches the whole bar and then
 * snaps down to size once the number arrives.
 *
 * The positioner spans the bar and starts its viewport at the leading edge, because Ark moves the
 * viewport to the open item by publishing `--viewport-x` as an offset from that edge. Centring the
 * viewport instead adds a second offset, and the panel opens in the middle of the bar whichever
 * item was hovered.
 *
 * A panel is written under the item it belongs to, and Ark moves it: with a viewport on the page it
 * portals the content into that node. So the content slot has to draw two different things. On its
 * own it is the panel — positioned under its trigger, with the border and the shadow. Inside a
 * viewport the viewport is the panel, and the content is a plain block inside it; left absolute it
 * hangs below the bar with a second border drawn around it. It keeps its own width either way,
 * because that width is what the viewport measures itself against.
 *
 * Binds the recipe to the parts below, and carries the resolved styles down the tree.
 */
const { PropsProvider, useStyles, withContext, withProvider } = createSlotRecipeContext({ recipe });

/**
 * Describes what a navigation menu takes beyond an element's own props.
 */
export interface NavigationMenuRootBaseProps
  extends Assign<Ark.RootBaseProps, RecipeVariantProps<typeof recipe>>, UnstyledProp {}

/**
 * Describes the props of {@link NavigationMenuRoot}.
 */
export interface NavigationMenuRootProps extends HTMLChakraProps<
  "nav",
  NavigationMenuRootBaseProps
> {}

/**
 * Holds the menubar, and publishes the measurements every moving part reads.
 */
export const NavigationMenuRoot = withProvider<HTMLElement, NavigationMenuRootProps>(
  Ark.Root,
  "root",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link NavigationMenuRootProvider}.
 */
export interface NavigationMenuRootProviderProps extends HTMLChakraProps<
  "nav",
  Assign<Ark.RootProviderBaseProps, RecipeVariantProps<typeof recipe>> & UnstyledProp
> {}

/**
 * Holds the menubar against state built outside it by `useNavigationMenu`.
 */
export const NavigationMenuRootProvider = withProvider<
  HTMLElement,
  NavigationMenuRootProviderProps
>(Ark.RootProvider, "root", { forwardAsChild: true });

/**
 * Describes the props of {@link NavigationMenuList}.
 */
export interface NavigationMenuListProps
  extends HTMLChakraProps<"div", Ark.ListBaseProps>, UnstyledProp {}

/**
 * The row of items, and what the indicator travels along.
 */
export const NavigationMenuList = withContext<HTMLDivElement, NavigationMenuListProps>(
  Ark.List,
  "list",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link NavigationMenuItem}.
 */
export interface NavigationMenuItemProps
  extends HTMLChakraProps<"div", Ark.ItemBaseProps>, UnstyledProp {}

/**
 * One item of the menubar, holding its trigger and its panel.
 */
export const NavigationMenuItem = withContext<HTMLDivElement, NavigationMenuItemProps>(
  Ark.Item,
  "item",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link NavigationMenuTrigger}.
 */
export interface NavigationMenuTriggerProps
  extends HTMLChakraProps<"button", Ark.TriggerBaseProps>, UnstyledProp {}

/**
 * Opens an item's panel, on hover or on a press.
 */
export const NavigationMenuTrigger = withContext<HTMLButtonElement, NavigationMenuTriggerProps>(
  Ark.Trigger,
  "trigger",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link NavigationMenuItemIndicator}.
 */
export interface NavigationMenuItemIndicatorProps
  extends HTMLChakraProps<"div", Ark.ItemIndicatorBaseProps>, UnstyledProp {}

/**
 * Turns over while its item is open, which is what a chevron in a trigger goes in.
 */
export const NavigationMenuItemIndicator = withContext<
  HTMLDivElement,
  NavigationMenuItemIndicatorProps
>(Ark.ItemIndicator, "itemIndicator", { forwardAsChild: true });

/**
 * Describes the props of {@link NavigationMenuContent}.
 */
export interface NavigationMenuContentProps
  extends HTMLChakraProps<"div", Ark.ContentBaseProps>, UnstyledProp {}

/**
 * What an item opens. Ark moves it into the viewport, which is what gives one panel per menubar.
 */
export const NavigationMenuContent = withContext<HTMLDivElement, NavigationMenuContentProps>(
  Ark.Content,
  "content",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link NavigationMenuLink}.
 */
export interface NavigationMenuLinkProps
  extends HTMLChakraProps<"a", Ark.LinkBaseProps>, UnstyledProp {}

/**
 * One destination inside a panel.
 */
export const NavigationMenuLink = withContext<HTMLAnchorElement, NavigationMenuLinkProps>(
  Ark.Link,
  "link",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link NavigationMenuViewportPositioner}.
 */
export interface NavigationMenuViewportPositionerProps
  extends HTMLChakraProps<"div", Ark.ViewportPositionerBaseProps>, UnstyledProp {}

/**
 * Puts the viewport under the menubar, spanning it.
 */
export const NavigationMenuViewportPositioner = withContext<
  HTMLDivElement,
  NavigationMenuViewportPositionerProps
>(Ark.ViewportPositioner, "viewportPositioner", { forwardAsChild: true });

/**
 * Describes the props of {@link NavigationMenuViewport}.
 */
export interface NavigationMenuViewportProps
  extends HTMLChakraProps<"div", Ark.ViewportBaseProps>, UnstyledProp {}

/**
 * The panel every item's content is shown in, resizing and sliding between them.
 */
export const NavigationMenuViewport = withContext<HTMLDivElement, NavigationMenuViewportProps>(
  Ark.Viewport,
  "viewport",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link NavigationMenuIndicator}.
 */
export interface NavigationMenuIndicatorProps
  extends HTMLChakraProps<"div", Ark.IndicatorBaseProps>, UnstyledProp {}

/**
 * Marks which item is open, travelling along the list.
 */
export const NavigationMenuIndicator = withContext<HTMLDivElement, NavigationMenuIndicatorProps>(
  Ark.Indicator,
  "indicator",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link NavigationMenuArrow}.
 */
export interface NavigationMenuArrowProps
  extends HTMLChakraProps<"div", Ark.ArrowBaseProps>, UnstyledProp {}

/**
 * What the indicator draws. A bar rather than a point, so the tip is left out.
 */
export const NavigationMenuArrow = withContext<HTMLDivElement, NavigationMenuArrowProps>(
  Ark.Arrow,
  "arrow",
  { forwardAsChild: true },
);

/**
 * Reads the menubar's state where a child needs it, as a render prop.
 */
export const NavigationMenuContext = Ark.Context;

/**
 * Sets the props every navigation menu under it takes by default.
 */
export const NavigationMenuPropsProvider = PropsProvider;

/**
 * Reads the styles the recipe resolved, for a part this file does not wrap.
 */
export const useNavigationMenuStyles = useStyles;

export {
  type NavigationMenuValueChangeDetails,
  useNavigationMenu,
  useNavigationMenuContext,
  type UseNavigationMenuContext,
  type UseNavigationMenuProps,
  type UseNavigationMenuReturn,
} from "@ark-ui/react/navigation-menu";
