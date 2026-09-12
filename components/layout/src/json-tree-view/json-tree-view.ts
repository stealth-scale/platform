/**
 * The JSON tree view: a value of any shape, opened one level at a time.
 *
 * Ark supplies the behaviour and this file supplies the look, joined by a slot recipe. The recipe
 * is declared here rather than in a theme because it is written in semantic tokens throughout, so a
 * theme that retints `bg`, `fg` and `colorPalette` restyles it without naming it.
 *
 * Ark builds this on the tree view: the root takes a value rather than a collection, walks it, and
 * renders the branches and rows with the tree view's own parts. So the slots are the tree view's,
 * and everything below the root is reached by descendant selector — those parts are Ark's plain
 * elements rather than this kit's, and carry no classes of their own.
 *
 * The rail runs under the caret of the branch it belongs to, so it steps by the same figure the
 * rows do and is offset by half a caret. A rail stepping by a different figure fans away from the
 * carets the deeper the tree goes.
 *
 * A leaf is indented one step further than a branch at the same depth, because a branch spends that
 * step on its arrow and the two have to line up under one another.
 *
 * A collapsed branch previews what is inside it — `{ name: "…", age: 30 }` — and an open one should
 * show only the brace, since what follows is now drawn underneath. Ark renders the preview either
 * way, so the closing brace and the summary are hidden once the branch opens.
 *
 * What the value is made of is marked on the spans: `data-type` for what a value is, `data-kind`
 * for the punctuation and keys around it. Colouring by those is what makes the tree read as JSON
 * rather than as a list of words, and it is the one place in the kit where a palette is chosen by
 * meaning rather than by role.
 */

import { type ForwardRefExoticComponent, type RefAttributes } from "react";

import { JsonTreeView as Ark } from "@ark-ui/react/json-tree-view";
import { treeViewAnatomy } from "@ark-ui/react/tree-view";
import {
  createSlotRecipeContext,
  defineSlotRecipe,
  type HTMLChakraProps,
  type RecipeVariantProps,
  type UnstyledProp,
} from "@chakra-ui/react";

/**
 * States how a JSON tree is drawn.
 *
 * A blank line separates the physical properties from the states, which is what keeps the sorter
 * from alphabetising a size scale into `lg, md, sm, xs`.
 */
const recipe = defineSlotRecipe({
  className: "scale-json-tree-view",
  slots: treeViewAnatomy.keys(),

  base: {
    root: {
      color: "fg",
      fontFamily: "mono",
      width: "full",

      "& [data-part=branch-content]": { position: "relative" },

      "& [data-part=branch-indent-guide]": {
        bg: "border",
        height: "full",
        insetStart: "calc((var(--depth) - 1) * 0.75rem + 0.4rem)",
        position: "absolute",
        width: "1px",

        '&[data-depth="1"]': { insetStart: "0.4rem" },
      },

      "& [data-part=branch-control]": {
        alignItems: "baseline",
        display: "flex",
        paddingStart: "calc((var(--depth) - 1) * 0.75rem)",
        userSelect: "none",

        _hover: { bg: "bg.muted" },
      },

      "& [data-part=branch-indicator]": {
        marginEnd: "1",
        position: "relative",
        top: "1",
        transformOrigin: "center",
        transitionDuration: "normal",
        transitionProperty: "transform",
        transitionTimingFunction: "default",

        _open: { transform: "rotate(90deg)" },
      },

      "& [data-part=item]": {
        alignItems: "baseline",
        display: "flex",
        paddingStart: "calc((var(--depth) - 1) * 0.75rem + 1.25rem)",
        position: "relative",

        _hover: { bg: "bg.muted" },
      },

      "& [data-part=item-text], & [data-part=branch-text]": {
        alignItems: "baseline",
        display: "flex",
      },
    },

    tree: {
      display: "flex",
      flexDirection: "column",
      fontFamily: "mono",

      "& svg": { boxSize: "4" },

      "& [data-type=boolean]": { color: "fg.warning", fontWeight: "semibold" },
      "& [data-type=date]": { color: "fg.info" },
      "& [data-type=error]": { color: "fg.error", fontWeight: "medium" },
      "& [data-type=function]": { color: "fg.warning", fontStyle: "italic" },
      "& [data-type=number]": { color: "fg.info" },
      "& [data-type=regex]": { color: "colorPalette.fg" },
      "& [data-type=string]": { color: "fg.error" },

      "& [data-type=null], & [data-type=undefined]": {
        color: "fg.muted",
        fontStyle: "italic",
        fontWeight: "semibold",
      },

      "& [data-kind=brace]": { color: "fg", fontWeight: "bold" },
      "& [data-kind=colon]": { color: "fg.subtle", marginInline: "1" },
      "& [data-kind=constructor]": { color: "colorPalette.fg", fontWeight: "medium" },
      "& [data-kind=key]": { color: "fg.success", fontWeight: "medium" },
      "& [data-kind=preview-text]": { color: "fg.muted", fontStyle: "italic" },

      "& [data-state=open] > [data-kind=preview] > [data-kind=brace]:last-of-type": {
        display: "none",
      },

      "& [data-state=open] > [data-kind=preview] > [data-kind=preview-text]": { display: "none" },
    },
  },

  variants: {
    size: {
      sm: { tree: { lineHeight: "1.7", textStyle: "xs" } },

      md: { tree: { lineHeight: "1.8", textStyle: "sm" } },
    },
  },

  defaultVariants: { size: "sm" },
});

