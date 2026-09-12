/**
 * The one label a specimen uses: a quiet line naming what the block under it shows.
 */

import { type ReactElement, type ReactNode } from "react";

import { Stack, Text } from "@chakra-ui/react";

/**
 * Describes the props of {@link Caption}.
 */
export interface CaptionProps {
  /**
   * What the caption is over.
   */
  children: ReactNode;

  /**
   * How far the caption sits from what it names.
   */
  gap?: string;

  /**
   * What the block shows, written as a phrase rather than a heading — a specimen is a set of things
   * to look at, and a run of headings makes it read as a document instead.
   */
  of: string;
}

/**
 * Captions a block of a specimen.
 *
 * The same line was written out in forty-seven specimens before this existed, which is forty-seven
 * chances for one of them to be set a size out from the rest. `Matrix` draws the same label over
 * each of its cells; this is that label for everything a matrix does not cover.
 *
 * @param props - The caption and what it names. `CaptionProps` documents every member.
 * @returns The block, under its caption.
 */
export function Caption(props: CaptionProps): ReactElement {
  const { children, gap = "4", of } = props;

  return (
    <Stack gap={gap}>
      <Text color="fg.muted" fontSize="xs" letterSpacing="wide">
        {of}
      </Text>
      {children}
    </Stack>
  );
}
