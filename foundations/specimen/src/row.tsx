/**
 * Lays a scene out across.
 */

import { type ReactElement } from "react";

import { chakra } from "@chakra-ui/react";

import { type LineProps, WELDED } from "#line.ts";

/**
 * Describes the props of {@link Row}.
 */
export interface RowProps extends LineProps {
  /**
   * Joins the children into one control, sharing a border where they meet.
   *
   * A field with a unit welded to it, a strip of buttons, a value beside the thing that copies it.
   * The inner corners are squared and the borders overlapped by a hairline, so the row reads as one
   * thing rather than as several touching.
   */
  attached?: boolean;

  /**
   * Keeps the children on one line, however narrow the page gets.
   *
   * A row wraps unless told not to, because a specimen is read at whatever width the reader has and
   * a row that overflows is a row nobody can see the end of.
   */
  nowrap?: boolean;
}

/**
 * Lays things out across.
 *
 * @param props - The children and their spacing. `RowProps` documents every member.
 * @returns One row.
 */
export function Row(props: RowProps): ReactElement {
  const {
    align = "center",
    attached = false,
    children,
    gap = "3",
    grows = false,
    justify = "flex-start",
    nowrap = false,
    width,
  } = props;

  return (
    <chakra.div
      alignItems={align}
      display="flex"
      flexWrap={nowrap ? "nowrap" : "wrap"}
      gap={gap}
      justifyContent={justify}
      maxWidth={width}
      {...(grows && { flex: "1" })}
      {...(attached && WELDED)}
    >
      {children}
    </chakra.div>
  );
}
