/**
 * Shows the list that can be selected from, in every variant and both selection modes.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { createListCollection } from "#collection/collection.ts";
import {
  ListboxContent,
  ListboxEmpty,
  ListboxInput,
  ListboxItem,
  ListboxItemGroup,
  ListboxItemGroupLabel,
  ListboxItemIndicator,
  ListboxItemText,
  ListboxLabel,
  ListboxRoot,
  type ListboxRootProps,
  ListboxValueText,
} from "#listbox/listbox.ts";

/**
 * What can be picked.
 */
const accounts = createListCollection({
  items: [
    { label: "Bridge Ledger", value: "bridge" },
    { label: "Halden & Co", value: "halden" },
    { label: "Perrin Freight", value: "perrin" },
    { label: "Voss Holdings", value: "voss" },
  ],
});

/**
 * How the selected row is drawn.
 */
const VARIANTS = ["subtle", "solid", "plain"] as const;

/**
 * How many rows can be on at once.
 */
const MODES = ["single", "multiple"] as const;

/**
 * Draws one list, with the field above it that filters the rows.
 *
 * A row is picked to start with, because that is the only thing the variants change: an empty list
 * is the same in all three.
 *
 * @param props - Whichever of them the scene is turning. `ListboxRootProps` documents every member.
 * @returns One list, filterable and selectable.
 */
function Accounts(
  props: Omit<
    ListboxRootProps<{
      label: string;
      value: string;
    }>,
    "collection"
  >,
): ReactElement {
  const picked = props.selectionMode === "multiple" ? ["bridge", "perrin"] : ["bridge"];

  return (
    <ListboxRoot
      collection={accounts}
      colorPalette="primary"
      defaultValue={picked}
      maxW="14rem"
      {...props}
    >
      <ListboxLabel>Accounts</ListboxLabel>
      <ListboxInput placeholder="Filter" />
      <ListboxContent>
        <ListboxItemGroup>
          <ListboxItemGroupLabel>Settling</ListboxItemGroupLabel>
          {accounts.items.map((item) => (
            <ListboxItem item={item} key={item.value}>
              <ListboxItemText>{item.label}</ListboxItemText>
              <ListboxItemIndicator />
            </ListboxItem>
          ))}
        </ListboxItemGroup>
        <ListboxEmpty>No account matches.</ListboxEmpty>
      </ListboxContent>
      <ListboxValueText color="fg.muted" fontSize="xs" placeholder="Nothing picked" />
    </ListboxRoot>
  );
}

export const variants: Scene = {
  about:
    "How the picked row is marked. Plain leans on the indicator alone, which is the one to check against a long list — a row that is on but looks the same as the rest is a row nobody can find again.",
  draw: (): ReactElement => (
    <Matrix direction="row" gap="10" knob="variant" of={VARIANTS}>
      {(variant) => <Accounts selectionMode="single" variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const modes: Scene = {
  about:
    "One at a time or several. The indicator changes shape with the mode, so a reader can tell which kind of list they are in before touching it.",
  draw: (): ReactElement => (
    <Matrix direction="row" gap="10" knob="selectionMode" of={MODES}>
      {(mode) => <Accounts selectionMode={mode} />}
    </Matrix>
  ),
  title: "Selection modes",
};

export const filtering: Scene = {
  about:
    "Type into the field to narrow the rows. Three letters that are in none of the names is what draws the empty part, which otherwise never appears.",
  draw: (): ReactElement => <Accounts selectionMode="single" />,
  title: "Filtering",
};

export default specimen({
  about:
    "A list to pick from, in place rather than behind a trigger. Reach for it where the options are worth showing; reach for a select where they are not.",
  group: "Collections",
  id: "collections/listbox",
  scenes: [variants, modes, filtering],
  title: "Listbox",
});
