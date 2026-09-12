/**
 * Shows the row that joins its children into one control, and the ways it can space them.
 */

import { ChevronDownIcon } from "lucide-react";

import {
  Box,
  Field,
  Matrix,
  type Scene,
  specimen,
  Text,
  Trigger,
} from "@stealthscale/foundation-specimen";

import { Group } from "#group/group.ts";

/**
 * Where the children sit along the row.
 */
const ALIGNMENTS = ["start", "center", "end"] as const;

export const attached: Scene = {
  about:
    "What the group is for. The children share a border and only the outer corners stay round, which is how a field and its button become one control rather than two touching.",
  draw: () => (
    <Group attached width="lg">
      <Box pad="0" round="0" surface="muted">
        <Box pad="2" round="0">
          <Text>£</Text>
        </Box>
      </Box>
      <Field placeholder="0.00" />
      <Trigger label="Pick a currency">
        <ChevronDownIcon size={16} />
      </Trigger>
    </Group>
  ),
  title: "Attached",
};

export const spacing: Scene = {
  about:
    "Left unattached it is a row with a gap, and where the children sit along it is the only thing to decide. `start` and `end` turn with the writing direction rather than staying left and right.",
  draw: () => (
    <Matrix gap="6" knob="justify" of={ALIGNMENTS}>
      {(justify) => (
        <Group
          borderColor="border"
          borderRadius="l2"
          borderWidth="1px"
          justify={justify}
          p="2"
          width="full"
        >
          <Box pad="1" round="l1" surface="subtle">
            <Text size="xs">Settled</Text>
          </Box>
          <Box pad="1" round="l1" surface="subtle">
            <Text size="xs">Held</Text>
          </Box>
          <Box pad="1" round="l1" surface="subtle">
            <Text size="xs">Queued</Text>
          </Box>
        </Group>
      )}
    </Matrix>
  ),
  title: "Spacing",
};

export const growing: Scene = {
  about:
    "One child told to take what is left, which is the shape of every search field with a button on the end. The button keeps its own width and the field absorbs the rest.",
  draw: () => (
    <Group attached width="full">
      <Field grows placeholder="Search the ledger" />
      <Trigger>Search</Trigger>
    </Group>
  ),
  title: "One child growing",
};

export default specimen({
  about:
    "A row that can weld its children into one control, sharing a border and rounding only the outer corners. Left unattached it is a row with a gap.",
  group: "Layout",
  id: "layout/group",
  scenes: [attached, spacing, growing],
  title: "Group",
});
