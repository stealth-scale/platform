import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vite-plus/test";

import { declared } from "#declared.fixtures.ts";
import { drawn } from "#drawn.fixtures.tsx";
import { Field } from "#field.tsx";

describe("Field", () => {
  it("is a line to type into", async () => {
    drawn(<Field placeholder="Account name" />);

    const line = screen.getByPlaceholderText<HTMLInputElement>("Account name");
    await userEvent.type(line, "Bridge");

    expect(line.value).toBe("Bridge");
  });

  it("carries whatever it is handed, so a component that clones it still works", () => {
    drawn(<Field data-state="open" readOnly value="Bridge Ledger" />);

    const line = screen.getByDisplayValue<HTMLInputElement>("Bridge Ledger");

    expect(line.dataset["state"]).toBe("open");
    expect(line.readOnly).toBe(true);
  });

  it("takes the room left beside a button when asked, and its own width otherwise", () => {
    const filling = drawn(<Field grows placeholder="Search" />);
    const sized = drawn(<Field placeholder="Search" />);

    expect(declared(filling.container)).not.toBe(declared(sized.container));
  });
});
