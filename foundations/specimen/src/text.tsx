/**
 * The line of words a scene annotates itself with.
 */

import { type ReactElement, type ReactNode } from "react";

import { chakra } from "@chakra-ui/react";

/**
 * Describes the props of {@link Text}.
 */
export interface TextProps {
  /**
   * The words.
   */
  children: ReactNode;

  /**
   * Sets it in the quieter ink, for a line that annotates rather than states.
   */
  muted?: boolean;

  /**
   * How large it is. Small by default, because a scene's words are never the thing being looked at.
   */
  size?: "md" | "sm" | "xs";

  /**
   * Sets it in medium, for a word that names the thing beside it.
   */
  strong?: boolean;
}

/**
 * Writes a line inside a scene.
 *
 * Three knobs rather than the styling factory's whole surface, and those three are what a hundred
 * specimens actually reached for: a size, a quieter ink, and a weight for the word that names
 * something. A scene that wants more than this is usually a scene that should have been two.
 *
 * @param props - The words and how to set them. `TextProps` documents every member.
 * @returns One line.
 */
export function Text(props: TextProps): ReactElement {
  const { children, muted = false, size = "sm", strong = false } = props;

  return (
    <chakra.p
      color={muted ? "fg.muted" : undefined}
      fontSize={size}
      fontWeight={strong ? "medium" : undefined}
    >
      {children}
    </chakra.p>
  );
}
