import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { render, within } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";

import {
  TocIndicator,
  TocItem,
  type TocItemData,
  TocLink,
  TocList,
  TocNav,
  TocRoot,
  type TocRootProps,
  TocTitle,
} from "#toc/toc.ts";

/**
 * The styling system these tests draw under, which is Chakra with nothing retuned.
 */
const system = createSystem(defaultConfig);

/**
 * Three headings, two levels deep, which is the least that shows the nesting.
 */
const ITEMS: readonly TocItemData[] = [
  { depth: 2, value: "terms" },
  { depth: 3, value: "payment" },
  { depth: 2, value: "liability" },
];

/**
 * Renders a rail over three headings and answers the element it was rendered into, so a test may
 * draw two rails and tell them apart.
 *
 * Ark sets no `href` on a link — it reads the hash back off the element when one is clicked — so
 * the caller supplies it, here and in any real page.
 */
function rail(props: Omit<TocRootProps, "children" | "items"> = {}): HTMLElement {
  const { container } = render(
    <ChakraProvider value={system}>
      <TocRoot {...props} items={[...ITEMS]}>
        <TocNav>
          <TocTitle>On this page</TocTitle>
          <TocList>
            <TocIndicator />
            {ITEMS.map((item) => (
              <TocItem item={item} key={item.value}>
                <TocLink href={`#${item.value}`}>{item.value}</TocLink>
              </TocItem>
            ))}
          </TocList>
        </TocNav>
      </TocRoot>
    </ChakraProvider>,
  );

  return container;
}

describe("TocRoot", () => {
  it("carries the recipe class, which is what proves the recipe resolved", () => {
    expect(rail().firstElementChild?.className).toContain("scale-toc");
  });

  it("styles the rail down to every link", () => {
    const drawn = rail();

    expect(drawn.querySelector<HTMLElement>("[data-part=list]")?.className).toContain("scale-toc");
    expect(drawn.querySelector<HTMLElement>("[data-part=link]")?.className).toContain("scale-toc");
  });
});

describe("TocItem", () => {
  it("publishes each heading depth, which is what indents a nested one", () => {
    const items = rail().querySelectorAll<HTMLElement>("[data-part=item]");

    expect([...items].map((one) => one.style.getPropertyValue("--depth"))).toEqual(["2", "3", "2"]);
  });
});

describe("TocLink", () => {
  it("points at the heading it names", () => {
    const links = within(rail()).getAllByRole("link");

    expect(links.map((one) => one.getAttribute("href"))).toEqual([
      "#terms",
      "#payment",
      "#liability",
    ]);
  });

  it("reads as the current location while its heading is the active one", () => {
    const links = within(rail({ defaultActiveIds: ["payment"] })).getAllByRole("link");

    expect(links.map((one) => one.getAttribute("aria-current"))).toEqual([null, "location", null]);
  });
});

describe("TocNav", () => {
  it("draws a landmark named by the title", () => {
    const drawn = rail();
    const nav = within(drawn).getByRole("navigation");

    expect(nav.getAttribute("aria-labelledby")).not.toBeNull();
    expect(within(drawn).getByText("On this page").id).toBe(nav.getAttribute("aria-labelledby"));
  });
});
