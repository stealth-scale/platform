/**
 * Shows the container at each width it holds prose to, and centred against the page.
 */

import { Matrix, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Container } from "#container/container.ts";

/**
 * Every width a container holds its contents to.
 */
const WIDTHS = ["sm", "md", "lg", "xl"] as const;

export const widths: Scene = {
  about:
    "Where a line of prose stops. The container holds the text to a readable measure and keeps the padding at the edge of the page, whatever the window is doing.",
  draw: () => (
    <Matrix knob="maxW" of={WIDTHS}>
      {(width) => (
        <Container bg="bg.subtle" borderRadius="l2" maxW={width} px="4" py="3">
          <Text muted>Everything raised before Friday has been matched against the statement.</Text>
        </Container>
      )}
    </Matrix>
  ),
  title: "Widths",
};

export const fluid: Scene = {
  about:
    "Fluid runs the whole width and keeps only the padding; otherwise the container stops at the breakpoint. Reach for fluid where the thing inside is a table or a chart rather than words.",
  draw: () => (
    <Matrix knob="fluid" label={String} of={[false, true]}>
      {(runs) => (
        <Container bg="bg.subtle" borderRadius="l2" fluid={runs} px="4" py="3">
          <Text muted>Fluid runs the whole width; otherwise it stops at the breakpoint.</Text>
        </Container>
      )}
    </Matrix>
  ),
  title: "Fluid",
};

export const centred: Scene = {
  about:
    "Centring the contents rather than the container. The container is already centred on the page; this is about what sits inside it.",
  draw: () => (
    <Container bg="bg.subtle" borderRadius="l2" centerContent maxW="sm" px="4" py="6">
      <Text muted>centerContent</Text>
    </Container>
  ),
  title: "Centred contents",
};

export default specimen({
  about:
    "Holds what is inside it to a readable measure and keeps a margin at the edge of the page. The one layout component that is about where a line stops rather than about where things sit.",
  group: "Layout",
  id: "layout/container",
  scenes: [widths, fluid, centred],
  title: "Container",
});
