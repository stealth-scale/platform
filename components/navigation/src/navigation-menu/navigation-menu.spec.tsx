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
 */
function menubar(props: Omit<NavigationMenuRootProps, "children"> = {}): HTMLElement {
  const { container } = render(
    <ChakraProvider value={system}>
      <NavigationMenuRoot {...props}>
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
