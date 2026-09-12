/**
 * The timer: a countdown or a stopwatch, read in parts, with controls to run it.
 *
 * Ark supplies the behaviour and this file supplies the look, joined by a slot recipe written in
 * semantic tokens throughout.
 *
 * `Item` takes a `type` — `days`, `hours`, `minutes`, `seconds` or `milliseconds` — and renders
 * that part of the count as its own children, so it is one element rather than a value and a label.
 * Ark documents no `ItemValue` or `ItemLabel` part even though the anatomy names both slots, so
 * nothing is wrapped for them; a caption beside an item is ordinary text.
 *
 * An `ActionTrigger` hides itself when its action does not apply, which is why a start and a pause
 * button can both be rendered and only one ever shows.
 */

import { type Assign } from "@ark-ui/react";
import { Timer as Ark, timerAnatomy } from "@ark-ui/react/timer";
import {
  createSlotRecipeContext,
  defineSlotRecipe,
  type HTMLChakraProps,
  type RecipeVariantProps,
  type UnstyledProp,
} from "@chakra-ui/react";

/**
 * States how a timer is drawn.
 */
const recipe = defineSlotRecipe({
  className: "scale-timer",
  slots: timerAnatomy.keys(),

  base: {
    root: {
      alignItems: "flex-start",
      color: "fg",
      display: "inline-flex",
      flexDirection: "column",
      gap: "4",
    },

    area: {
      alignItems: "center",
      display: "inline-flex",
    },

    item: {
      color: "fg",
      fontVariantNumeric: "tabular-nums",
      fontWeight: "semibold",
      minWidth: "2ch",
      textAlign: "center",
    },

    separator: {
      color: "fg.muted",
      fontWeight: "semibold",
    },

    control: {
      display: "inline-flex",
      gap: "2",
    },

    actionTrigger: {
      alignItems: "center",
      borderColor: "border",
      borderRadius: "l2",
      borderWidth: "1px",
      color: "fg",
      cursor: "button",
      display: "inline-flex",
      fontWeight: "medium",
      gap: "2",
      justifyContent: "center",

      _disabled: { layerStyle: "disabled" },
      _focusVisible: { focusRing: "outside" },
      _hover: { bg: "bg.subtle" },

      "& svg": { boxSize: "4" },
    },
  },

  variants: {
    size: {
      sm: {
        actionTrigger: { height: "8", paddingInline: "2.5", textStyle: "xs" },
        area: { gap: "1" },
        item: { textStyle: "lg" },
        separator: { textStyle: "lg" },
      },

      md: {
        actionTrigger: { height: "10", paddingInline: "3", textStyle: "sm" },
        area: { gap: "2" },
        item: { textStyle: "2xl" },
        separator: { textStyle: "2xl" },
      },

      lg: {
        actionTrigger: { height: "10", paddingInline: "3.5", textStyle: "sm" },
        area: { gap: "2" },
        item: { textStyle: "4xl" },
        separator: { textStyle: "4xl" },
      },
    },

    variant: {
      plain: {},

      tiles: {
        item: {
          bg: "bg.muted",
          borderColor: "border",
          borderRadius: "l2",
          borderWidth: "1px",
          paddingBlock: "2",
          paddingInline: "2",
        },
      },
    },
  },

  defaultVariants: { size: "md", variant: "plain" },
});

/**
 * Binds the recipe to the parts below, and carries the resolved styles down the tree.
 */
const { PropsProvider, useStyles, withContext, withProvider } = createSlotRecipeContext({ recipe });

/**
 * Describes what a timer takes beyond an element's own props.
 */
export interface TimerRootBaseProps
  extends Assign<Ark.RootBaseProps, RecipeVariantProps<typeof recipe>>, UnstyledProp {}

/**
 * Describes the props of {@link TimerRoot}.
 */
export interface TimerRootProps extends HTMLChakraProps<"div", TimerRootBaseProps> {}

/**
 * Holds the timer, and owns whether it is running and how much is left.
 */
export const TimerRoot = withProvider<HTMLDivElement, TimerRootProps>(Ark.Root, "root", {
  forwardAsChild: true,
});

/**
 * Describes the props of {@link TimerRootProvider}.
 */
export interface TimerRootProviderProps extends HTMLChakraProps<
  "div",
  Assign<Ark.RootProviderBaseProps, RecipeVariantProps<typeof recipe>> & UnstyledProp
> {}

/**
 * Holds the timer against state built outside it by `useTimer`.
 */
export const TimerRootProvider = withProvider<HTMLDivElement, TimerRootProviderProps>(
  Ark.RootProvider,
  "root",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link TimerArea}.
 */
export interface TimerAreaProps extends HTMLChakraProps<"div", Ark.AreaBaseProps>, UnstyledProp {}

/**
 * The count itself, announced as a live region so a screen reader follows it.
 */
export const TimerArea = withContext<HTMLDivElement, TimerAreaProps>(Ark.Area, "area", {
  forwardAsChild: true,
});

/**
 * Describes the props of {@link TimerItem}.
 */
export interface TimerItemProps extends HTMLChakraProps<"div", Ark.ItemBaseProps>, UnstyledProp {}

/**
 * One part of the count, named by `type`. Ark writes the figure into it.
 */
export const TimerItem = withContext<HTMLDivElement, TimerItemProps>(Ark.Item, "item", {
  forwardAsChild: true,
});

/**
 * Describes the props of {@link TimerSeparator}.
 */
export interface TimerSeparatorProps
  extends HTMLChakraProps<"div", Ark.SeparatorBaseProps>, UnstyledProp {}

/**
 * What sits between two parts of the count, usually a colon.
 */
export const TimerSeparator = withContext<HTMLDivElement, TimerSeparatorProps>(
  Ark.Separator,
  "separator",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link TimerControl}.
 */
export interface TimerControlProps
  extends HTMLChakraProps<"div", Ark.ControlBaseProps>, UnstyledProp {}

/**
 * Holds the buttons that run, pause and reset the timer.
 */
export const TimerControl = withContext<HTMLDivElement, TimerControlProps>(Ark.Control, "control", {
  forwardAsChild: true,
});

/**
 * Describes the props of {@link TimerActionTrigger}.
 */
export interface TimerActionTriggerProps
  extends HTMLChakraProps<"button", Ark.ActionTriggerBaseProps>, UnstyledProp {}

/**
 * Runs one action — `start`, `pause`, `resume` or `reset` — and hides while that action does not
 * apply.
 */
export const TimerActionTrigger = withContext<HTMLButtonElement, TimerActionTriggerProps>(
  Ark.ActionTrigger,
  "actionTrigger",
  { forwardAsChild: true },
);

/**
 * Reads the timer's state where a child needs it, as a render prop.
 */
export const TimerContext = Ark.Context;

/**
 * Sets the props every timer under it takes by default.
 */
export const TimerPropsProvider = PropsProvider;

/**
 * Reads the styles the recipe resolved, for a part this file does not wrap.
 */
export const useTimerStyles = useStyles;

export {
  useTimer,
  useTimerContext,
  type UseTimerContext,
  type UseTimerProps,
  type UseTimerReturn,
} from "@ark-ui/react/timer";
