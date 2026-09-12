/**
 * The titled block a page is divided into.
 */

import { type ReactElement, type ReactNode } from "react";

import { Heading, Stack } from "@chakra-ui/react";

/**
 * Describes the props of {@link Section}.
 */
export interface SectionProps {
  /**
   * What the section holds.
   */
  children: ReactNode;

  /**
   * What it is called.
   */
  title: string;
}

/**
 * Heads a section of a page.
 *
 * At `h3`, because a page sits under the site's heading and its own title. A section that set its
 * own level would put the reading order in the hands of whichever page happened to be on show.
 *
 * @param props - The section. `SectionProps` documents every member.
 * @returns One titled block.
 */
export function Section(props: SectionProps): ReactElement {
  return (
    <Stack gap="4">
      <Heading as="h3" size="md">
        {props.title}
      </Heading>
      {props.children}
    </Stack>
  );
}
