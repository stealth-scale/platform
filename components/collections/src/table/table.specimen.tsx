/**
 * Shows the table in both variants and every size, with each of the flags that change its rules.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  TableBody,
  TableCaption,
  TableCell,
  TableColumn,
  TableColumnGroup,
  TableColumnHeader,
  TableFooter,
  TableHeader,
  TableRoot,
  type TableRootProps,
  TableRow,
  TableScrollArea,
} from "#table/table.ts";

/**
 * What the table holds.
 */
const ROWS = [
  { account: "Bridge Ledger", amount: "£4,120.00", state: "Settled" },
  { account: "Halden & Co", amount: "£880.40", state: "Held" },
  { account: "Perrin Freight", amount: "£12,500.00", state: "Queued" },
];

/**
 * How the rules are drawn.
 */
const VARIANTS = ["line", "outline"] as const;

/**
 * How much room a row takes.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Draws one table, three rows and a total.
 *
 * The amount column is set to align right, which is the case a numeric column needs and the only
 * reason the column group is worth drawing.
 *
 * @param props - Whichever of them the scene is turning. `TableRootProps` documents every member.
 * @returns One table.
 */
function Ledger(props: TableRootProps): ReactElement {
  return (
    <TableRoot {...props}>
      <TableCaption>Payouts raised this week</TableCaption>
      <TableColumnGroup>
        <TableColumn />
        <TableColumn />
        <TableColumn htmlWidth="8rem" />
      </TableColumnGroup>
      <TableHeader>
        <TableRow>
          <TableColumnHeader>Account</TableColumnHeader>
          <TableColumnHeader>State</TableColumnHeader>
          <TableColumnHeader textAlign="end">Amount</TableColumnHeader>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.map((row) => (
          <TableRow key={row.account}>
            <TableCell>{row.account}</TableCell>
            <TableCell>{row.state}</TableCell>
            <TableCell textAlign="end">{row.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell textAlign="end">£17,500.40</TableCell>
        </TableRow>
      </TableFooter>
    </TableRoot>
  );
}

export const variants: Scene = {
  about:
    "Line rules between the rows only; outline draws a box around the whole table as well. Outline is what a table sitting on the page wants, and line is what one already inside a panel wants.",
  draw: () => (
    <Matrix gap="10" knob="variant" of={VARIANTS}>
      {(variant) => <Ledger variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "How much room a row takes. This is the whole of what makes a table scannable rather than dense, so it is worth choosing rather than defaulting.",
  draw: () => (
    <Matrix gap="8" knob="size" of={SIZES}>
      {(size) => <Ledger size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const flags: Scene = {
  about:
    "Striped shades alternate rows, interactive marks the one under the pointer, and the column border rules between the columns as well as the rows. All three together is usually too much — this is what they look like when it is.",
  draw: () => <Ledger interactive showColumnBorder striped />,
  title: "Striped, interactive and ruled",
};

export const sticky: Scene = {
  about:
    "A sticky header needs a scroll area around it and more rows than fit, so this one is drawn inside a short box. Scroll it — the header stays and the rows run under it.",
  draw: () => (
    <TableScrollArea
      borderColor="border"
      borderRadius="l2"
      borderWidth="1px"
      maxH="10rem"
      maxW="lg"
    >
      <Ledger size="sm" stickyHeader />
    </TableScrollArea>
  ),
  title: "A header that stays",
};

export default specimen({
  about:
    "Rows and columns, with a caption, a foot, and a header that can be made to stay while the body scrolls.",
  group: "Collections",
  id: "collections/table",
  scenes: [variants, sizes, flags, sticky],
  title: "Table",
});
