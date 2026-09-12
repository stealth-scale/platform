import { type ReactElement } from "react";

import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { fireEvent, render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vite-plus/test";

import {
  TourActions,
  TourActionTrigger,
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
} from "#tour/tour.ts";

/**
 * The styling system these tests draw under, which is Chakra with nothing retuned.
 */
const system = createSystem(defaultConfig);

/**
 * How an element answered for its rects before this specification answered for it.
 *
 * Held as the descriptor rather than the function, so putting it back restores what happy-dom
 * declared rather than a copy of it.
 */
const reported = Object.getOwnPropertyDescriptor(Element.prototype, "getClientRects");

/**
 * Reports a rect for an element a reader could see, which happy-dom reports for none.
 *
 * Happy-dom lays nothing out, so `getClientRects` answers an empty list for every element however
 * it is drawn. The focus trap a tour opens with reads that list to decide what can be focused, so
 * with none it finds nothing focusable and throws before a step reaches the page. jsdom answers the
 * same way, its own documentation listing layout among what it does not implement, so the choice is
 * between saying something here and running these in a browser.
 *
 * Answered from what the document does know rather than as a blanket yes: an element attached and
 * not `display: none` reports one rect, and everything else reports none. The size is a fiction,
 * nothing here asserting on a measurement, but a hidden element stays hidden — which is what keeps
 * a specification about what a reader can see from passing on a lie.
 *
 * @returns One rect where the element is visible, and none where it is not.
 */
function shown(this: Element): DOMRectList {
  const visible = this.isConnected && globalThis.getComputedStyle(this).display !== "none";
  const held = visible ? [new DOMRect(0, 0, 1, 1)] : [];

  return Object.assign(held, {
    item: (at: number) => held[at] ?? null,
  });
}

/**
 * Answers for the two browser things happy-dom leaves out, for as long as this file runs.
 *
 * `VisualViewport` is a standard browser API and happy-dom has none of it. The tour machine reads
 * it while tracking the boundary it draws against, and reads it as a bare global rather than off
 * the window its own `scope` hands it — so optional chaining does not save it, because `?.` guards
 * a value that is nullish rather than a name that was never declared. The machine throws as soon as
 * a tour mounts. Declared holding nothing, which sends the machine down the `win.innerWidth` branch
 * it already falls back to.
 *
 * Both are put back afterwards rather than left standing, so no other specification in this worker
 * is quietly told the viewport exists or that elements have a size.
 */
beforeAll(() => {
  Object.defineProperty(globalThis, "visualViewport", { configurable: true, value: undefined });
  Object.defineProperty(Element.prototype, "getClientRects", {
    configurable: true,
    value: shown,
    writable: true,
  });
});

afterAll(() => {
  Reflect.deleteProperty(globalThis, "visualViewport");
  if (reported) Object.defineProperty(Element.prototype, "getClientRects", reported);
});

/**
 * Closes a tour a test left open, before the render that holds it is thrown away.
 *
 * A tour traps focus while a step is showing, and the trap listens on the document rather than on
 * the step. Unmounting the tree takes the step off the page and leaves that listener standing, so
 * the next test to move focus wakes a trap whose elements are gone and it throws looking for one to
 * focus. Closing first is what runs the trap's own deactivation, which is what removes the
 * listener.
 */
afterEach(() => {
  const close = document.querySelector<HTMLElement>("[data-part=close-trigger]");

  if (close) fireEvent.click(close);
});

/**
 * Two steps, which is the least that has a next one to move to and an end to reach.
 */
const STEPS: NonNullable<UseTourProps["steps"]> = [
  {
    actions: [{ action: "next", label: "Next" }],
    description: "Every offer starts here.",
    id: "inbox",
    title: "The inbox",
    type: "dialog",
  },
  {
    actions: [{ action: "dismiss", label: "Done" }],
    description: "And this is where it ends up.",
    id: "archive",
    title: "The archive",
    type: "dialog",
  },
];

/**
 * Draws a tour that starts as soon as it is asked to, so a test can press its buttons.
 */
function Walkthrough(): ReactElement {
  const tour = useTour({ steps: STEPS });

  return (
    <TourRoot tour={tour}>
      <TourBackdrop />
      <TourSpotlight />
      <TourPositioner>
        <TourContent>
          <TourTitle />
          <TourDescription />
          <TourProgressText />
          <TourCloseTrigger>Close</TourCloseTrigger>
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
      <button
        onClick={() => {
          tour.start();
        }}
        type="button"
      >
        Begin
      </button>
    </TourRoot>
  );
}

/**
 * Renders the walkthrough and answers the element it was rendered into.
 */
function walkthrough(): HTMLElement {
  const { container } = render(
    <ChakraProvider value={system}>
      <Walkthrough />
    </ChakraProvider>,
  );

  return container;
}

describe("TourRoot", () => {
  it("mounts nothing until the tour is started", async () => {
    const drawn = walkthrough();

    expect(drawn.querySelector("[data-part=content]")).toBeNull();

    await userEvent.click(within(drawn).getByRole("button", { name: "Begin" }));

    expect(drawn.querySelector<HTMLElement>("[data-part=content]")?.dataset["state"]).toBe("open");
  });

  it("takes the backdrop off the page when the tour ends", async () => {
    const drawn = walkthrough();

    await userEvent.click(within(drawn).getByRole("button", { name: "Begin" }));
    expect(drawn.querySelector("[data-part=backdrop]")).not.toBeNull();

    await userEvent.click(within(drawn).getByRole("button", { name: "close tour" }));

    expect(drawn.querySelector("[data-part=backdrop]")).toBeNull();
  });

  it("renders no element of its own, which is why the anatomy names no root", () => {
    expect(walkthrough().querySelector("[data-part=root]")).toBeNull();
  });
});

describe("TourContent", () => {
  it("carries the recipe class once a step is showing", async () => {
    const drawn = walkthrough();

    await userEvent.click(within(drawn).getByRole("button", { name: "Begin" }));

    expect(drawn.querySelector<HTMLElement>("[data-part=content]")?.className).toContain(
      "scale-tour",
    );
  });

  it("shows the first step, and names which step it is", async () => {
    const drawn = walkthrough();

    await userEvent.click(within(drawn).getByRole("button", { name: "Begin" }));

    expect(within(drawn).getByText("The inbox")).not.toBeNull();
    expect(drawn.querySelector<HTMLElement>("[data-part=content]")?.dataset["step"]).toBe("inbox");
  });

  it("reads out as a modal alert dialog labelled by its title", async () => {
    const drawn = walkthrough();

    await userEvent.click(within(drawn).getByRole("button", { name: "Begin" }));

    expect(within(drawn).getByRole("alertdialog", { name: "The inbox" })).not.toBeNull();
  });
});

describe("TourActionTrigger", () => {
  it("steps on to the next one when the step asks for it", async () => {
    const drawn = walkthrough();

    await userEvent.click(within(drawn).getByRole("button", { name: "Begin" }));
    await userEvent.click(within(drawn).getByRole("button", { name: "next step" }));

    expect(within(drawn).getByText("The archive")).not.toBeNull();
    expect(within(drawn).queryByText("The inbox")).toBeNull();
  });

  it("carries the action as a data attribute, which is what draws the way forward filled", async () => {
    const drawn = walkthrough();

    await userEvent.click(within(drawn).getByRole("button", { name: "Begin" }));

    expect(within(drawn).getByRole("button", { name: "next step" }).dataset["type"]).toBe("next");
  });
});

describe("TourCloseTrigger", () => {
  it("abandons the tour, taking the step off the page with it", async () => {
    const drawn = walkthrough();

    await userEvent.click(within(drawn).getByRole("button", { name: "Begin" }));
    await userEvent.click(within(drawn).getByRole("button", { name: "close tour" }));

    expect(drawn.querySelector("[data-part=content]")).toBeNull();
  });
});
