import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { type BoundFunctions, type queries, render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vite-plus/test";

import {
  ToggleGroupItem,
  ToggleGroupRoot,
  type ToggleGroupRootProps,
} from "#toggle-group/toggle-group.ts";

/**
 * The styling system these tests draw under, which is Chakra with nothing retuned.
 */
const system = createSystem(defaultConfig);

/**
 * Renders a two-item group and answers queries bound to that render alone, so a test may draw two
 * groups and tell them apart.
 */
function group(props: Omit<ToggleGroupRootProps, "children"> = {}): BoundFunctions<typeof queries> {
  const { container } = render(
    <ChakraProvider value={system}>
      <ToggleGroupRoot {...props}>
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroupRoot>
    </ChakraProvider>,
  );

  return within(container);
}

describe("ToggleGroupRoot", () => {
  it("carries the recipe class, which is what proves the recipe resolved", () => {
    expect(group().getByRole("radiogroup").className).toContain("scale-toggle-group");
  });

  it("draws a radio group where one item may be pressed, and a group where several may", () => {
    expect(group().queryByRole("radiogroup")).not.toBeNull();

    const { container } = render(
      <ChakraProvider value={system}>
        <ToggleGroupRoot multiple>
          <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        </ToggleGroupRoot>
      </ChakraProvider>,
    );

    expect(within(container).queryByRole("radiogroup")).toBeNull();
    expect(within(container).queryByRole("group")).not.toBeNull();
  });

  it("takes a variant that changes what its items are styled with", () => {
    const outline = group().getAllByRole("radio").at(0)?.className;
    const ghost = group({ variant: "ghost" }).getAllByRole("radio").at(0)?.className;

    expect(outline).toBeDefined();
    expect(ghost).not.toBe(outline);
  });
});

describe("ToggleGroupItem", () => {
  it("turns on when pressed and off when pressed again", async () => {
    const bold = group().getByRole("radio", { name: "Bold" });

    expect(bold.dataset["state"]).toBe("off");

    await userEvent.click(bold);
    expect(bold.dataset["state"]).toBe("on");

    await userEvent.click(bold);
    expect(bold.dataset["state"]).toBe("off");
  });

  it("releases the other item when only one may be on", async () => {
    const drawn = group();
    const bold = drawn.getByRole("radio", { name: "Bold" });
    const italic = drawn.getByRole("radio", { name: "Italic" });

    await userEvent.click(bold);
    await userEvent.click(italic);

    expect(bold.dataset["state"]).toBe("off");
    expect(italic.dataset["state"]).toBe("on");
  });
});
