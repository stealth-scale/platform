/**
 * Shows the rule in every variant and weight, across and down.
 */

import { type ReactElement } from "react";

import { Column, Matrix, Row, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Separator, type SeparatorProps } from "#separator/separator.ts";

/**
 * Every way a rule is drawn.
 */
const VARIANTS = ["solid", "dashed", "dotted"] as const;

/**
 * Every weight a rule takes.
 */
const SIZES = ["xs", "sm", "md", "lg"] as const;

/**
 * Sets a rule between two figures, which is the only place one can be judged.
 *
 * On its own any weight looks reasonable. It is the distance from the words either side that says
 * whether the rule is punctuation or structure.
 *
 * @param props - Whichever of them the scene is turning. `SeparatorProps` documents every member.
 * @returns Two figures with a rule between them.
 */
function Total(props: SeparatorProps): ReactElement {
  return (
    <Column gap="3" width="14rem">
      <Text muted>Gross € 1.056,43</Text>
      <Separator {...props} />
      <Text strong>Net € 1.000,47</Text>
    </Column>
  );
}

export const variants: Scene = {
  about:
    "Solid says the two sides are different things; dashed and dotted say they are the same thing interrupted. Reach for a dashed rule where something is missing rather than where something ends.",
  draw: () => (
    <Matrix knob="variant" of={VARIANTS}>
      {(variant) => <Total variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "The weight is what turns a rule from punctuation into structure. At `xs` it separates two lines of one thing; by `lg` it separates two things.",
  draw: () => (
    <Matrix knob="size" of={SIZES}>
      {(size) => <Total size={size} />}
    </Matrix>
  ),
  title: "Weights",
};

export const standing: Scene = {
  about:
    "A vertical rule takes its length from the row it is in rather than from a height of its own, so a row that grows takes the rule with it.",
  draw: () => (
    <Matrix knob="variant" of={VARIANTS}>
      {(variant) => (
        <Row gap="3">
          <Text>Ledger</Text>
          <Separator orientation="vertical" variant={variant} />
          <Text>Payouts</Text>
        </Row>
      )}
    </Matrix>
  ),
  title: "Standing up",
};

export default specimen({
  about:
    "A rule between two things. Which way it runs is stated; how long it is comes from whatever it is sitting in.",
  group: "Layout",
  id: "layout/separator",
  scenes: [variants, sizes, standing],
  title: "Separator",
});
