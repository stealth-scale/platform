import { type ReactElement } from "react";

import { pages } from "virtual:specimen-index";

import { Box, Column, Row, Text } from "@stealthscale/foundation-specimen";

import { useHash } from "#hash.ts";
import { Page } from "#page.tsx";

/**
 * Draws the catalogue: every page down one side, the one the address names on the other.
 *
 * The rail is drawn from the index alone. No page is loaded until it is picked.
 *
 * @returns The catalogue.
 */
export function App(): ReactElement {
  const id = useHash();
  const entry = pages.find((one) => one.id === id);

  return (
    <Row align="stretch" gap="0" nowrap>
      <Box framed pad="4" round="0" width="16rem">
        <Column gap="1">
          {pages.map((one) => (
            <a href={`#${one.id}`} key={one.id}>
              <Text muted={one.id !== id}>
                {one.group} / {one.title}
              </Text>
            </a>
          ))}
        </Column>
      </Box>

      <Box grows pad="8">
        {entry === undefined ? (
          <Text muted>{pages.length} pages. Pick one.</Text>
        ) : (
          <Page entry={entry} key={entry.id} />
        )}
      </Box>
    </Row>
  );
}
