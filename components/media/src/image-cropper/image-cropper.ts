/**
 * The image cropper: a picture with a draggable, resizable box over the part being kept.
 *
 * Ark supplies the behaviour and this file supplies the look, joined by a slot recipe written in
 * semantic tokens throughout.
 *
 * Zag places every moving part itself — the selection off `--crop-x`, `--crop-y`, `--crop-width`
 * and `--crop-height`, the image off `--image-zoom`, `--image-rotation` and the two
 * `--image-offset-*`, each handle off its `position` prop, and the grid off its axis. So the recipe
 * carries appearance, and the one piece of geometry it owns is the scrim: a very large spread
 * shadow on the selection, which dims everything outside the crop without a second element.
 *
 * A handle is a hit area rather than a mark. It is larger than what a reader sees, and the mark is
 * whatever child it is given — a white dot, larger at the corners than along the edges, carrying a
 * drop shadow so it holds against a pale photograph. The grid stays invisible until the crop is
 * being dragged.
 *
 * The scrim, the selection's border and the handles are fixed whites and blacks rather than tokens.
 * They sit over a photograph, whose colours are the reader's rather than the theme's, and a handle
 * that took the palette would disappear into any picture sharing that hue.
 *
 * `handles` lists every position, so a caller renders the set rather than spelling it out.
 */

import { type Assign } from "@ark-ui/react";
import { ImageCropper as Ark, imageCropperAnatomy } from "@ark-ui/react/image-cropper";
import {
  createSlotRecipeContext,
  defineSlotRecipe,
  type HTMLChakraProps,
  type RecipeVariantProps,
  type UnstyledProp,
} from "@chakra-ui/react";

/**
 * States how an image cropper is drawn.
 */
const recipe = defineSlotRecipe({
  className: "scale-image-cropper",
  slots: imageCropperAnatomy.keys(),

  base: {
    root: {
      "--cropper-accent": "{colors.colorPalette.solid}",
      "--cropper-corner-size": "12px",
      "--cropper-handle-size": "9px",
      "--cropper-line-color": "rgb(255 255 255 / 0.6)",
      "--cropper-line-width": "2px",
      "--cropper-overlay-color": "rgb(0 0 0 / 0.5)",
      color: "fg",
      display: "flex",
      flexDirection: "column",
      gap: "4",
      position: "relative",
      width: "full",
    },

    viewport: {
      aspectRatio: "1",
      bg: "bg.subtle",
      borderRadius: "l2",
      overflow: "hidden",
      position: "relative",
      touchAction: "none",
    },

    image: {
      backfaceVisibility: "hidden",
      height: "full",
      insetInlineStart: "0",
      objectFit: "contain",
      pointerEvents: "none",
      position: "absolute",
      top: "0",
      transformOrigin: "center center",
      userSelect: "none",
      width: "full",
    },

    selection: {
      backfaceVisibility: "hidden",
      border: "var(--cropper-line-width) solid var(--cropper-line-color)",
      boxShadow: "0 0 0 9999px var(--cropper-overlay-color)",
      boxSizing: "content-box",
      cursor: "move",
      outline: "none",

      _focusVisible: { borderColor: "var(--cropper-accent)" },

      "&[data-disabled]": { cursor: "default" },
      "&[data-dragging]": { borderColor: "rgb(255 255 255 / 0.8)", cursor: "grabbing" },
      "&[data-shape=circle]": { borderRadius: "full" },
    },

    handle: {
      alignItems: "center",
      boxSize: "calc(var(--cropper-handle-size) + {spacing.2})",
      display: "flex",
      justifyContent: "center",
      position: "absolute",
      touchAction: "none",

      "& > *": {
        bg: "white",
        borderRadius: "full",
        boxShadow: "0 1px 4px rgb(0 0 0 / 0.55)",
        boxSize: "var(--cropper-handle-size)",
        transition: "transform 0.15s",
      },

      "&:hover > *": { transform: "scale(1.2)" },

      "&[data-disabled]": { display: "none" },

      "&[data-position=e], &[data-position=w]": { cursor: "ew-resize" },
      "&[data-position=n], &[data-position=s]": { cursor: "ns-resize" },
      "&[data-position=ne], &[data-position=sw]": { cursor: "nesw-resize" },
      "&[data-position=nw], &[data-position=se]": { cursor: "nwse-resize" },

      "&[data-position=ne] > *, &[data-position=nw] > *, &[data-position=se] > *, &[data-position=sw] > *":
        {
          boxSize: "var(--cropper-corner-size)",
        },
    },

    grid: {
      opacity: "0",
      pointerEvents: "none",
      position: "absolute",
      transition: "opacity 0.2s",

      "&[data-axis=horizontal]": {
        borderBlockWidth: "1px",
        borderColor: "rgb(255 255 255 / 0.4)",
        borderStyle: "solid",
      },
      "&[data-axis=vertical]": {
        borderColor: "rgb(255 255 255 / 0.4)",
        borderInlineWidth: "1px",
        borderStyle: "solid",
      },
      "&[data-dragging], &[data-panning]": { opacity: "1" },

      // Zag spans a line across the whole selection, which is a square. A round crop cuts that
      // square down to the chord the line meets the circle at, and for a line a third of the way
      // out that chord is `sqrt(8/9)` of the diameter.
      "[data-part=selection][data-shape=circle] &": {
        "&[data-axis=horizontal]": { insetInline: "2.859%" },
        "&[data-axis=vertical]": { insetBlock: "2.859%" },
      },
    },
  },

  variants: {
    size: {
      sm: { root: { maxWidth: "20rem" } },

      md: { root: { maxWidth: "28rem" } },

      lg: { root: { maxWidth: "36rem" } },
    },
  },

  defaultVariants: { size: "md" },
});

