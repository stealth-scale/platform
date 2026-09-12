/**
 * Shows the select in every variant and size, grouped, multiple, and clearable.
 */

import { type ReactElement } from "react";

import { Column, Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  createListCollection,
  SelectClearTrigger,
  SelectContent,
  SelectControl,
  SelectHiddenSelect,
  SelectIndicator,
  SelectIndicatorGroup,
  SelectItem,
  SelectItemGroup,
  SelectItemGroupLabel,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectList,
  SelectPositioner,
  SelectRoot,
  type SelectRootProps,
  SelectTrigger,
  SelectValueText,
} from "#select/select.ts";

/**
 * Describes one row of the list.
 */
interface Account {
  /**
   * Which group the row belongs to.
   */
  group: string;

  /**
   * What the row is called.
   */
  label: string;

  /**
   * Identifies the row.
   */
  value: string;
}

/**
 * What can be picked.
 *
 * Built with the factory this package publishes beside the select itself, since a select cannot be
 * drawn without one.
 */
const accounts = createListCollection<Account>({
  items: [
    { group: "Settling", label: "Bridge Ledger", value: "bridge" },
    { group: "Settling", label: "Halden & Co", value: "halden" },
    { group: "Held", label: "Perrin Freight", value: "perrin" },
    { group: "Held", label: "Voss Holdings", value: "voss" },
  ],
});

/**
 * How the trigger is bordered.
 */
const VARIANTS = ["outline", "subtle", "ghost"] as const;

/**
 * How large it is.
 */
const SIZES = ["xs", "sm", "md", "lg"] as const;

/**
 * Draws one select, its rows grouped by where each account stands.
 *
 * @param props - Whichever of them the scene is turning. `SelectRootProps` documents every member.
 * @returns One select.
 */
function Accounts(props: Omit<SelectRootProps<Account>, "children" | "collection">): ReactElement {
  return (
    <SelectRoot collection={accounts} colorPalette="primary" width="12rem" {...props}>
      <SelectHiddenSelect />
      <SelectControl>
        <SelectTrigger>
          <SelectValueText placeholder="Pick an account" />
        </SelectTrigger>
        <SelectIndicatorGroup>
          {props.multiple === true ? <SelectClearTrigger /> : null}
          <SelectIndicator />
        </SelectIndicatorGroup>
      </SelectControl>
      <SelectPositioner>
        <SelectContent>
          {["Settling", "Held"].map((group) => (
            <SelectItemGroup key={group}>
              <SelectItemGroupLabel>{group}</SelectItemGroupLabel>
              {accounts.items
                .filter((item) => item.group === group)
                .map((item) => (
                  <SelectItem item={item} key={item.value}>
                    <SelectItemText>{item.label}</SelectItemText>
                    <SelectItemIndicator />
                  </SelectItem>
                ))}
            </SelectItemGroup>
          ))}
        </SelectContent>
      </SelectPositioner>
    </SelectRoot>
  );
}

export const variants: Scene = {
  about:
    "Open one. The trigger has to hold whatever is picked without moving, which is why every one here is given the same width rather than being left to its content — a select that resizes as the reader chooses shifts everything beside it.",
  draw: () => (
    <Matrix direction="row" gap="4" knob="variant" of={VARIANTS}>
      {(variant) => <Accounts variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "The trigger steps with the size and the panel does not, since the rows have to stay reachable however small the control that opened them.",
  draw: () => (
    <Matrix direction="row" gap="4" knob="size" of={SIZES}>
      {(size) => <Accounts size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const states: Scene = {
  about:
    "Several at once brings a clear button, since a reader who has picked four things needs a way out that is not four more presses. The last one is labelled, which is what a form needs and a toolbar does not.",
  draw: () => (
    <Column align="start" gap="4">
      <Accounts defaultValue={["bridge", "halden"]} multiple />
      <Accounts disabled />
      <Accounts invalid />
      <SelectRoot collection={accounts} colorPalette="primary" width="12rem">
        <SelectLabel>Account</SelectLabel>
        <SelectHiddenSelect />
        <SelectControl>
          <SelectTrigger>
            <SelectValueText placeholder="Pick an account" />
          </SelectTrigger>
          <SelectIndicatorGroup>
            <SelectIndicator />
          </SelectIndicatorGroup>
        </SelectControl>
        <SelectPositioner>
          <SelectContent>
            <SelectList>
              {accounts.items.map((item) => (
                <SelectItem item={item} key={item.value}>
                  <SelectItemText>{item.label}</SelectItemText>
                  <SelectItemIndicator />
                </SelectItem>
              ))}
            </SelectList>
          </SelectContent>
        </SelectPositioner>
      </SelectRoot>
    </Column>
  ),
  title: "Multiple, disabled, invalid and labelled",
};

export default specimen({
  about:
    "One choice out of a list, behind a trigger. It is given a collection rather than children, so it knows how to walk what it is showing without being told again at every callback.",
  group: "Controls",
  id: "controls/select",
  scenes: [variants, sizes, states],
  title: "Select",
});
