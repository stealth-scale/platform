import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vite-plus/test";

import {
  TimerActionTrigger,
  TimerArea,
  TimerControl,
  TimerItem,
  TimerRoot,
  type TimerRootProps,
  TimerSeparator,
} from "#timer/timer.ts";

/**
 * The styling system these tests draw under, which is Chakra with nothing retuned.
 */
const system = createSystem(defaultConfig);

/**
 * Renders a minute-long countdown with a start and a pause button, and answers the element it was
 * rendered into, so a test may draw two timers and tell them apart.
 */
function timer(props: Omit<TimerRootProps, "children"> = {}): HTMLElement {
  const { container } = render(
    <ChakraProvider value={system}>
      <TimerRoot countdown startMs={60_000} {...props}>
        <TimerArea>
          <TimerItem type="minutes" />
          <TimerSeparator>:</TimerSeparator>
          <TimerItem type="seconds" />
        </TimerArea>
        <TimerControl>
          <TimerActionTrigger action="start">Start</TimerActionTrigger>
          <TimerActionTrigger action="pause">Pause</TimerActionTrigger>
        </TimerControl>
      </TimerRoot>
    </ChakraProvider>,
  );

  return container;
}

describe("TimerRoot", () => {
  it("carries the recipe class, which is what proves the recipe resolved", () => {
    expect(timer().querySelector<HTMLElement>("[data-part=root]")?.className).toContain(
      "scale-timer",
    );
  });

  it("takes a size that changes what its items are styled with", () => {
    const medium = timer().querySelector<HTMLElement>("[data-part=item]")?.className;
    const large = timer({ size: "lg" }).querySelector<HTMLElement>("[data-part=item]")?.className;

    expect(medium).toBeDefined();
    expect(large).not.toBe(medium);
  });

  it("takes a variant that puts each item in a tile", () => {
    const plain = timer().querySelector<HTMLElement>("[data-part=item]")?.className;
    const tiled = timer({ variant: "tiles" }).querySelector<HTMLElement>(
      "[data-part=item]",
    )?.className;

    expect(tiled).not.toBe(plain);
  });
});

describe("TimerArea", () => {
  it("reads out as a live timer, so the count is announced", () => {
    expect(within(timer()).getByRole("timer")).not.toBeNull();
  });
});

describe("TimerItem", () => {
  it("shows the part of the count it was asked for", () => {
    const items = timer().querySelectorAll<HTMLElement>("[data-part=item]");

    expect([...items].map((one) => one.dataset["type"])).toEqual(["minutes", "seconds"]);
    expect([...items].map((one) => one.textContent)).toEqual(["01", "00"]);
  });
});

describe("TimerActionTrigger", () => {
  it("offers only the action that applies, and swaps once the timer runs", async () => {
    const drawn = timer();
    const start = within(drawn).getByText("Start");
    const pause = within(drawn).getByText("Pause");

    expect(start.hidden).toBe(false);
    expect(pause.hidden).toBe(true);

    await userEvent.click(start);

    expect(start.hidden).toBe(true);
    expect(pause.hidden).toBe(false);
  });
});
