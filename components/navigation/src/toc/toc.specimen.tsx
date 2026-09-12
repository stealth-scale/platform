/**
 * Shows the table of contents beside prose it is actually watching.
 */

import { type ReactElement, useRef } from "react";

import { Box, Column, Row, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import {
  TocIndicator,
  TocItem,
  type TocItemData,
  TocLink,
  TocList,
  TocNav,
  TocRoot,
  TocTitle,
} from "#toc/toc.ts";

/**
 * Which headings the rail lists, and how deep each sits.
 */
const HEADINGS: readonly TocItemData[] = [
  { depth: 2, value: "scope" },
  { depth: 3, value: "inclusions" },
  { depth: 3, value: "exclusions" },
  { depth: 2, value: "payment" },
  { depth: 2, value: "liability" },
];

/**
 * Draws a scrolling column of prose with the rail beside it.
 *
 * The rail only marks anything once a heading is actually on screen, so the prose has to be real
 * and scrollable for the indicator to have somewhere to slide to. Which box to watch is handed to
 * the root, since otherwise it watches the window and this one scrolls inside the page.
 *
 * @returns The rail and the prose it watches, side by side.
 */
function Watched(): ReactElement {
  const scroller = useRef<HTMLDivElement>(null);

  return (
    <TocRoot colorPalette="primary" items={[...HEADINGS]} scrollEl={() => scroller.current}>
      <Row align="start" gap="8">
        <TocNav minW="12rem" position="sticky" top="0">
          <TocTitle>On this page</TocTitle>
          <TocList>
            <TocIndicator />
            {HEADINGS.map((heading) => (
              <TocItem item={heading} key={heading.value}>
                <TocLink href={`#${heading.value}`}>{heading.value}</TocLink>
              </TocItem>
            ))}
          </TocList>
        </TocNav>

        <Box grows height="20rem" pad="0" ref={scroller} scrolls>
          <Column gap="4">
            {HEADINGS.map((heading) => (
              <Column gap="2" key={heading.value}>
                <Box id={heading.value} pad="0">
                  <Text size="md" strong>
                    {heading.value}
                  </Text>
                </Box>
                <Text muted>
                  Each clause runs long enough that only one heading is on screen at a time, which
                  is the condition the rail is built for.
                </Text>
                <Box height="8rem" surface="muted">
                  {null}
                </Box>
              </Column>
            ))}
          </Column>
        </Box>
      </Row>
    </TocRoot>
  );
}

export const watching: Scene = {
  about:
    "Scroll the right-hand column. The rail marks whichever heading is on screen and the indicator slides to it, which is the whole of what the component does and the only way to see it.",
  draw: Watched,
  title: "Watching the prose",
};

export default specimen({
  about:
    "A rail listing the headings of a page, marking whichever one the reader is at. It is told which box to watch, so it works inside a scrolling panel as well as down the page.",
  group: "Navigation",
  id: "navigation/toc",
  scenes: [watching],
  title: "Table of contents",
});
