/**
 * Lays a scene out down.
 */

import { type ReactElement } from "react";

import { chakra } from "@chakra-ui/react";

import { type LineProps } from "#line.ts";

/**
 * Describes the props of {@link Column}.
 */
export type ColumnProps = LineProps;

/**
 * Lays things out down.
 *
 * @param props - The children and their spacing. `ColumnProps` documents every member.
 * @returns One column.
 */
export function Column(props: ColumnProps): ReactElement {
  const {
    align = "stretch",
    children,
    gap = "3",
    grows = false,
    justify = "flex-start",
    width,
  } = props;

  return (
    <chakra.div
      alignItems={align}
      display="flex"
      flex={grows ? "1" : undefined}
      flexDirection="column"
      gap={gap}
      justifyContent={justify}
      maxWidth={width}
    >
      {children}
    </chakra.div>
  );
}