/**
 * Binds the recipe to the parts below, and carries the resolved styles down the tree.
 */
const { PropsProvider, useStyles, withContext, withProvider } = createSlotRecipeContext({ recipe });

/**
 * Describes what an image cropper takes beyond an element's own props.
 */
export interface ImageCropperRootBaseProps
  extends Assign<Ark.RootBaseProps, RecipeVariantProps<typeof recipe>>, UnstyledProp {}

/**
 * Describes the props of {@link ImageCropperRoot}.
 */
export interface ImageCropperRootProps extends HTMLChakraProps<"div", ImageCropperRootBaseProps> {}

/**
 * Holds the cropper, and owns the crop, the zoom and the rotation.
 *
 * `zoom` has to be forwarded by name, for the same reason the handle's `position` does: it is a CSS
 * property as well as an Ark prop, so the styling factory would take it for a style prop and Ark
 * would never see it.
 */
export const ImageCropperRoot = withProvider<HTMLDivElement, ImageCropperRootProps>(
  Ark.Root,
  "root",
  { forwardAsChild: true, forwardProps: ["zoom"] },
);

/**
 * Describes the props of {@link ImageCropperRootProvider}.
 */
export interface ImageCropperRootProviderProps extends HTMLChakraProps<
  "div",
  Assign<Ark.RootProviderBaseProps, RecipeVariantProps<typeof recipe>> & UnstyledProp
> {}

/**
 * Holds the cropper against state built outside it by `useImageCropper`.
 */
export const ImageCropperRootProvider = withProvider<HTMLDivElement, ImageCropperRootProviderProps>(
  Ark.RootProvider,
  "root",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link ImageCropperViewport}.
 */
export interface ImageCropperViewportProps
  extends HTMLChakraProps<"div", Ark.ViewportBaseProps>, UnstyledProp {}

/**
 * The window the picture is panned and zoomed inside.
 */
export const ImageCropperViewport = withContext<HTMLDivElement, ImageCropperViewportProps>(
  Ark.Viewport,
  "viewport",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link ImageCropperImage}.
 */
export interface ImageCropperImageProps
  extends HTMLChakraProps<"img", Ark.ImageBaseProps>, UnstyledProp {}

/**
 * The picture, faded in once it has loaded and measured.
 */
export const ImageCropperImage = withContext<HTMLImageElement, ImageCropperImageProps>(
  Ark.Image,
  "image",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link ImageCropperSelection}.
 */
export interface ImageCropperSelectionProps
  extends HTMLChakraProps<"div", Ark.SelectionBaseProps>, UnstyledProp {}

/**
 * The box being kept, and what dims everything outside it.
 */
export const ImageCropperSelection = withContext<HTMLDivElement, ImageCropperSelectionProps>(
  Ark.Selection,
  "selection",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link ImageCropperHandle}.
 */
export interface ImageCropperHandleProps
  extends HTMLChakraProps<"div", Ark.HandleBaseProps>, UnstyledProp {}

/**
 * One corner or edge of the selection, dragged to resize it. `position` says which, as a compass
 * point: `n`, `e`, `s`, `w`, `ne`, `se`, `sw` or `nw`.
 *
 * `position` has to be forwarded by name. It is also a CSS property, so the styling factory would
 * otherwise take it for a style prop and consume it, and Ark would see nothing.
 */
export const ImageCropperHandle = withContext<HTMLDivElement, ImageCropperHandleProps>(
  Ark.Handle,
  "handle",
  { forwardAsChild: true, forwardProps: ["position"] },
);

/**
 * Describes the props of {@link ImageCropperGrid}.
 */
export interface ImageCropperGridProps
  extends HTMLChakraProps<"div", Ark.GridBaseProps>, UnstyledProp {}

/**
 * A rule of thirds line across the selection, on whichever axis it is given.
 */
export const ImageCropperGrid = withContext<HTMLDivElement, ImageCropperGridProps>(
  Ark.Grid,
  "grid",
  { forwardAsChild: true },
);

/**
 * Reads the cropper's state where a child needs it, as a render prop.
 */
export const ImageCropperContext = Ark.Context;

/**
 * Lists every handle position, so a caller renders the set rather than spelling it out.
 */
export const imageCropperHandles: readonly Ark.HandlePosition[] = Ark.handles;

/**
 * Sets the props every image cropper under it takes by default.
 */
export const ImageCropperPropsProvider = PropsProvider;

/**
 * Reads the styles the recipe resolved, for a part this file does not wrap.
 */
export const useImageCropperStyles = useStyles;

export {
  type ImageCropperCropChangeDetails,
  type ImageCropperFlipChangeDetails,
  type ImageCropperFlipState,
  type ImageCropperHandlePosition,
  type ImageCropperRotationChangeDetails,
  type ImageCropperZoomChangeDetails,
  useImageCropper,
  useImageCropperContext,
  type UseImageCropperContext,
  type UseImageCropperProps,
  type UseImageCropperReturn,
} from "@ark-ui/react/image-cropper";
