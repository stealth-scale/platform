/**
 * Shows the component that maps over a list in the markup, including when the list is empty.
 */

import { Box, Matrix, Row, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { For } from "#for/for.ts";

/**
 * What is mapped over: one list with rows, one without.
 */
const LISTS = [
  { name: "three", of: ["Settled", "Held", "Queued"] },
  { name: "none", of: [] },
];

export const lists: Scene = {
  about:
    "It earns its place on the empty list. The fallback is a prop rather than a ternary wrapped round the map, so the markup stays one expression whether there is anything to draw or not — and the empty case cannot be forgotten, because leaving the prop off is the only way to get no fallback.",
  draw: () => (
    <Matrix gap="8" knob="each" label={(list) => list.name} of={LISTS}>
      {(list) => (
        <Row gap="2">
          <For each={list.of} fallback={<Text muted>Nothing raised this week.</Text>}>
            {(state) => (
              <Box key={state} pad="1" round="l1" surface="subtle">
                <Text size="xs">{state}</Text>
              </Box>
            )}
          </For>
        </Row>
      )}
    </Matrix>
  ),
  title: "With rows, and without",
};

export default specimen({
  about:
    "Maps over a list in the markup, with the empty case as a prop rather than a branch. It draws nothing of its own.",
  group: "Collections",
  id: "collections/for",
  scenes: [lists],
  title: "For",
});
