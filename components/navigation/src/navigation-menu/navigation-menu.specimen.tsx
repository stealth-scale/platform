/**
 * Shows the navigation menu as a site header, with panels of different widths.
 */

import { Box, Column, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  NavigationMenuArrow,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRoot,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  NavigationMenuViewportPositioner,
} from "#navigation-menu/navigation-menu.ts";

/**
 * Describes one panel of the menubar.
 */
interface Panel {
  /**
   * What the panel lists.
   */
  links: readonly string[];

  /**
   * What the trigger is called.
   */
  title: string;

  /**
   * Identifies the panel.
   */
  value: string;
}

/**
 * Names the panels and what each holds, with different counts so the viewport has to resize.
 */
const PANELS: readonly Panel[] = [
  { links: ["Ledger", "Payments", "Reconciliation"], title: "Products", value: "products" },
  { links: ["Guides", "API reference"], title: "Docs", value: "docs" },
  { links: ["About", "Careers", "Press", "Contact"], title: "Company", value: "company" },
];

export const bar: Scene = {
  about:
    "Move between the items. The panel’s position, its width and the bar that tracks the open item are all read out of measurements taken while it opens, so this is where that arithmetic shows itself: the viewport should land under the item that opened it and resize between panels rather than jumping.",
  draw: () => (
    <Box height="16rem" pad="0">
      <NavigationMenuRoot colorPalette="primary">
        <NavigationMenuList>
          {PANELS.map((panel) => (
            <NavigationMenuItem key={panel.value} value={panel.value}>
              <NavigationMenuTrigger>{panel.title}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <Column gap="1" width="12rem">
                  {panel.links.map((link) => (
                    <NavigationMenuLink href={`#${link}`} key={link}>
                      {link}
                    </NavigationMenuLink>
                  ))}
                </Column>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}

          <NavigationMenuIndicator>
            <NavigationMenuArrow />
          </NavigationMenuIndicator>
        </NavigationMenuList>

        <NavigationMenuViewportPositioner>
          <NavigationMenuViewport />
        </NavigationMenuViewportPositioner>
      </NavigationMenuRoot>
    </Box>
  ),
  title: "As a site header",
};

export default specimen({
  about:
    "A bar of triggers, each opening a panel into one shared viewport that moves and resizes between them. A panel is written inside the item it belongs to and moved into the viewport, so nothing here has to know where it will end up.",
  group: "Navigation",
  id: "navigation/navigation-menu",
  scenes: [bar],
  title: "Navigation menu",
});
