/**
 * The tour: a walkthrough that steps a person around a page, ringing each thing it points at.
 *
 * Ark supplies the behaviour and this file supplies the look, joined by a slot recipe written in
 * semantic tokens throughout. The recipe follows the one on Ark's own site, retuned to this
 * repository's tokens.
 *
 * `Root` renders no element at all — it is the providers plus the presence machine — so it takes no
 * slot and is wrapped as a root provider. `Actions` is a render prop that hands back the current
 * step's actions, so it is re-exported unwrapped: there is nothing to style.
 *
 * A step is either a `dialog`, which is centred over a dimmed page, or a `tooltip`, which is placed
 * against a target. The positioner carries `data-type`, and switching between fixed and absolute on
 * that attribute is what makes one component do both. Zag places the spotlight itself off the
 * target's measured box, so the recipe only rings it.
 *
 * On a tooltip step zag writes `z-index: var(--z-index)` inline on the positioner, reading
 * `calc(var(--tour-layer) + var(--tour-z-index))`. The recipe defines `--tour-z-index`, without
 * which the calc is invalid, the inline z-index computes to `auto`, and the step is painted under
 * the backdrop.
 *
 * `Root` renders no element, so `colorPalette` set on it reaches nothing. A caller names the
 * palette on the parts that draw in it — the spotlight and the content.
 */

import { type Assign } from "@ark-ui/react";
import { Tour as Ark, tourAnatomy } from "@ark-ui/react/tour";
import {
  createSlotRecipeContext,
  defineSlotRecipe,
  type HTMLChakraProps,
  type RecipeVariantProps,
  type UnstyledProp,
} from "@chakra-ui/react";

/**
 * States how a tour is drawn.
 */
const recipe = defineSlotRecipe({
  className: "scale-tour",
  slots: tourAnatomy.keys(),

  base: {
    backdrop: {
      backdropFilter: "blur(4px)",
      bg: { _dark: "blackAlpha.600", _light: "blackAlpha.400" },
      zIndex: "overlay",

      _closed: { animationDuration: "fast", animationName: "fade-out" },
      _open: { animationDuration: "moderate", animationName: "fade-in" },
    },

    spotlight: {
      borderColor: "colorPalette.solid",
      borderStyle: "solid",
      borderWidth: "3px",
      zIndex: "modal",
    },

    positioner: {
      "--tour-z-index": "{zIndex.modal}",
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      zIndex: "modal",

      "&[data-type=dialog]": { inset: "0", position: "fixed" },
      "&[data-type=tooltip]": { position: "absolute" },
    },

    content: {
      bg: "bg.panel",
      borderColor: "border",
      borderRadius: "l3",
      borderWidth: "1px",
      boxShadow: "lg",
      display: "flex",
      flexDirection: "column",
      gap: "3",
      maxWidth: "sm",
      padding: "5",
      position: "relative",

      _closed: { animationDuration: "fast", animationName: "fade-out, scale-out" },
      _open: { animationDuration: "moderate", animationName: "fade-in, scale-in" },
    },

    title: {
      color: "fg",
      fontWeight: "medium",
      textStyle: "lg",
    },

    description: {
      color: "fg.muted",
      textStyle: "sm",
    },

    progressText: {
      color: "fg.muted",
      textStyle: "sm",
    },

    control: {
      alignItems: "center",
      display: "flex",
      gap: "3",
      justifyContent: "flex-end",
    },

    actionTrigger: {
      alignItems: "center",
      borderRadius: "l2",
      cursor: "button",
      display: "inline-flex",
      fontWeight: "medium",
      height: "9",
      justifyContent: "center",
      paddingInline: "3",
      textStyle: "sm",

      _disabled: { layerStyle: "disabled" },
      _focusVisible: { focusRing: "outside" },

      "&[data-type=next]": {
        bg: "colorPalette.solid",
        color: "colorPalette.contrast",

        _hover: { bg: "colorPalette.emphasized" },
      },

      "&:not([data-type=next])": {
        borderColor: "border",
        borderWidth: "1px",
        color: "fg",

        _hover: { bg: "bg.subtle" },
      },
    },

    closeTrigger: {
      alignItems: "center",
      borderRadius: "l1",
      color: "fg.muted",
      cursor: "button",
      display: "inline-flex",
      insetBlockStart: "3",
      insetInlineEnd: "3",
      justifyContent: "center",
      position: "absolute",

      _focusVisible: { focusRing: "outside" },
      _hover: { bg: "bg.subtle", color: "fg" },
    },

    arrow: {
      "--arrow-background": "colors.bg.panel",
      "--arrow-size": "sizes.3",
    },

    arrowTip: {
      borderColor: "border",
      borderInlineStartWidth: "1px",
      borderTopWidth: "1px",
    },
  },
});

/**
 * Binds the recipe to the parts below, and carries the resolved styles down the tree.
 */
const { PropsProvider, useStyles, withContext, withRootProvider } = createSlotRecipeContext({
  recipe,
});

/**
 * Describes the props of {@link TourRoot}.
 */
export interface TourRootProps
  extends Assign<Ark.RootProps, RecipeVariantProps<typeof recipe>>, UnstyledProp {}

/**
 * Holds the tour. Renders no element of its own, putting the tour and its presence in scope, which
 * is why it takes no styling and no ref.
 *
 * It mounts its parts on the first step and unmounts them on the last. Ark hides the backdrop on
 * whether the current step asks for one rather than on whether the tour is open, so the presence
 * gate is what takes it off the page; left mounted, a dismissed tour keeps the page dimmed. Both
 * are defaults rather than fixed, so a caller wanting the parts to persist passes
 * `unmountOnExit={false}`.
 */
export const TourRoot = withRootProvider<TourRootProps>(Ark.Root, {
  defaultProps: { lazyMount: true, unmountOnExit: true },
});

