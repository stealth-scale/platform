/**
 * Shows the disclosure that hides one thing behind one trigger.
 */

import { type ReactElement } from "react";

import { ChevronDownIcon } from "lucide-react";

import { Column, Matrix, Row, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Box } from "#box/box.ts";
import {
  CollapsibleContent,
  CollapsibleIndicator,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "#collapsible/collapsible.ts";

/**
 * Draws one disclosure, open or closed to start with.
 *
 * @param props - Whether it opens closed or open.
 * @returns One trigger and what it hides.
 */
function Included(props: { open: boolean }): ReactElement {
  return (
    <CollapsibleRoot defaultOpen={props.open}>
      <CollapsibleTrigger color="fg" cursor="button">
        <Row gap="2">
          <Text strong>What is included</Text>
          <CollapsibleIndicator>
            <ChevronDownIcon size={16} />
          </CollapsibleIndicator>
        </Row>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Box bg="bg.subtle" borderRadius="l2" mt="2" p="3">
          <Text muted>
            Reconciliation, payouts and the monthly export. Anything raised outside those is quoted
            separately.
          </Text>
        </Box>
      </CollapsibleContent>
    </CollapsibleRoot>
  );
}

export const states: Scene = {
  about:
    "Both at once is the check that the trigger reads the same either way: the indicator turns, and nothing else about the row should move.",
  draw: () => (
    <Matrix gap="6" knob="defaultOpen" label={String} of={[false, true]}>
      {(open) => (
        <Column width="sm">
          <Included open={open} />
        </Column>
      )}
    </Matrix>
  ),
  title: "Open and closed",
};

export default specimen({
  about:
    "One trigger, one thing hidden behind it. Reach for an accordion where there are several and only one should be open at a time.",
  group: "Layout",
  id: "layout/collapsible",
  scenes: [states],
  title: "Collapsible",
});
