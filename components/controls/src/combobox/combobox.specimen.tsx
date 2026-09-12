/**
 * Shows the field that filters a list as it is typed into, in every variant and size.
 */

import { type ReactElement, useState } from "react";

import { Column, Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  ComboboxClearTrigger,
  ComboboxContent,
  ComboboxControl,
  ComboboxEmpty,
  ComboboxIndicatorGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemText,
  ComboboxLabel,
  ComboboxList,
  ComboboxPositioner,
  ComboboxRoot,
  ComboboxTrigger,
  createListCollection,
} from "#combobox/combobox.ts";

/**
 * Every account there is to filter down to.
 */
const ACCOUNTS = [
  "Bridge Ledger",
  "Halden & Co",
  "Perrin Freight",
  "Voss Holdings",
  "Ilan Trust",
  "Marek Logistics",
];

/**
 * How the field is bordered.
 */
const VARIANTS = ["outline", "subtle", "flushed"] as const;

/**
 * How large it is.
 */
const SIZES = ["xs", "sm", "md", "lg"] as const;

/**
 * Describes the props of {@link Accounts}.
 */
interface AccountsProps {
  /**
   * Whether more than one account can be held at once.
   */
  multiple?: boolean;

  /**
   * How large the field is.
   */
  size?: (typeof SIZES)[number];

  /**
   * How the field is bordered.
   */
  variant?: (typeof VARIANTS)[number];
}

/**
 * Draws one combobox, whose list is narrowed by what has been typed.
 *
 * Filtering is the caller's work rather than the component's: the collection is rebuilt on every
 * keystroke, which is what lets the same field be driven by a request instead.
 *
 * @param props - The combobox. `AccountsProps` documents every member.
 * @returns One combobox.
 */
function Accounts(props: AccountsProps): ReactElement {
  const [items, setItems] = useState(ACCOUNTS);
  const collection = createListCollection({ items });

  return (
    <ComboboxRoot
      collection={collection}
      colorPalette="primary"
      multiple={props.multiple}
      onInputValueChange={(details) => {
        const typed = details.inputValue.toLowerCase();
        setItems(ACCOUNTS.filter((account) => account.toLowerCase().includes(typed)));
      }}
      size={props.size}
      variant={props.variant}
      width="14rem"
    >
      <ComboboxControl>
        <ComboboxInput placeholder="Filter accounts" />
        <ComboboxIndicatorGroup>
          <ComboboxClearTrigger />
          <ComboboxTrigger />
        </ComboboxIndicatorGroup>
      </ComboboxControl>
      <ComboboxPositioner>
        <ComboboxContent>
          <ComboboxEmpty>No account matches.</ComboboxEmpty>
          <ComboboxList>
            {items.map((item) => (
              <ComboboxItem item={item} key={item}>
                <ComboboxItemText>{item}</ComboboxItemText>
                <ComboboxItemIndicator />
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </ComboboxPositioner>
    </ComboboxRoot>
  );
}

export const variants: Scene = {
  about:
    "Type into one. Three letters that are in none of the names is what draws the empty part, which otherwise never appears — and it is the state most worth checking, since a list that silently shows nothing reads as a broken field.",
  draw: () => (
    <Matrix direction="row" gap="4" knob="variant" of={VARIANTS}>
      {(variant) => <Accounts variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "The field steps with the size and the list does not, for the same reason a select’s panel does not: the rows have to stay reachable however small the field that opened them.",
  draw: () => (
    <Matrix direction="row" gap="4" knob="size" of={SIZES}>
      {(size) => <Accounts size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const states: Scene = {
  about:
    "Held several at once, and labelled. The difference from a select is the typing: reach for this where the list is long enough that scanning it is worse than naming it.",
  draw: () => (
    <Column align="start" gap="4">
      <Accounts multiple />
      <ComboboxRoot
        collection={createListCollection({ items: ACCOUNTS })}
        colorPalette="primary"
        width="14rem"
      >
        <ComboboxLabel>Account</ComboboxLabel>
        <ComboboxControl>
          <ComboboxInput placeholder="Filter accounts" />
          <ComboboxIndicatorGroup>
            <ComboboxTrigger />
          </ComboboxIndicatorGroup>
        </ComboboxControl>
        <ComboboxPositioner>
          <ComboboxContent>
            <ComboboxList>
              {ACCOUNTS.map((item) => (
                <ComboboxItem item={item} key={item}>
                  <ComboboxItemText>{item}</ComboboxItemText>
                  <ComboboxItemIndicator />
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </ComboboxPositioner>
      </ComboboxRoot>
    </Column>
  ),
  title: "Several at once, and labelled",
};

export default specimen({
  about:
    "A field that narrows a list as it is typed into. Filtering is the caller’s work, so the same field can be driven by a request rather than by an array.",
  group: "Controls",
  id: "controls/combobox",
  scenes: [variants, sizes, states],
  title: "Combobox",
});
