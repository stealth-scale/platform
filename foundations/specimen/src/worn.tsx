import { type ReactElement, type ReactNode } from "react";

import { ChakraProvider } from "@chakra-ui/react";

import { type Wearable } from "#catalogue.ts";

/**
 * Describes the props of {@link Worn}.
 */
export interface WornProps {
  /**
   * What is drawn in the theme.
   */
  children: ReactNode;

  /**
   * The theme worn.
   */
  theme: Wearable;
}

/**
 * Puts a theme in scope, which is what every specimen's furniture resolves its tokens from.
 *
 * The one place a catalogue meets the styling engine. An application wears a theme here and imports
 * nothing from the engine itself, which keeps the choice of engine this package's.
 *
 * @param props - The theme and what to draw in it. `WornProps` documents every member.
 * @returns The children, with the theme in scope.
 */
export function Worn({ children, theme }: WornProps): ReactElement {
  return <ChakraProvider value={theme.system}>{children}</ChakraProvider>;
}
