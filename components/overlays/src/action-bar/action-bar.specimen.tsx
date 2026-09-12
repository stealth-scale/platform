/**
 * Shows the bar that appears once rows are selected, in each place it can sit.
 */

import { type ReactElement, useState } from "react";

import { Column, type Scene, specimen, Text, Trigger } from "@stealthscale/foundation-specimen";

import {
  ActionBarCloseTrigger,
  ActionBarContent,
  ActionBarPositioner,
  ActionBarRoot,
  ActionBarSelectionTrigger,
  ActionBarSeparator,
} from "#action-bar/action-bar.ts";

/**
 * Where along the bottom edge the bar sits.
 */
type Placement = "bottom-end" | "bottom-start" | "bottom";

/**
 * Describes the props of {@link Selection}.
 */
interface SelectionProps {
  /**
   * Where along the bottom edge this one raises its bar.
   */
  placement: Placement;
}

/**
 * Draws one bar and the button that raises it.
 *
 * One at a time rather than several: the bar is fixed to the viewport, so two open at once would
 * sit on top of each other. Closing it puts the selection back to none.
 *
 * @param props - Where it sits. `SelectionProps` documents every member.
 * @returns The button that raises the bar, and the bar itself.
 */
function Selection(props: SelectionProps): ReactElement {
  const [selected, setSelected] = useState(false);

  return (
    <Column gap="3">
      <Trigger
        onClick={() => {
          setSelected(true);
        }}
      >
        Select four rows
      </Trigger>

      <Text muted size="xs">
        {selected ? `Raised at ${props.placement}.` : "Nothing selected."}
      </Text>

      <ActionBarRoot
        onOpenChange={(details) => {
          setSelected(details.open);
        }}
        open={selected}
        placement={props.placement}
      >
        <ActionBarPositioner>
          <ActionBarContent colorPalette="primary">
            <ActionBarSelectionTrigger>4 selected</ActionBarSelectionTrigger>
            <ActionBarSeparator />
            <Trigger quiet>Release</Trigger>
            <Trigger quiet>Export</Trigger>
            <ActionBarCloseTrigger asChild>
              <Trigger label="Close" quiet>
                ×
              </Trigger>
            </ActionBarCloseTrigger>
          </ActionBarContent>
        </ActionBarPositioner>
      </ActionBarRoot>
    </Column>
  );
}

export const middle: Scene = {
  about:
    "Press it. The bar rises from the bottom of the window rather than from the page, so it stays put while the rows behind it scroll — which is the whole reason to reach for one over a toolbar in the layout.",
  draw: () => <Selection placement="bottom" />,
  title: "Along the bottom",
};

export const start: Scene = {
  about:
    "Pushed to the side the text starts on, which keeps it clear of anything fixed to the opposite corner.",
  draw: () => <Selection placement="bottom-start" />,
  title: "At the start",
};

export const end: Scene = {
  about: "And to the other side, which turns with the writing direction rather than staying right.",
  draw: () => <Selection placement="bottom-end" />,
  title: "At the end",
};

export default specimen({
  about:
    "A bar that rises once rows are selected, carrying what can be done to them. Fixed to the window, so it stays put while the rows behind it scroll.",
  group: "Overlays",
  id: "overlays/action-bar",
  scenes: [middle, start, end],
  title: "Action bar",
});
