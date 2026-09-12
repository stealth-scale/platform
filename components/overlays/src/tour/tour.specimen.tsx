/**
 * Shows the tour walking over real targets on the page, as a dialog and as tooltips.
 */

import { type ReactElement, type RefObject, useRef } from "react";

import {
  Box,
  Column,
  Row,
  type Scene,
  specimen,
  Text,
  Trigger,
} from "@stealthscale/foundation-specimen";

import {
  TourActions,
  TourActionTrigger,
  TourArrow,
  TourArrowTip,
  TourBackdrop,
  TourCloseTrigger,
  TourContent,
  TourControl,
  TourDescription,
  TourPositioner,
  TourProgressText,
  TourRoot,
  TourSpotlight,
  TourTitle,
  useTour,
  type UseTourProps,
  type UseTourReturn,
} from "#tour/tour.ts";

/**
 * Describes the props of {@link Panel}.
 */
interface PanelProps {
  /**
   * What it says under the name.
   */
  body: string;

  /**
   * Where the tour finds it.
   */
  ref: RefObject<HTMLDivElement | null>;

  /**
   * What the panel is called.
   */
  title: string;
}

/**
 * Draws one panel for the tour to point at.
 *
 * @param props - The panel. `PanelProps` documents every member.
 * @returns One panel, measurable by the tour.
 */
function Panel({ body, ref, title }: PanelProps): ReactElement {
  return (
    <Box framed grows pad="5" ref={ref} round="l3" surface="panel">
      <Text strong>{title}</Text>
      <Text muted>{body}</Text>
    </Box>
  );
}

/**
 * Lists the three steps: an opening dialog, then one tooltip against each panel.
 *
 * @param inbox - Finds where the second step points, when the tour asks.
 * @param archive - Finds where the third step points, when the tour asks.
 * @returns The steps, in the order they are walked.
 */
function stepsFor(
  inbox: () => HTMLDivElement | null,
  archive: () => HTMLDivElement | null,
): NonNullable<UseTourProps["steps"]> {
  return [
    {
      actions: [{ action: "next", label: "Show me" }],
      description: "Three steps, over the two panels below.",
      id: "welcome",
      title: "A quick tour",
      type: "dialog",
    },
    {
      actions: [{ action: "next", label: "Next" }],
      arrow: true,
      description: "Every offer arrives here first.",
      id: "inbox",
      target: inbox,
      title: "The inbox",
      type: "tooltip",
    },
    {
      actions: [{ action: "dismiss", label: "Done" }],
      arrow: true,
      description: "And this is where a settled one ends up.",
      id: "archive",
      target: archive,
      title: "The archive",
      type: "tooltip",
    },
  ];
}

/**
 * Draws the card the tour carries from step to step, over the backdrop and the spotlight.
 *
 * Each target is measured and the spotlight and the card placed against it, so a step landing in
 * the wrong place is a sign the positioner's own styling is wrong rather than the step's.
 *
 * @param props - Which tour the card is drawn for.
 * @returns The backdrop, the spotlight and the card.
 */
function Card(props: { tour: UseTourReturn }): ReactElement {
  return (
    <TourRoot tour={props.tour}>
      <TourBackdrop />
      <TourSpotlight />
      <TourPositioner>
        <TourContent colorPalette="primary">
          <TourArrow>
            <TourArrowTip />
          </TourArrow>
          <TourTitle />
          <TourDescription />
          <TourProgressText />
          <TourCloseTrigger>✕</TourCloseTrigger>
          <TourControl>
            <TourActions>
              {(actions) =>
                actions.map((action) => (
                  <TourActionTrigger action={action} key={action.label}>
                    {action.label}
                  </TourActionTrigger>
                ))
              }
            </TourActions>
          </TourControl>
        </TourContent>
      </TourPositioner>
    </TourRoot>
  );
}

/**
 * Draws the two panels, the button that starts the tour, and the tour itself.
 *
 * @returns The tour and the things it points at.
 */
function Walkthrough(): ReactElement {
  const inbox = useRef<HTMLDivElement>(null);
  const archive = useRef<HTMLDivElement>(null);
  const tour = useTour({
    steps: stepsFor(
      () => inbox.current,
      () => archive.current,
    ),
  });

  return (
    <Column gap="6">
      <Trigger
        onClick={() => {
          tour.start();
        }}
      >
        Start the tour
      </Trigger>

      <Row align="stretch" gap="4" nowrap>
        <Panel body="Four offers waiting" ref={inbox} title="Inbox" />
        <Panel body="Two hundred settled" ref={archive} title="Archive" />
      </Row>

      <Card tour={tour} />
    </Column>
  );
}

export const walking: Scene = {
  about:
    "Start it and walk through. The first step is a dialog, because it points at nothing; the two after it are tooltips against panels that are really on the page. The spotlight is cut out of the backdrop over whatever the step names, so a target that has moved shows up as a hole in the wrong place.",
  draw: Walkthrough,
  title: "Over real targets",
};

export default specimen({
  about:
    "Walks a reader through a page a step at a time, ringing whatever each step names. A step with no target is a dialog; one with a target is a tooltip against it.",
  group: "Overlays",
  id: "overlays/tour",
  scenes: [walking],
  title: "Tour",
});
