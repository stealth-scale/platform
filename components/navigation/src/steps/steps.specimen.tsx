/**
 * Shows the stepper in both variants and both orientations, part way through.
 */

import { type ReactElement } from "react";

import {
  Column,
  Matrix,
  Row,
  type Scene,
  specimen,
  Text,
  Trigger,
} from "@stealthscale/foundation-specimen";

import {
  StepsCompletedContent,
  StepsContent,
  StepsIndicator,
  StepsItem,
  StepsList,
  StepsNextTrigger,
  StepsPrevTrigger,
  StepsRoot,
  type StepsRootProps,
  StepsSeparator,
  StepsTitle,
  StepsTrigger,
} from "#steps/steps.ts";

/**
 * What the three steps are called, and what each says once it is the current one.
 */
const STEPS = [
  { body: "Which account the payout leaves from.", title: "Account" },
  { body: "How much, and against which lines.", title: "Amount" },
  { body: "Sign, and the payout is queued.", title: "Confirm" },
];

/**
 * How the stepper is drawn.
 */
const VARIANTS = ["solid", "subtle"] as const;

/**
 * Which way it runs.
 */
const ORIENTATIONS = ["horizontal", "vertical"] as const;

/**
 * Draws one stepper, stopped on the second step so a step is complete, current and pending at once.
 *
 * Vertically the rail is drawn against the item's own height, so an item with nothing under it
 * leaves nothing for the rail to run through — hence the minimum height on that orientation.
 *
 * @param props - Whichever of them the scene is turning. `StepsRootProps` documents every member.
 * @returns The stepper, with the controls that move it.
 */
function Flow(props: StepsRootProps): ReactElement {
  return (
    <StepsRoot colorPalette="primary" count={STEPS.length} defaultStep={1} {...props}>
      <StepsList>
        {STEPS.map((step, index) => (
          <StepsItem
            index={index}
            key={step.title}
            minHeight={props.orientation === "vertical" ? "24" : undefined}
          >
            <StepsTrigger>
              <StepsIndicator />
              <StepsTitle>{step.title}</StepsTitle>
            </StepsTrigger>
            <StepsSeparator />
          </StepsItem>
        ))}
      </StepsList>

      {STEPS.map((step, index) => (
        <StepsContent index={index} key={step.title}>
          <Text muted>{step.body}</Text>
        </StepsContent>
      ))}
      <StepsCompletedContent>
        <Text muted>Queued.</Text>
      </StepsCompletedContent>

      <Row attached>
        <StepsPrevTrigger asChild>
          <Trigger>Back</Trigger>
        </StepsPrevTrigger>
        <StepsNextTrigger asChild>
          <Trigger>Next</Trigger>
        </StepsNextTrigger>
      </Row>
    </StepsRoot>
  );
}

export const variants: Scene = {
  about:
    "Stopped on the second step, so one is complete, one is current and one is still to come — the three states a stepper has, all at once. Solid fills the indicator of a finished step; subtle tints it.",
  draw: () => (
    <Matrix gap="12" knob="variant" of={VARIANTS}>
      {(variant) => (
        <Column width="34rem">
          <Flow variant={variant} />
        </Column>
      )}
    </Matrix>
  ),
  title: "Variants",
};

export const orientations: Scene = {
  about:
    "The separator is what changes between them: across, it runs between indicators; down, it drops beside the content — and the two are drawn from the same part. It takes whatever room the row has left over, so a stepper squeezed narrow shows none of it.",
  draw: () => (
    <Matrix gap="10" knob="orientation" of={ORIENTATIONS}>
      {(orientation) => (
        <Column width="34rem">
          <Flow orientation={orientation} />
        </Column>
      )}
    </Matrix>
  ),
  title: "Orientations",
};

export default specimen({
  about:
    "A sequence with a place in it: what is done, what is being done, and what is left. The panel under it belongs to whichever step is current.",
  group: "Navigation",
  id: "navigation/steps",
  scenes: [variants, orientations],
  title: "Steps",
});
