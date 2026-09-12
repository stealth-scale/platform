/**
 * Shows what a portal is for: drawing a child somewhere its parent cannot clip it.
 */

import { type ReactElement, useRef } from "react";

import { Box, Column, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Portal } from "#portal/portal.ts";

/**
 * Draws the thing being moved: a strip tall enough to be clipped by the box that holds it.
 *
 * @returns One strip, wherever it has been drawn.
 */
function Strip(): ReactElement {
  return (
    <Box pad="3" round="l2" surface="muted">
      <Text strong>Drawn here.</Text>
    </Box>
  );
}

/**
 * Draws a box short enough to cut off whatever is put in it.
 *
 * @param props - Whichever children the portal carries.
 * @returns One clipping box.
 */
function Clipping(props: { children: ReactElement }): ReactElement {
  return (
    <Box anchor framed height="4.5rem" round="l3">
      <Text muted>This box clips what it holds.</Text>
      {props.children}
    </Box>
  );
}

/**
 * Draws a strip portalled out of a clipping box and into a container under it.
 *
 * @returns The clipping box, and the container the strip lands in.
 */
function Escaped(): ReactElement {
  const container = useRef<HTMLDivElement>(null);

  return (
    <Column gap="6" width="lg">
      <Clipping>
        <Portal container={container}>
          <Strip />
        </Portal>
      </Clipping>

      <Box framed round="l3">
        <Text muted size="xs">
          The container it was sent to.
        </Text>
        <Box pad="0" ref={container}>
          {null}
        </Box>
      </Box>
    </Column>
  );
}

export const clipped: Scene = {
  about:
    "What happens without one. The strip is drawn where it was written, the box around it is shorter than the strip is tall, and the bottom of it is simply cut off.",
  draw: () => (
    <Column width="lg">
      <Clipping>
        <Strip />
      </Clipping>
    </Column>
  ),
  title: "Drawn in place",
};

export const container: Scene = {
  about:
    "The same strip, written in the same place, portalled into the box below. It is still where it was in the tree — the state around it, the theme, the handlers all reach it — and it is no longer inside anything that clips.",
  draw: Escaped,
  title: "Into a container",
};

export const body: Scene = {
  about:
    "With nowhere named it goes to the document body, which is where an overlay ends up by default. Nothing on this page can clip, scroll or stack it once it is there — which is also why an overlay drawn this way has to be positioned rather than laid out.",
  draw: () => (
    <Column width="lg">
      <Clipping>
        <Portal>
          <Strip />
        </Portal>
      </Clipping>
      <Text muted size="xs">
        The strip is at the foot of the document, drawn over everything.
      </Text>
    </Column>
  ),
  title: "To the body",
};

export default specimen({
  about:
    "Draws a child somewhere else in the document while leaving it where it is in the tree. What an overlay needs to escape a parent that clips, scrolls or stacks it.",
  group: "Overlays",
  id: "overlays/portal",
  scenes: [clipped, container, body],
  title: "Portal",
});
