/**
 * Shows the tooltip against every side of its trigger.
 */

import { InfoIcon } from "lucide-react";

import { Matrix, type Scene, specimen, Trigger } from "@stealthscale/foundation-specimen";

import {
  TooltipArrow,
  TooltipArrowTip,
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger,
} from "#tooltip/tooltip.ts";

/**
 * Which side of the trigger it opens on.
 */
const SIDES = ["top", "right", "bottom", "left"] as const;

export const sides: Scene = {
  about:
    "Hover or focus one. A tooltip is one line and no more, so the only thing to look at is where it lands and whether the arrow still points at what raised it. It opens on focus as well as hover, which is what stops it being pointer-only.",
  draw: () => (
    <Matrix direction="row" gap="12" knob="placement" of={SIDES}>
      {(side) => (
        <TooltipRoot openDelay={100} positioning={{ placement: side }}>
          <TooltipTrigger asChild>
            <Trigger label="Why this is held">
              <InfoIcon size={16} />
            </Trigger>
          </TooltipTrigger>
          <TooltipPositioner>
            <TooltipContent>
              <TooltipArrow>
                <TooltipArrowTip />
              </TooltipArrow>
              Held until the account is verified
            </TooltipContent>
          </TooltipPositioner>
        </TooltipRoot>
      )}
    </Matrix>
  ),
  title: "Sides",
};

export default specimen({
  about:
    "One line about the thing under the pointer. Never the only place something is said, since a tooltip cannot be reached by touch.",
  group: "Overlays",
  id: "overlays/tooltip",
  scenes: [sides],
  title: "Tooltip",
});
