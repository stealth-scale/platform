/**
 * The signature pad: a box a person draws a signature in with a pointer.
 *
 * Ark supplies the behaviour and this file supplies the look, joined by a slot recipe written in
 * semantic tokens throughout.
 *
 * `Segment` renders the `<svg>` and every `<path>` inside it, and Ark publishes no `SegmentPath`
 * part even though the anatomy names a `segmentPath` slot. Zag hands each path a filled outline
 * rather than a line to stroke, so the ink is the segment's `fill` and every path inherits it.
 */

import { type Assign } from "@ark-ui/react";
import { SignaturePad as Ark, signaturePadAnatomy } from "@ark-ui/react/signature-pad";
import {
  createSlotRecipeContext,
  defineSlotRecipe,
  type HTMLChakraProps,
  type RecipeVariantProps,
  type UnstyledProp,
} from "@chakra-ui/react";

/**
 * States how a signature pad is drawn.
 */
const recipe = defineSlotRecipe({
  className: "scale-signature-pad",
  slots: signaturePadAnatomy.keys(),

  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5",
      width: "full",

      _disabled: { layerStyle: "disabled" },
    },

    label: {
      color: "fg",
      fontWeight: "medium",
      textStyle: "sm",
    },

    control: {
      bg: "bg.subtle",
      borderColor: "border",
      borderRadius: "l2",
      borderWidth: "1px",
      minWidth: "0",
      position: "relative",
      touchAction: "none",
      width: "full",

      _focusWithin: { focusRing: "inside" },
    },

    segment: {
      fill: "colorPalette.fg",
      height: "full",
      width: "full",
    },

    guide: {
      borderBottomWidth: "1px",
      borderColor: "border.emphasized",
      borderStyle: "dashed",
      bottom: "6",
      insetInline: "6",
      position: "absolute",
    },

    clearTrigger: {
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
      _hover: { bg: "bg.muted", color: "fg" },

      "& svg": { boxSize: "4" },
    },
  },

  variants: {
    size: {
      sm: {
        clearTrigger: { boxSize: "6", textStyle: "xs" },
        control: { minHeight: "40" },
      },

      md: {
        clearTrigger: { boxSize: "8", textStyle: "xs" },
        control: { minHeight: "52" },
      },

      lg: {
        clearTrigger: { boxSize: "8", textStyle: "sm" },
        control: { minHeight: "64" },
      },
    },
  },

  defaultVariants: { size: "md" },
});

/**
 * Binds the recipe to the parts below, and carries the resolved styles down the tree.
 */
const { PropsProvider, useStyles, withContext, withProvider } = createSlotRecipeContext({ recipe });

/**
 * Describes what a signature pad takes beyond an element's own props.
 */
export interface SignaturePadRootBaseProps
  extends Assign<Ark.RootBaseProps, RecipeVariantProps<typeof recipe>>, UnstyledProp {}

/**
 * Describes the props of {@link SignaturePadRoot}.
 */
export interface SignaturePadRootProps extends HTMLChakraProps<"div", SignaturePadRootBaseProps> {}

/**
 * Holds the pad, and owns the strokes drawn in it.
 */
export const SignaturePadRoot = withProvider<HTMLDivElement, SignaturePadRootProps>(
  Ark.Root,
  "root",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link SignaturePadRootProvider}.
 */
export interface SignaturePadRootProviderProps extends HTMLChakraProps<
  "div",
  Assign<Ark.RootProviderBaseProps, RecipeVariantProps<typeof recipe>> & UnstyledProp
> {}

/**
 * Holds the pad against state built outside it by `useSignaturePad`.
 */
export const SignaturePadRootProvider = withProvider<HTMLDivElement, SignaturePadRootProviderProps>(
  Ark.RootProvider,
  "root",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link SignaturePadLabel}.
 */
export interface SignaturePadLabelProps
  extends HTMLChakraProps<"label", Ark.LabelBaseProps>, UnstyledProp {}

/**
 * Names what is being signed.
 */
export const SignaturePadLabel = withContext<HTMLLabelElement, SignaturePadLabelProps>(
  Ark.Label,
  "label",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link SignaturePadControl}.
 */
export interface SignaturePadControlProps
  extends HTMLChakraProps<"div", Ark.ControlBaseProps>, UnstyledProp {}

/**
 * The box a pointer draws in.
 */
export const SignaturePadControl = withContext<HTMLDivElement, SignaturePadControlProps>(
  Ark.Control,
  "control",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link SignaturePadSegment}.
 */
export interface SignaturePadSegmentProps
  extends HTMLChakraProps<"svg", Ark.SegmentBaseProps>, UnstyledProp {}

/**
 * Draws every stroke made so far, and the one in progress.
 */
export const SignaturePadSegment = withContext<SVGSVGElement, SignaturePadSegmentProps>(
  Ark.Segment,
  "segment",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link SignaturePadGuide}.
 */
export interface SignaturePadGuideProps
  extends HTMLChakraProps<"div", Ark.GuideBaseProps>, UnstyledProp {}

/**
 * The line a signature is meant to sit on.
 */
export const SignaturePadGuide = withContext<HTMLDivElement, SignaturePadGuideProps>(
  Ark.Guide,
  "guide",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link SignaturePadClearTrigger}.
 */
export interface SignaturePadClearTriggerProps
  extends HTMLChakraProps<"button", Ark.ClearTriggerBaseProps>, UnstyledProp {}

/**
 * Throws away every stroke. Ark renders it only once something has been drawn.
 */
export const SignaturePadClearTrigger = withContext<
  HTMLButtonElement,
  SignaturePadClearTriggerProps
>(Ark.ClearTrigger, "clearTrigger", { forwardAsChild: true });

/**
 * Describes the props of {@link SignaturePadHiddenInput}.
 */
export interface SignaturePadHiddenInputProps
  extends HTMLChakraProps<"input", Ark.HiddenInputBaseProps>, UnstyledProp {}

/**
 * Carries the signature into a form submission under the name the root was given. The caller
 * supplies `value`, which is what `onDrawEnd` hands back as a data URL. Ark names no slot for it,
 * so it takes no styling.
 */
export const SignaturePadHiddenInput = withContext<HTMLInputElement, SignaturePadHiddenInputProps>(
  Ark.HiddenInput,
  undefined,
  { forwardAsChild: true },
);

/**
 * Reads the pad's state where a child needs it, as a render prop.
 */
export const SignaturePadContext = Ark.Context;

/**
 * Sets the props every signature pad under it takes by default.
 */
export const SignaturePadPropsProvider = PropsProvider;

/**
 * Reads the styles the recipe resolved, for a part this file does not wrap.
 */
export const useSignaturePadStyles = useStyles;

export {
  type SignaturePadDrawDetails,
  type SignaturePadDrawEndDetails,
  type SignaturePadDrawingOptions,
  useSignaturePad,
  useSignaturePadContext,
  type UseSignaturePadContext,
  type UseSignaturePadProps,
  type UseSignaturePadReturn,
} from "@ark-ui/react/signature-pad";
