/**
 * Shows the card that opens on hover, at every size.
 */

import {
  Box,
  Column,
  Matrix,
  Row,
  type Scene,
  specimen,
  Text,
} from "@stealthscale/foundation-specimen";

import {
  HoverCardArrow,
  HoverCardArrowTip,
  HoverCardContent,
  HoverCardPositioner,
  HoverCardRoot,
  HoverCardTrigger,
} from "#hover-card/hover-card.ts";

/**
 * How large the card is.
 */
const SIZES = ["xs", "sm", "md", "lg"] as const;

export const sizes: Scene = {
  about:
    "Hover one, then move away. It waits before opening and again before closing, which is what stops a pointer crossing the page from opening every card it passes — and what lets the reader move onto the card without it shutting on the way.",
  draw: () => (
    <Matrix direction="row" gap="8" knob="size" of={SIZES}>
      {(size) => (
        <HoverCardRoot openDelay={200} size={size}>
          <HoverCardTrigger>Bridge Ledger</HoverCardTrigger>
          <HoverCardPositioner>
            <HoverCardContent>
              <HoverCardArrow>
                <HoverCardArrowTip />
              </HoverCardArrow>
              <Row gap="3">
                <Box height="8" pad="0" round="full" surface="muted" width="8">
                  {null}
                </Box>
                <Column gap="0">
                  <Text strong>Bridge Ledger</Text>
                  <Text muted>Settling since 2019. Four accounts, one of them held.</Text>
                </Column>
              </Row>
            </HoverCardContent>
          </HoverCardPositioner>
        </HoverCardRoot>
      )}
    </Matrix>
  ),
  title: "Sizes",
};

export default specimen({
  about:
    "A card of detail that opens when the pointer rests on something. Never the only place something is said — it cannot be reached by touch, and nothing in it should be pressable.",
  group: "Overlays",
  id: "overlays/hover-card",
  scenes: [sizes],
  title: "Hover card",
});
