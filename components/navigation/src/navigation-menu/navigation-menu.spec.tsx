import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { fireEvent, render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vite-plus/test";

import {
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRoot,
  type NavigationMenuRootProps,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  NavigationMenuViewportPositioner,
} from "#navigation-menu/navigation-menu.ts";

/**
 * The styling system these tests draw under, which is Chakra with nothing retuned.
 */
const system = createSystem(defaultConfig);

/**
 * Renders a two-item menubar and answers the element it was rendered into, so a test may draw two
 * menubars and tell them apart.
 *
 * Opened and closed without the delays a reader gets, which a test has no use for and cannot
 * outlive. A menubar opens on hover and waits before it commits, so a press schedules the change
 * two hundred milliseconds out; a specification asserts and ends in thirty, and the timer then
 * fires against a menubar that has been taken off the page. Both are stated before the caller's
 * props, so a test asking for its own still gets them.
 */
function menubar(props: Omit<NavigationMenuRootProps, "children"> = {}): HTMLElement {
  const { container } = render(
    <ChakraProvider value={system}>
      <NavigationMenuRoot closeDelay={0} openDelay={0} {...props}>
        <NavigationMenuList>
          <NavigationMenuItem value="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/ledger">Ledger</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem value="company">
            <NavigationMenuTrigger>Company</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/about">About</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuIndicator />
        </NavigationMenuList>

        <NavigationMenuViewportPositioner>
          <NavigationMenuViewport />
        </NavigationMenuViewportPositioner>
      </NavigationMenuRoot>
    </ChakraProvider>,
  );

  return container;
}

/**
 * Closes a menu a test left open, before the render that holds it is thrown away.
 *
 * A menubar tracks which item is showing and keeps the panels lined up against the triggers it
 * measures. Unmounting while one is open leaves that machine running with a value set, and the next
 * menubar to open an item wakes it: it looks up the list it was drawn in, finds it gone, and reads
 * the direction off the first trigger of an empty list. React catches the throw, unmounts the tree
 * being tested, and the assertion fails on a menubar that is no longer there.
 *
 * Closing first settles the machine while its own elements are still on the page, which is what
 * keeps one specification's leftovers out of the next one. Fired through the renderer rather than
 * by calling `click` on the element, so React flushes what the close sets before the tree comes
 * down. A bare `click` leaves that work queued, and it is then run against a page it no longer has.
 *
 * This closes the menu and the zero delays keep the close immediate, and it takes both: with the
 * delays alone the last test still ends with one item open and its timer outstanding, and with the
 * close alone the close is itself scheduled three hundred milliseconds out. Counted rather than
 * guessed at, by holding every timer this file opens and reading back how many were still standing
 * when it finished: two before, one with either, none with both.
 */
afterEach(() => {
  const open = document.querySelector<HTMLElement>("[data-part=trigger][data-state=open]");

  if (open) fireEvent.click(open);
});

describe("NavigationMenuRoot", () => {
  it("carries the recipe class, which is what proves the recipe resolved", () => {
    expect(menubar().querySelector<HTMLElement>("[data-part=root]")?.className).toContain(
      "scale-navigation-menu",
    );
  });

  it("draws a landmark holding the items", () => {
    expect(within(menubar()).getByRole("navigation")).not.toBeNull();
  });

  it("takes a size that changes what its triggers are styled with", () => {
    const medium = menubar().querySelector<HTMLElement>("[data-part=trigger]")?.className;
    const small = menubar({ size: "sm" }).querySelector<HTMLElement>(
      "[data-part=trigger]",
    )?.className;

    expect(medium).toBeDefined();
    expect(small).not.toBe(medium);
  });
});

describe("NavigationMenuTrigger", () => {
  it("starts closed and opens its own panel when pressed", async () => {
    const drawn = menubar();
    const products = within(drawn).getByRole("button", { name: "Products" });

    expect(products.dataset["state"]).toBe("closed");

    await userEvent.click(products);

    expect(products.dataset["state"]).toBe("open");
  });

  it("closes the panel that was open when another item opens", async () => {
    const drawn = menubar();
    const products = within(drawn).getByRole("button", { name: "Products" });
    const company = within(drawn).getByRole("button", { name: "Company" });

    await userEvent.click(products);
    await userEvent.click(company);

    expect(products.dataset["state"]).toBe("closed");
    expect(company.dataset["state"]).toBe("open");
  });
});

describe("NavigationMenuViewport", () => {
  it("stays hidden until an item is open", async () => {
    const drawn = menubar();
    const viewport = drawn.querySelector<HTMLElement>("[data-part=viewport]");

    expect(viewport?.hidden).toBe(true);

    await userEvent.click(within(drawn).getByRole("button", { name: "Products" }));

    expect(viewport?.hidden).toBe(false);
  });
});
