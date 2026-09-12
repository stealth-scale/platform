/**
 * Shows the alert in every status, and in every variant.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  AlertContent,
  AlertDescription,
  AlertIndicator,
  AlertRoot,
  type AlertRootProps,
  AlertTitle,
} from "#alert/alert.ts";

/**
 * Every status an alert reports.
 */
const STATUSES = ["info", "warning", "success", "error", "neutral"] as const;

/**
 * Every way an alert is filled.
 */
const VARIANTS = ["subtle", "surface", "outline", "solid"] as const;

/**
 * Draws the same alert, however the root around it is set.
 *
 * @param props - Whichever of them the scene is turning. `AlertRootProps` documents every member.
 * @returns One alert.
 */
function Held(props: AlertRootProps): ReactElement {
  return (
    <AlertRoot maxW="16rem" {...props}>
      <AlertIndicator />
      <AlertContent>
        <AlertTitle>Payout held</AlertTitle>
        <AlertDescription>The account could not be verified.</AlertDescription>
      </AlertContent>
    </AlertRoot>
  );
}

export const statuses: Scene = {
  about:
    "Five outcomes, each with its own indicator and its own palette. Side by side is the arrangement that matters: a warning next to an error is where two hues that are too close to each other show it.",
  draw: () => (
    <Matrix direction="row" gap="4" knob="status" of={STATUSES}>
      {(status) => <Held status={status} />}
    </Matrix>
  ),
  title: "Statuses",
};

export const variants: Scene = {
  about:
    "How loudly the alert is stated. Solid is the one to check, because it is the only fill that has to carry its own label rather than borrow the page’s ink.",
  draw: () => (
    <Matrix knob="variant" of={VARIANTS}>
      {(variant) => <Held status="error" variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export default specimen({
  about:
    "Reports an outcome in place, where the reader is already looking. Five statuses, each of which has to stay itself through four fills.",
  group: "Feedback",
  id: "feedback/alert",
  scenes: [statuses, variants],
  title: "Alert",
});
