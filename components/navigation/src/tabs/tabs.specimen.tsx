/**
 * Shows the tabs in every variant, at every size, and stretched across their container.
 */

import { type ReactElement } from "react";

import { Column, Matrix, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  type TabsRootProps,
  TabsTrigger,
} from "#tabs/tabs.ts";

/**
 * What the three tabs are called.
 */
const PANELS = ["Ledger", "Payouts", "Exports"];

/**
 * How the tabs are drawn.
 */
const VARIANTS = ["line", "subtle", "enclosed", "outline", "plain"] as const;

/**
 * How large they are.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Draws one set of tabs on the first panel.
 *
 * The indicator is only drawn by some variants, and the ones that ignore it mark the selected
 * trigger themselves — so it is rendered every time and left to the recipe to hide.
 *
 * @param props - Whichever of them the scene is turning. `TabsRootProps` documents every member.
 * @returns The tabs and the panel under them.
 */
function Panels(props: TabsRootProps): ReactElement {
  return (
    <TabsRoot colorPalette="primary" defaultValue={PANELS[0]} {...props}>
      <TabsList>
        {PANELS.map((panel) => (
          <TabsTrigger key={panel} value={panel}>
            {panel}
          </TabsTrigger>
        ))}
        <TabsIndicator />
      </TabsList>

      {PANELS.map((panel) => (
        <TabsContent key={panel} value={panel}>
          <Text muted>What sits under {panel.toLowerCase()}.</Text>
        </TabsContent>
      ))}
    </TabsRoot>
  );
}

export const variants: Scene = {
  about:
    "How far the tabs are set off from the panel under them. Enclosed is the one that joins the two into a card; line is the one that leaves the panel to the page.",
  draw: () => (
    <Matrix gap="10" knob="variant" of={VARIANTS}>
      {(variant) => (
        <Column width="18rem">
          <Panels variant={variant} />
        </Column>
      )}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "The trigger and the panel are padded together, so the size sets the rhythm of the whole thing rather than the height of the strip.",
  draw: () => (
    <Matrix direction="row" gap="10" knob="size" of={SIZES}>
      {(size) => (
        <Column width="18rem">
          <Panels size={size} />
        </Column>
      )}
    </Matrix>
  ),
  title: "Sizes",
};

export const fitted: Scene = {
  about:
    "The only case where the triggers stop being as wide as their words and divide the container instead. Worth reaching for where the tabs are a segmented choice rather than a set of sections.",
  draw: () => (
    <Column width="md">
      <Panels fitted variant="enclosed" />
    </Column>
  ),
  title: "Fitted",
};

export default specimen({
  about:
    "Several panels behind one strip of triggers, one shown at a time. Reach for it where the panels are peers; reach for an accordion where they are a list.",
  group: "Navigation",
  id: "navigation/tabs",
  scenes: [variants, sizes, fitted],
  title: "Tabs",
});
