/**
 * Shows a frame held to a shape whatever is put in it.
 */

import { Matrix, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { AspectRatio } from "#aspect-ratio/aspect-ratio.ts";
import { Center } from "#center/center.ts";

/**
 * The ratios a frame is held to.
 */
const RATIOS = [1, 4 / 3, 16 / 9] as const;

export const ratios: Scene = {
  about:
    "The height follows the width, so a grid of these keeps its rhythm however narrow the page gets. Reach for it wherever a picture or a video is loaded late — without it the row reflows the moment the media arrives.",
  draw: () => (
    <Matrix direction="row" gap="6" knob="ratio" label={(ratio) => ratio.toFixed(2)} of={RATIOS}>
      {(ratio) => (
        <AspectRatio ratio={ratio} w="8rem">
          <Center bg="bg.muted" borderRadius="l2">
            <Text muted size="xs">
              {ratio.toFixed(2)}
            </Text>
          </Center>
        </AspectRatio>
      )}
    </Matrix>
  ),
  title: "Ratios",
};

export default specimen({
  about:
    "Holds a frame to a shape, working its height out from its width. What goes inside it fills it.",
  group: "Layout",
  id: "layout/aspect-ratio",
  scenes: [ratios],
  title: "Aspect ratio",
});
