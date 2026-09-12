/**
 * Shows the pager over a long list, in the shapes a table footer usually takes.
 */

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Matrix, Row, type Scene, specimen, Trigger } from "@stealthscale/foundation-specimen";

import {
  PaginationEllipsis,
  PaginationItem,
  PaginationItems,
  PaginationNextTrigger,
  PaginationPageText,
  PaginationPrevTrigger,
  PaginationRoot,
} from "#pagination/pagination.ts";

/**
 * How many rows the pager is counting, and how many fit on a page.
 */
const LIST = { count: 240, pageSize: 10 };

/**
 * How far from the current page the numbers run before collapsing.
 */
const SIBLINGS = [0, 1, 2] as const;

/**
 * How the page text can be worded.
 */
const FORMATS = ["short", "compact", "long"] as const;

export const siblings: Scene = {
  about:
    "Sibling count decides where the ellipsis falls, and it only shows itself part way through a long list — so every row here starts on page twelve of twenty-four. At zero the pager is first, current and last; at two it is wide enough to reach the neighbours on both sides.",
  draw: () => (
    <Matrix gap="8" knob="siblingCount" of={SIBLINGS}>
      {(siblingCount) => (
        <PaginationRoot
          colorPalette="primary"
          count={LIST.count}
          defaultPage={12}
          pageSize={LIST.pageSize}
          siblingCount={siblingCount}
        >
          <Row gap="1">
            <PaginationPrevTrigger asChild>
              <Trigger label="Previous page" quiet>
                <ChevronLeftIcon size={16} />
              </Trigger>
            </PaginationPrevTrigger>

            <PaginationItems
              ellipsis={<PaginationEllipsis index={0} />}
              render={(page) => (
                <PaginationItem asChild type="page" value={page.value}>
                  <Trigger quiet>{page.value}</Trigger>
                </PaginationItem>
              )}
            />

            <PaginationNextTrigger asChild>
              <Trigger label="Next page" quiet>
                <ChevronRightIcon size={16} />
              </Trigger>
            </PaginationNextTrigger>
          </Row>
        </PaginationRoot>
      )}
    </Matrix>
  ),
  title: "How far the numbers run",
};

export const wording: Scene = {
  about:
    "The same position as a sentence instead of a row of numbers. Reach for this where the reader cannot jump anyway — an infinite list, a wizard, a report that only runs forwards.",
  draw: () => (
    <Matrix gap="6" knob="format" of={FORMATS}>
      {(format) => (
        <PaginationRoot count={LIST.count} defaultPage={12} pageSize={LIST.pageSize}>
          <PaginationPageText format={format} />
        </PaginationRoot>
      )}
    </Matrix>
  ),
  title: "As words",
};

export default specimen({
  about:
    "Where in a long list the reader is, and how to move. It draws no controls of its own — the triggers and the numbers are whatever it is handed.",
  group: "Navigation",
  id: "navigation/pagination",
  scenes: [siblings, wording],
  title: "Pagination",
});
