/**
 * Shows the marquee running in both directions, at two speeds, and with faded edges.
 */

import { type ReactElement } from "react";

import { Box, Matrix, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import {
  MarqueeContent,
  MarqueeEdge,
  MarqueeItem,
  MarqueeRoot,
  type MarqueeRootProps,
  MarqueeViewport,
} from "#marquee/marquee.ts";

/**
 * What runs past.
 */
const ACCOUNTS = ["Bridge Ledger", "Halden & Co", "Perrin Freight", "Voss Holdings", "Ilan Trust"];

/**
 * Which way it runs.
 */
const SIDES = ["start", "end", "top", "bottom"] as const;

/**
 * The two that run across rather than down.
 */
const ACROSS = new Set(["end", "start"]);

/**
 * Draws one marquee, with a fade at each end of the way it is running.
 *
 * The edges are what keep an item from appearing out of nothing at the boundary, so both are drawn
 * every time — across the ends it is running between, which is the axis rather than the side.
 *
 * @param props - Whichever of them the scene is turning. `MarqueeRootProps` documents every member.
 * @returns One running row.
 */
function Running(props: Omit<MarqueeRootProps, "children">): ReactElement {
  const upright = !ACROSS.has(props.side ?? "start");

  return (
    <MarqueeRoot maxW="lg" {...props}>
      <MarqueeViewport>
        <MarqueeContent>
          {ACCOUNTS.map((account) => (
            <MarqueeItem key={account}>
              <Box pad="1" round="l1" surface="subtle">
                <Text size="xs">{account}</Text>
              </Box>
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </MarqueeViewport>
      <MarqueeEdge side={upright ? "top" : "start"} />
      <MarqueeEdge side={upright ? "bottom" : "end"} />
    </MarqueeRoot>
  );
}

export const sides: Scene = {
  about:
    "Towards the top or the bottom it needs a height, since a row of chips is only as tall as a chip and there would be nothing to scroll through. The fade at each end is what keeps an item from appearing out of nothing at the boundary.",
  draw: () => (
    <Matrix gap="8" knob="side" of={SIDES}>
      {(side) =>
        ACROSS.has(side) ? (
          <Running maxW="lg" side={side} />
        ) : (
          <Running height="8rem" maxW="14rem" side={side} />
        )
      }
    </Matrix>
  ),
  title: "Which way it runs",
};

export const slowed: Scene = {
  about:
    "Slowed down, filled to the width, and stopped while the pointer rests on it. Pausing is not a nicety — a marquee that never stops is unreadable to anybody who cannot read at its speed, and it is the one thing that makes the pattern defensible at all.",
  draw: () => <Running autoFill pauseOnInteraction speed={20} />,
  title: "Slow, and pausing",
};

export default specimen({
  about:
    "A run of items scrolling past, in any of four directions, fading at both ends. It stops when the pointer rests on it, which is what keeps it readable.",
  group: "Content",
  id: "content/marquee",
  scenes: [sides, slowed],
  title: "Marquee",
});
