/**
 * Shows the accordion in every variant and size, and with more than one panel open.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemIndicator,
  AccordionItemTrigger,
  AccordionRoot,
  type AccordionRootProps,
} from "#accordion/accordion.ts";

/**
 * Every way an accordion is set off.
 */
const VARIANTS = ["outline", "subtle", "enclosed", "plain"] as const;

/**
 * Every size an accordion takes.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * What each panel holds.
 */
const CLAUSES = [
  { body: "Everything raised before Friday, matched against the statement.", title: "Scope" },
  { body: "Thirty days from the date on the invoice.", title: "Payment" },
  { body: "Capped at the fees paid in the preceding twelve months.", title: "Liability" },
] as const;

/**
 * Draws the same three clauses, with two of them open.
 *
 * Two open is the case worth showing: with one panel open the variants look alike, and it is two
 * open panels touching that says whether the borders between them are right.
 *
 * @param props - Whichever of them the scene is turning. `AccordionRootProps` documents every
 *   member.
 * @returns One accordion of three clauses.
 */
function Clauses(props: Omit<AccordionRootProps, "children">): ReactElement {
  return (
    <AccordionRoot defaultValue={["Scope", "Payment"]} maxW="18rem" multiple {...props}>
      {CLAUSES.map((clause) => (
        <AccordionItem key={clause.title} value={clause.title}>
          <AccordionItemTrigger>
            {clause.title}
            <AccordionItemIndicator />
          </AccordionItemTrigger>
          <AccordionItemContent>
            <Text muted>{clause.body}</Text>
          </AccordionItemContent>
        </AccordionItem>
      ))}
    </AccordionRoot>
  );
}

export const variants: Scene = {
  about:
    "Enclosed is the one that puts a rule all the way round; the rest let the panels sit on the page. Watch where two open panels meet — that seam is where a variant either states a boundary or forgets to.",
  draw: () => (
    <Matrix direction="row" gap="8" knob="variant" of={VARIANTS}>
      {(variant) => <Clauses variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "The trigger and the panel are padded together, so the rhythm of a closed accordion is the thing the size actually sets.",
  draw: () => (
    <Matrix direction="row" gap="8" knob="size" of={SIZES}>
      {(size) => <Clauses size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export default specimen({
  about:
    "Several things hidden behind several triggers, with one or many open at a time. Reach for a collapsible where there is only one.",
  group: "Layout",
  id: "layout/accordion",
  scenes: [variants, sizes],
  title: "Accordion",
});