/**
 * Describes the props of {@link TourBackdrop}.
 */
export interface TourBackdropProps
  extends HTMLChakraProps<"div", Ark.BackdropBaseProps>, UnstyledProp {}

/**
 * Dims and blurs the page behind a step.
 */
export const TourBackdrop = withContext<HTMLDivElement, TourBackdropProps>(
  Ark.Backdrop,
  "backdrop",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link TourSpotlight}.
 */
export interface TourSpotlightProps
  extends HTMLChakraProps<"div", Ark.SpotlightBaseProps>, UnstyledProp {}

/**
 * Rings whatever the current step points at, over the backdrop.
 */
export const TourSpotlight = withContext<HTMLDivElement, TourSpotlightProps>(
  Ark.Spotlight,
  "spotlight",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link TourPositioner}.
 */
export interface TourPositionerProps
  extends HTMLChakraProps<"div", Ark.PositionerBaseProps>, UnstyledProp {}

/**
 * Places the step: over the whole page for a dialog, against the target for a tooltip.
 */
export const TourPositioner = withContext<HTMLDivElement, TourPositionerProps>(
  Ark.Positioner,
  "positioner",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link TourContent}.
 */
export interface TourContentProps
  extends HTMLChakraProps<"div", Ark.ContentBaseProps>, UnstyledProp {}

/**
 * The card a step is written on.
 */
export const TourContent = withContext<HTMLDivElement, TourContentProps>(Ark.Content, "content", {
  forwardAsChild: true,
});

/**
 * Describes the props of {@link TourTitle}.
 */
export interface TourTitleProps extends HTMLChakraProps<"h2", Ark.TitleBaseProps>, UnstyledProp {}

/**
 * Names the step.
 */
export const TourTitle = withContext<HTMLHeadingElement, TourTitleProps>(Ark.Title, "title", {
  forwardAsChild: true,
});

/**
 * Describes the props of {@link TourDescription}.
 */
export interface TourDescriptionProps
  extends HTMLChakraProps<"div", Ark.DescriptionBaseProps>, UnstyledProp {}

/**
 * Says what the step is about.
 */
export const TourDescription = withContext<HTMLDivElement, TourDescriptionProps>(
  Ark.Description,
  "description",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link TourProgressText}.
 */
export interface TourProgressTextProps
  extends HTMLChakraProps<"div", Ark.ProgressTextBaseProps>, UnstyledProp {}

/**
 * Reads out how far through the tour the step is.
 */
export const TourProgressText = withContext<HTMLDivElement, TourProgressTextProps>(
  Ark.ProgressText,
  "progressText",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link TourControl}.
 */
export interface TourControlProps
  extends HTMLChakraProps<"div", Ark.ControlBaseProps>, UnstyledProp {}

/**
 * Holds the step's buttons, ranged to the end.
 */
export const TourControl = withContext<HTMLDivElement, TourControlProps>(Ark.Control, "control", {
  forwardAsChild: true,
});

/**
 * Describes the props of {@link TourActionTrigger}.
 */
export interface TourActionTriggerProps
  extends HTMLChakraProps<"button", Ark.ActionTriggerBaseProps>, UnstyledProp {}

/**
 * One of the step's buttons. The `next` action is drawn as the filled one and the rest as outlines,
 * which is what makes the way forward the obvious press.
 */
export const TourActionTrigger = withContext<HTMLButtonElement, TourActionTriggerProps>(
  Ark.ActionTrigger,
  "actionTrigger",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link TourCloseTrigger}.
 */
export interface TourCloseTriggerProps
  extends HTMLChakraProps<"button", Ark.CloseTriggerBaseProps>, UnstyledProp {}

/**
 * Abandons the tour.
 */
export const TourCloseTrigger = withContext<HTMLButtonElement, TourCloseTriggerProps>(
  Ark.CloseTrigger,
  "closeTrigger",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link TourArrow}.
 */
export interface TourArrowProps extends HTMLChakraProps<"div", Ark.ArrowBaseProps>, UnstyledProp {}

/**
 * Points a tooltip step at its target.
 */
export const TourArrow = withContext<HTMLDivElement, TourArrowProps>(Ark.Arrow, "arrow", {
  forwardAsChild: true,
});

/**
 * Describes the props of {@link TourArrowTip}.
 */
export interface TourArrowTipProps
  extends HTMLChakraProps<"div", Ark.ArrowTipBaseProps>, UnstyledProp {}

/**
 * The arrow's point, which carries the card's border along two of its sides.
 */
export const TourArrowTip = withContext<HTMLDivElement, TourArrowTipProps>(
  Ark.ArrowTip,
  "arrowTip",
  { forwardAsChild: true },
);

/**
 * Hands back the current step's actions, so the buttons a step asks for can be rendered from it. A
 * render prop rather than an element, so there is nothing to style.
 */
export const TourActions = Ark.Actions;

/**
 * Reads the tour's state where a child needs it, as a render prop.
 */
export const TourContext = Ark.Context;

/**
 * Sets the props every tour under it takes by default.
 */
export const TourPropsProvider = PropsProvider;

/**
 * Reads the styles the recipe resolved, for a part this file does not wrap.
 */
export const useTourStyles = useStyles;

export {
  type TourFocusOutsideEvent,
  type TourInteractOutsideEvent,
  type TourPointerDownOutsideEvent,
  type TourStepDetails,
  type TourStepEffectArgs,
  useTour,
  type UseTourContext,
  useTourContext,
  type UseTourProps,
  type UseTourReturn,
  waitForElement,
  waitForElementValue,
  waitForEvent,
  type WaitForEventOptions,
  waitForPromise,
  type WaitOptions,
} from "@ark-ui/react/tour";
