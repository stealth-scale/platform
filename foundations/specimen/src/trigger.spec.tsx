import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vite-plus/test";

import { declared } from "#declared.fixtures.ts";
import { drawn } from "#drawn.fixtures.tsx";
import { Trigger } from "#trigger.tsx";

describe("Trigger", () => {
  it("is a button that submits nothing, since a scene has no form to submit", () => {
    drawn(<Trigger>Open</Trigger>);

    expect(screen.getByRole("button", { name: "Open" }).getAttribute("type")).toBe("button");
  });

  it("presses", async () => {
    const pressed = vi.fn<() => void>();

    drawn(<Trigger onClick={pressed}>Open</Trigger>);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(pressed).toHaveBeenCalledTimes(1);
  });

  it("carries whatever it is handed, so a component that clones it still works", () => {
    // Ark's `asChild` puts the handler, the ARIA state and the ref on whatever child it was given.
    // A trigger that dropped them would be a button that opens nothing.
    drawn(
      <Trigger aria-expanded="true" data-state="open">
        Open
      </Trigger>,
    );

    const pressable = screen.getByRole("button", { name: "Open" });

    expect(pressable.getAttribute("aria-expanded")).toBe("true");
    expect(pressable.dataset["state"]).toBe("open");
  });

  it("names a trigger that carries a mark rather than words", () => {
    drawn(<Trigger label="Dismiss">×</Trigger>);

    expect(screen.getByRole("button", { name: "Dismiss" })).toBeTruthy();
  });

  it("squares itself once it is carrying a mark, since a mark needs both axes alike", () => {
    const marked = drawn(<Trigger label="Dismiss">×</Trigger>);
    const worded = drawn(<Trigger>Open</Trigger>);

    expect(declared(marked.container)).not.toBe(declared(worded.container));
  });

  it("drops its rule when it is the quieter of two", () => {
    const quiet = drawn(<Trigger quiet>Open</Trigger>);
    const loud = drawn(<Trigger>Open</Trigger>);

    expect(declared(quiet.container)).not.toBe(declared(loud.container));
  });
});
