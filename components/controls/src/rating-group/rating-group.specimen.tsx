/**
 * Shows the star rating at every size, allowing halves, read only, and with more than five.
 */

import { type ReactElement } from "react";

import { HeartIcon } from "lucide-react";

import { Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  RatingGroupContext,
  RatingGroupControl,
  RatingGroupHiddenInput,
  RatingGroupItem,
  RatingGroupItemIndicator,
  RatingGroupItems,
  RatingGroupLabel,
  RatingGroupRoot,
  type RatingGroupRootProps,
} from "#rating-group/rating-group.ts";

/**
 * How large the stars are.
 */
const SIZES = ["xs", "sm", "md", "lg"] as const;

/**
 * Draws one row of stars.
 *
 * @param props - Whichever of them the scene is turning. `RatingGroupRootProps` documents every
 *   member.
 * @returns One rating.
 */
function Stars(props: Omit<RatingGroupRootProps, "children">): ReactElement {
  return (
    <RatingGroupRoot colorPalette="primary" defaultValue={3} {...props}>
      <RatingGroupHiddenInput />
      <RatingGroupControl>
        <RatingGroupItems />
      </RatingGroupControl>
    </RatingGroupRoot>
  );
}

export const sizes: Scene = {
  about:
    "The stars are the whole control, so the size is the only thing that decides whether it can be hit. At `xs` a star is under the twenty-four pixels 2.5.8 asks for.",
  draw: () => (
    <Matrix gap="6" knob="size" of={SIZES}>
      {(size) => <Stars size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const scales: Scene = {
  about:
    "A half is drawn by clipping one star rather than by having a half-star glyph, so the fill has to land exactly on the middle of the shape. Read-only is what a summary uses, where the rating is somebody else’s.",
  draw: () => (
    <Row gap="8">
      <Stars allowHalf defaultValue={3.5} />
      <Stars defaultValue={4} readOnly />
      <Stars count={10} defaultValue={7} />
    </Row>
  ),
  title: "Halves, read only and longer scales",
};

export const marks: Scene = {
  about:
    "The glyph is replaceable, which is what turns a rating into a reaction. A label above it is what tells a screen reader what is being rated.",
  draw: () => (
    <RatingGroupRoot colorPalette="red" defaultValue={2}>
      <RatingGroupLabel>How it went</RatingGroupLabel>
      <RatingGroupHiddenInput />
      <RatingGroupControl>
        <RatingGroupContext>
          {(rating) =>
            rating.items.map((index) => (
              <RatingGroupItem index={index} key={index}>
                <RatingGroupItemIndicator icon={<HeartIcon />} />
              </RatingGroupItem>
            ))
          }
        </RatingGroupContext>
      </RatingGroupControl>
    </RatingGroupRoot>
  ),
  title: "Another glyph",
};

export default specimen({
  about:
    "A rating out of a fixed count, in stars or in whatever glyph is handed to it. Halves are clipped rather than drawn, so any shape works.",
  group: "Controls",
  id: "controls/rating-group",
  scenes: [sizes, scales, marks],
  title: "Rating group",
});
