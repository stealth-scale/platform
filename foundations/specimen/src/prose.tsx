/**
 * The measure prose is set to, and the column that holds it to it.
 */

import { type ReactElement, type ReactNode } from "react";

import { Stack } from "@chakra-ui/react";

import { MEASURE } from "#measure.ts";

/**
 * Describes the props of {@link Prose}.
 */
export interface ProseProps {
  /**
   * The paragraphs.
   */
  children: ReactNode;
}

/**
 * Sets prose to a readable measure.
 *
 * @param props - The paragraphs. `ProseProps` documents every member.
 * @returns One column of prose.
 */
export function Prose(props: ProseProps): ReactElement {
  return (
    <Stack color="fg.muted" gap="3" maxW={MEASURE} textStyle="sm">
      {props.children}
    </Stack>
  );
}
