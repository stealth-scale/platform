/**
 * Shows the empty state at every size.
 */

import { InboxIcon } from "lucide-react";

import { Matrix, type Scene, specimen, Trigger } from "@stealthscale/foundation-specimen";

import {
  EmptyStateContent,
  EmptyStateDescription,
  EmptyStateIndicator,
  EmptyStateRoot,
  EmptyStateTitle,
} from "#empty-state/empty-state.ts";

/**
 * Every size an empty state takes.
 */
const SIZES = ["sm", "md", "lg"] as const;

export const sizes: Scene = {
  about:
    "The same empty inbox at each size, with the one action that would fill it. An empty state without a way out is a dead end, so the button is part of the scene rather than an extra.",
  draw: () => (
    <Matrix knob="size" of={SIZES}>
      {(size) => (
        <EmptyStateRoot size={size}>
          <EmptyStateContent>
            <EmptyStateIndicator>
              <InboxIcon />
            </EmptyStateIndicator>
            <EmptyStateTitle>No offers yet</EmptyStateTitle>
            <EmptyStateDescription>
              Anything raised against this account will arrive here.
            </EmptyStateDescription>
            <Trigger>Raise the first</Trigger>
          </EmptyStateContent>
        </EmptyStateRoot>
      )}
    </Matrix>
  ),
  title: "Sizes",
};

export default specimen({
  about:
    "What a list says when it holds nothing: a mark, what would be here, and how to put something here. The last of those is what separates an empty state from an apology.",
  group: "Feedback",
  id: "feedback/empty-state",
  scenes: [sizes],
  title: "Empty state",
});
