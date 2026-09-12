/**
 * Shows the skeleton in each variant, and the shapes it comes in.
 */

import { Column, Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { Skeleton, SkeletonCircle, SkeletonText } from "#skeleton/skeleton.ts";

/**
 * Every way a skeleton is drawn while it waits.
 */
const VARIANTS = ["pulse", "shine", "none"] as const;

export const variants: Scene = {
  about:
    "The placeholder for a record: an avatar, a heading, and lines of prose. The three together are the point — a skeleton is judged by whether the shape it stands in for is recognisable before the content lands.",
  draw: () => (
    <Matrix knob="variant" of={VARIANTS}>
      {(variant) => (
        <Row align="start" gap="4" width="sm">
          <SkeletonCircle size="10" variant={variant} />
          <Column gap="3" grows>
            <Skeleton height="4" variant={variant} width="40%" />
            <SkeletonText noOfLines={3} variant={variant} />
          </Column>
        </Row>
      )}
    </Matrix>
  ),
  title: "Variants",
};

export default specimen({
  about:
    "Stands in for content that has not arrived, in the shape the content will take. Reach for it where the layout is known in advance; reach for a spinner where it is not.",
  group: "Feedback",
  id: "feedback/skeleton",
  scenes: [variants],
  title: "Skeleton",
});
