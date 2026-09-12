/**
 * Shows the wrap, which works its own columns out from the room it is given.
 */

import { Matrix, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Wrap, WrapItem } from "#wrap/wrap.ts";

/**
 * What a row of tags might hold.
 */
const NAMES = ["ledger", "payouts", "reconciliation", "archive", "exports", "audit"];

/**
 * How wide the wrap is allowed to run, so the break can be watched moving.
 */
const WIDTHS = ["12rem", "18rem", "28rem"] as const;

export const widths: Scene = {
  about:
    "Unlike either grid, a wrap is told nothing about columns: it lays items out in a row and breaks where it runs out of room. That is what to reach for when the items are different widths and a column would leave holes.",
  draw: () => (
    <Matrix knob="maxW" of={WIDTHS}>
      {(width) => (
        <Wrap gap="2" maxW={width}>
          {NAMES.map((name) => (
            <WrapItem bg="bg.muted" borderRadius="l1" key={name} px="3" py="1">
              <Text>{name}</Text>
            </WrapItem>
          ))}
        </Wrap>
      )}
    </Matrix>
  ),
  title: "Where it breaks",
};

export default specimen({
  about:
    "Lays items out in a row and breaks where it runs out of room. Nothing states a column count, so items of unequal width leave no holes.",
  group: "Layout",
  id: "layout/wrap",
  scenes: [widths],
  title: "Wrap",
});
