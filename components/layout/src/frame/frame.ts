/**
 * The frame: an iframe with React rendering inside it.
 *
 * A frame is a document boundary rather than a look: nothing inherits across it, so the styles a
 * page has loaded stop at its edge and whatever is drawn inside starts from the browser's own
 * defaults. That is what makes it worth having — previewing a component against a stylesheet that
 * is not this one, or holding a third party's markup where it cannot reach the rest of the page.
 *
 * Anything the frame's own document needs goes through `head`, since a stylesheet outside it does
 * not apply within.
 *
 * The recipe says almost nothing, on purpose. It states the border properties because Chakra's
 * reset does not reach an iframe: without a stated style the browser computes any width given to a
 * frame as zero and draws nothing. Stating them is what makes `borderWidth` behave here the way it
 * does on every other box in the kit.
 */

import { type ForwardRefExoticComponent, type PropsWithoutRef, type RefAttributes } from "react";

import { Frame as Ark, type FrameBaseProps } from "@ark-ui/react/frame";
import {
  createRecipeContext,
  defineRecipe,
  type HTMLChakraProps,
  type UnstyledProp,
} from "@chakra-ui/react";

/**
 * States how a frame is drawn.
 */
const recipe = defineRecipe({
  className: "scale-frame",

  base: {
    borderColor: "border",
    borderStyle: "solid",
    borderWidth: "0",
  },
});

/**
 * Binds the recipe to the element below.
 */
const { PropsProvider, withContext } = createRecipeContext({ recipe });

/**
 * Describes the props of {@link Frame}.
 */
export interface FrameProps extends HTMLChakraProps<"iframe", FrameBaseProps>, UnstyledProp {}

/**
 * Holds a document of its own, and renders its children into it.
 */
export const Frame: ForwardRefExoticComponent<
  PropsWithoutRef<FrameProps> & RefAttributes<HTMLIFrameElement>
> = withContext<HTMLIFrameElement, FrameProps>(Ark);

/**
 * Sets the props every frame under it takes by default.
 */
export const FramePropsProvider = PropsProvider;
