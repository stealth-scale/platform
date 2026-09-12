/**
 * Shows the label-and-value list in both orientations, both variants and every size.
 */

import { type ReactElement } from "react";

import { Box, Matrix, Row, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import {
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
  DataListRoot,
  type DataListRootProps,
} from "#data-list/data-list.ts";

/**
 * What the list holds.
 */
const FIELDS = [
  { label: "Account", value: "Bridge Ledger" },
  { label: "Raised", value: "4 September" },
  { label: "Amount", value: "£4,120.00" },
];

/**
 * Which way a pair runs.
 */
const ORIENTATIONS = ["vertical", "horizontal"] as const;

/**
 * How strongly the label is drawn.
 */
const VARIANTS = ["subtle", "bold"] as const;

/**
 * How large the pairs are.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Draws the four pairs, the last of them carrying a mark rather than a word.
 *
 * A value is often a component rather than text, and the pair has to keep its baseline when it is —
 * which is what the last row here checks.
 *
 * @param props - Whichever of them the scene is turning. `DataListRootProps` documents every
 *   member.
 * @returns One list of four pairs.
 */
function Payout(props: DataListRootProps): ReactElement {
  return (
    <DataListRoot {...props}>
      {FIELDS.map((field) => (
        <DataListItem key={field.label}>
          <DataListItemLabel>{field.label}</DataListItemLabel>
          <DataListItemValue>{field.value}</DataListItemValue>
        </DataListItem>
      ))}
      <DataListItem>
        <DataListItemLabel>State</DataListItemLabel>
        <DataListItemValue>
          <Row gap="2">
            <Box height="2" pad="0" round="full" surface="muted" width="2">
              {null}
            </Box>
            <Text>Settled</Text>
          </Row>
        </DataListItemValue>
      </DataListItem>
    </DataListRoot>
  );
}

export const orientations: Scene = {
  about:
    "Down, the label sits over the value; across, beside it. Across is the one that has to be watched as the page narrows, since a long value pushes the column out rather than wrapping under its own label.",
  draw: () => (
    <Matrix direction="row" gap="12" knob="orientation" of={ORIENTATIONS}>
      {(orientation) => <Payout orientation={orientation} />}
    </Matrix>
  ),
  title: "Orientations",
};

export const variants: Scene = {
  about:
    "Which half is louder. Subtle quietens the label so the value reads first, which is right for a summary; bold states both, which is right for a form of settled answers.",
  draw: () => (
    <Matrix direction="row" gap="12" knob="variant" of={VARIANTS}>
      {(variant) => <Payout variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about: "The label and the value step together, so the pair keeps its proportions at every size.",
  draw: () => (
    <Matrix direction="row" gap="10" knob="size" of={SIZES}>
      {(size) => <Payout size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export default specimen({
  about:
    "Pairs of label and value, down the page or across it. What a summary panel and a settled form are both made of.",
  group: "Collections",
  id: "collections/data-list",
  scenes: [orientations, variants, sizes],
  title: "Data list",
});
