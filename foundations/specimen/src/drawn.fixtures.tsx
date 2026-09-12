/**
 * Draws a specimen's furniture with a theme in scope, which is what its spacing and its inks are
 * read from. Drawn with the styling factory rather than plain elements, so without a theme none of
 * it resolves.
 */

import { type ReactElement, type ReactNode } from "react";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, type RenderResult } from "@testing-library/react";

/**
 * Puts a theme around whatever is being drawn.
 *
 * @param shown - The tree to draw.
 * @returns The same tree, with a theme in scope.
 */
function themed(shown: ReactNode): ReactElement {
  return <ChakraProvider value={defaultSystem}>{shown}</ChakraProvider>;
}

/**
 * Draws something with a theme in scope.
 *
 * @param shown - The tree to draw.
 * @returns The result, for reading the drawn element back off.
 */
export function drawn(shown: ReactNode): RenderResult {
  return render(themed(shown));
}

/**
 * Answers the one element a render produced.
 *
 * A specification that has just drawn a single thing wants that thing. Reading `firstElementChild`
 * at the call site means asserting away a null the specification itself ruled out, which the linter
 * refuses and which says nothing about what went wrong when it is empty.
 *
 * @param container - The element the render was drawn into.
 * @returns Its first element.
 * @throws Error Where the render produced no element.
 */
export function only(container: ParentNode): Element {
  const found = container.firstElementChild;

  if (found === null) throw new Error("The render produced no element.");

  return found;
}
