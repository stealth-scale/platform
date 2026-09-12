/**
 * Shows the browser's own select, in every variant and size.
 */

import { type ReactElement } from "react";

import { Matrix, Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  NativeSelectField,
  NativeSelectIndicator,
  NativeSelectRoot,
  type NativeSelectRootProps,
} from "#native-select/native-select.ts";

/**
 * How the control is bordered.
 */
const VARIANTS = ["outline", "subtle", "plain", "ghost"] as const;

/**
 * How large it is.
 */
const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

/**
 * What can be picked.
 */
const ACCOUNTS = ["Bridge Ledger", "Halden & Co", "Perrin Freight"];

/**
 * Describes the props of {@link Accounts}.
 */
interface AccountsProps extends Omit<NativeSelectRootProps, "children"> {
  /**
   * What the field says before anything is picked.
   */
  placeholder?: string;
}

/**
 * Draws one select over the three accounts.
 *
 * @param props - The select. `AccountsProps` documents every member.
 * @returns One select.
 */
function Accounts(props: AccountsProps): ReactElement {
  const { placeholder = "Pick an account", ...root } = props;

  return (
    <NativeSelectRoot maxW="12rem" {...root}>
      <NativeSelectField placeholder={placeholder}>
        {ACCOUNTS.map((account) => (
          <option key={account} value={account}>
            {account}
          </option>
        ))}
      </NativeSelectField>
      <NativeSelectIndicator />
    </NativeSelectRoot>
  );
}

export const variants: Scene = {
  about:
    "The list itself is the browser’s, so nothing here styles it: only the box around it and the arrow at the end are the kit’s. The arrow is a separate part so it can be replaced.",
  draw: () => (
    <Matrix knob="variant" of={VARIANTS}>
      {(variant) => <Accounts variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "The height has to match the input and the button step for step, since these are what a form puts side by side.",
  draw: () => (
    <Matrix direction="row" gap="4" knob="size" of={SIZES}>
      {(size) => <Accounts size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const states: Scene = {
  about:
    "Reach for this over the kit’s own select where the list is long, where the platform’s picker is what a reader expects, or where the page has to work without JavaScript.",
  draw: () => (
    <Row gap="4">
      <Accounts disabled placeholder="Disabled" />
      <Accounts invalid placeholder="Invalid" />
    </Row>
  ),
  title: "States",
};

export default specimen({
  about:
    "The browser’s own select, with the kit’s box around it. What opens is the platform’s picker, which is why it is the one to reach for on a phone.",
  group: "Controls",
  id: "controls/native-select",
  scenes: [variants, sizes, states],
  title: "Native select",
});
