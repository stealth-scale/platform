/**
 * Shows a value of every shape JavaScript has, drawn as a tree.
 */

import { ChevronRightIcon } from "lucide-react";

import { Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { JsonTreeViewRoot, JsonTreeViewTree } from "#json-tree-view/json-tree-view.ts";

/**
 * How deep the tree is opened to start with.
 */
const DEPTHS = [1, 2] as const;

/**
 * One value carrying every kind the tree colours differently.
 *
 * Dates, maps, sets, functions, regular expressions and errors are all in it on purpose: each is
 * marked with its own `data-type`, and a kind the recipe forgot shows up here as unstyled text.
 */
const account = {
  address: {
    city: "Anytown",
    coordinates: { lat: 37.7749, lng: -122.419_4 },
    street: "123 Main St",
  },
  avatar: null,
  balance: 1234.56,
  createdAt: new Date("2024-01-15T14:22:00Z"),
  description: undefined,
  emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/u,
  greet: (name: string): string => `Hello, ${name}`,
  isActive: true,
  isVerified: false,
  lastError: new Error("The payout was held"),
  name: "Bridge Ledger",
  preferences: new Map([
    ["theme", "dark"],
    ["window", "week"],
  ]),
  scores: [95, 87, 92],
  tags: ["premium", "verified"],
  visitedPages: new Set(["/ledger", "/payouts"]),
};

export const kinds: Scene = {
  about:
    "The colours are the point: a string reads differently from a number, a key from its value, and a collapsed object shows a preview of what is inside it rather than only a brace. Every kind JavaScript has is in this value, so one the recipe forgot appears here as unstyled text.",
  draw: () => (
    <JsonTreeViewRoot colorPalette="primary" data={account} defaultExpandedDepth={2}>
      <JsonTreeViewTree arrow={<ChevronRightIcon />} indentGuide />
    </JsonTreeViewRoot>
  ),
  title: "Kinds",
};

export const depth: Scene = {
  about:
    "How much of the value is open before anybody touches it. One level is an index; two is a summary.",
  draw: () => (
    <Matrix gap="8" knob="defaultExpandedDepth" label={String} of={DEPTHS}>
      {(open) => (
        <JsonTreeViewRoot colorPalette="primary" data={account.address} defaultExpandedDepth={open}>
          <JsonTreeViewTree arrow={<ChevronRightIcon />} indentGuide />
        </JsonTreeViewRoot>
      )}
    </Matrix>
  ),
  title: "Opening depth",
};

export const keys: Scene = {
  about:
    "Quoting the keys makes the tree read as the JSON it came from rather than as the object it became. Worth it where the value is about to be copied out; noise where it is being read.",
  draw: () => (
    <JsonTreeViewRoot
      colorPalette="primary"
      data={account.address}
      defaultExpandedDepth={2}
      quotesOnKeys
      size="md"
    >
      <JsonTreeViewTree arrow={<ChevronRightIcon />} indentGuide />
    </JsonTreeViewRoot>
  ),
  title: "Quoted keys",
};

export default specimen({
  about:
    "Draws any value as a tree, colouring each kind so the shape of the data is legible before any of it is read.",
  group: "Layout",
  id: "layout/json-tree-view",
  scenes: [kinds, depth, keys],
  title: "JSON tree view",
});