/**
 * Binds the recipe to the parts below, and carries the resolved styles down the tree.
 */
const { PropsProvider, useStyles, withContext, withProvider } = createSlotRecipeContext({ recipe });

/**
 * Describes the props of {@link JsonTreeViewRoot}.
 */
export interface JsonTreeViewRootProps extends HTMLChakraProps<
  "div",
  Ark.RootProps & RecipeVariantProps<typeof recipe> & UnstyledProp
> {}

/**
 * Holds the value, and says how deep it is opened to start with.
 */
export const JsonTreeViewRoot: ForwardRefExoticComponent<
  JsonTreeViewRootProps & RefAttributes<HTMLDivElement>
> = withProvider<HTMLDivElement, JsonTreeViewRootProps>(Ark.Root, "root", {
  forwardAsChild: true,
  forwardProps: ["data"],
});

/**
 * Describes the props of {@link JsonTreeViewRootProvider}.
 */
export interface JsonTreeViewRootProviderProps extends HTMLChakraProps<
  "div",
  Ark.RootProviderProps & RecipeVariantProps<typeof recipe> & UnstyledProp
> {}

/**
 * Holds the tree against state built outside it by `useJsonTreeView`.
 */
export const JsonTreeViewRootProvider: ForwardRefExoticComponent<
  JsonTreeViewRootProviderProps & RefAttributes<HTMLDivElement>
> = withProvider<HTMLDivElement, JsonTreeViewRootProviderProps>(Ark.RootProvider, "root", {
  forwardAsChild: true,
});

/**
 * Describes the props of {@link JsonTreeViewTree}.
 */
export interface JsonTreeViewTreeProps
  extends HTMLChakraProps<"div", Ark.TreeProps>, UnstyledProp {}

/**
 * Walks the value and draws it: a row per leaf, a branch per object and array.
 */
export const JsonTreeViewTree: ForwardRefExoticComponent<
  JsonTreeViewTreeProps & RefAttributes<HTMLDivElement>
> = withContext<HTMLDivElement, JsonTreeViewTreeProps>(Ark.Tree, "tree", {
  forwardAsChild: true,
  forwardProps: ["arrow", "indentGuide", "renderValue"],
});

/**
 * Sets the props every JSON tree under it takes by default.
 */
export const JsonTreeViewPropsProvider = PropsProvider;

/**
 * Reads the styles the recipe resolved, for a part this file does not wrap.
 */
export const useJsonTreeViewStyles = useStyles;

export {
  useJsonTreeView,
  type UseJsonTreeViewProps,
  type UseJsonTreeViewReturn,
} from "@ark-ui/react/json-tree-view";
