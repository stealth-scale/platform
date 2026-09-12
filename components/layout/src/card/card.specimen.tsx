/**
 * Shows the card in every variant and size.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, Text, Trigger } from "@stealthscale/foundation-specimen";

import {
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardRoot,
  type CardRootProps,
  CardTitle,
} from "#card/card.ts";

/**
 * Every way a card is set off from the page.
 */
const VARIANTS = ["elevated", "outline", "subtle"] as const;

/**
 * Every size a card takes.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Draws a whole card — head, body and foot.
 *
 * All three parts matter: a card's padding is the thing that changes with its size, and that only
 * shows where there is something in each region to be padded away from.
 *
 * @param props - Whichever of them the scene is turning. `CardRootProps` documents every member.
 * @returns One card.
 */
function Reconciliation(props: CardRootProps): ReactElement {
  return (
    <CardRoot maxW="16rem" {...props}>
      <CardHeader>
        <CardTitle>Reconciliation</CardTitle>
        <CardDescription>Four hundred lines</CardDescription>
      </CardHeader>
      <CardBody>
        <Text muted>Everything raised before Friday has been matched against the statement.</Text>
      </CardBody>
      <CardFooter>
        <Trigger>Open</Trigger>
      </CardFooter>
    </CardRoot>
  );
}

export const variants: Scene = {
  about:
    "How the card is lifted off the page: a shadow, a rule, or a tint. Elevated is the one to check in dark mode, where a shadow has almost nothing to fall on.",
  draw: () => (
    <Matrix direction="row" gap="4" knob="variant" of={VARIANTS}>
      {(variant) => <Reconciliation variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "The padding is what changes, and it changes in all three regions together — which is why the head, the body and the foot all have something in them here.",
  draw: () => (
    <Matrix direction="row" gap="4" knob="size" of={SIZES}>
      {(size) => <Reconciliation size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export default specimen({
  about:
    "A head, a body and a foot, padded together. The regions are separate parts so a card can leave any of them out without the padding going wrong.",
  group: "Layout",
  id: "layout/card",
  scenes: [variants, sizes],
  title: "Card",
});
