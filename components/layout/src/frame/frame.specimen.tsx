/**
 * Shows what a frame is for: the page's styles stopping at its edge.
 */

import { Column, Row, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Box } from "#box/box.ts";
import { Frame } from "#frame/frame.ts";

/**
 * What the frame's own document is told, since nothing outside it applies within.
 */
const SHEET = `
  body { margin: 0; font-family: ui-sans-serif, system-ui, sans-serif; }
  .page { padding: 16px; }
  h3 { margin: 0 0 4px; font-size: 15px; }
  p { margin: 0; color: #555; font-size: 13px; }
  button { margin-top: 12px; padding: 6px 10px; font: inherit; }
`;

export const inside: Scene = {
  about:
    "The same markup twice, which is the only way to see what the component does. The left panel inherits everything the catalogue has loaded; the right one is a document of its own, so it starts from the browser’s defaults and takes only the stylesheet handed to its head. Both are React.",
  draw: () => (
    <Row align="stretch" gap="6">
      <Column gap="2" grows>
        <Text muted size="xs">
          on the page
        </Text>
        <Box borderColor="border" borderRadius="l2" borderWidth="1px" p="4">
          <Text strong>Payout 4109</Text>
          <Text muted>Settled on Friday, against four matched lines.</Text>
          <Box mt="3">
            <button type="button">Release</button>
          </Box>
        </Box>
      </Column>

      <Column gap="2" grows>
        <Text muted size="xs">
          inside a frame
        </Text>
        <Frame
          borderColor="border"
          borderRadius="l2"
          borderWidth="1px"
          head={<style>{SHEET}</style>}
          height="9rem"
          title="A framed panel"
          width="full"
        >
          <div className="page">
            <h3>Payout 4109</h3>
            <p>Settled on Friday, against four matched lines.</p>
            <button type="button">Release</button>
          </div>
        </Frame>
      </Column>
    </Row>
  ),
  title: "Beside the page",
};

export default specimen({
  about:
    "A document of its own, rendered from this tree. Nothing outside it applies within, which is what makes it the place to put content nobody here wrote.",
  group: "Layout",
  id: "layout/frame",
  scenes: [inside],
  title: "Frame",
});
