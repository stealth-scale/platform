/**
 * Shows the splitter with panels a reader can drag between, both ways round.
 */

import { Matrix, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Box } from "#box/box.ts";
import { SplitterPanel, SplitterResizeTrigger, SplitterRoot } from "#splitter/splitter.ts";
import { Stack } from "#stack/stack.ts";

/**
 * Which way the panels sit relative to each other.
 */
const ORIENTATIONS = ["horizontal", "vertical"] as const;

export const orientations: Scene = {
  about:
    "The handle is the whole component, so the scene is the dragging of it: whether it is wide enough to hit, and whether it says so before you press. Drag either one — the panels keep their proportions when the box around them changes.",
  draw: () => (
    <Matrix knob="orientation" of={ORIENTATIONS}>
      {(orientation) => (
        <Box
          borderColor="border"
          borderRadius="l2"
          borderWidth="1px"
          height="12rem"
          overflow="hidden"
          width="26rem"
        >
          <SplitterRoot
            defaultSize={[40, 60]}
            orientation={orientation}
            panels={[{ id: "list" }, { id: "detail" }]}
          >
            <SplitterPanel id="list">
              <Stack gap="1" p="4">
                <Text strong>Offers</Text>
                <Text muted>Four waiting</Text>
              </Stack>
            </SplitterPanel>

            <SplitterResizeTrigger id="list:detail" />

            <SplitterPanel id="detail">
              <Stack gap="1" p="4">
                <Text strong>Detail</Text>
                <Text muted>Nothing selected</Text>
              </Stack>
            </SplitterPanel>
          </SplitterRoot>
        </Box>
      )}
    </Matrix>
  ),
  title: "Orientations",
};

export default specimen({
  about:
    "Two panels with a handle between them, sized by the reader rather than by the layout. The proportions are kept when the box around them changes.",
  group: "Layout",
  id: "layout/splitter",
  scenes: [orientations],
  title: "Splitter",
});
