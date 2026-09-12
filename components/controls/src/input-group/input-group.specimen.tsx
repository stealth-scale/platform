/**
 * Shows the wrapper that puts something at one or both ends of a field.
 */

import { SearchIcon, XIcon } from "lucide-react";

import { Column, Matrix, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { IconButton } from "#button/button.ts";
import { InputGroup } from "#input-group/input-group.ts";
import { Input } from "#input/input.ts";

/**
 * How large the field is, which the group has to match.
 */
const SIZES = ["xs", "sm", "md", "lg"] as const;

export const sizes: Scene = {
  about:
    "The group reserves a fixed square at each end and the field is padded to clear it, so the two have to be told the same size or the text runs under the icon.",
  draw: () => (
    <Column gap="6" width="sm">
      <Matrix gap="6" knob="size" of={SIZES}>
        {(size) => (
          <InputGroup startElement={<SearchIcon size={16} />}>
            <Input placeholder="Search the ledger" size={size} />
          </InputGroup>
        )}
      </Matrix>
    </Column>
  ),
  title: "Sizes",
};

export const ends: Scene = {
  about:
    "The reserved square is right for an icon and too narrow for a word. A wider element has to be given its width and the field the matching padding, or the two overlap — which is what the second one shows.",
  draw: () => (
    <Column gap="4" width="sm">
      <InputGroup
        endElement={
          <IconButton aria-label="Clear" size="xs" variant="ghost">
            <XIcon size={14} />
          </IconButton>
        }
        startElement={<SearchIcon size={16} />}
      >
        <Input defaultValue="Bridge" placeholder="Search the ledger" />
      </InputGroup>

      <InputGroup
        startElement={<Text muted>https://</Text>}
        startElementProps={{ pointerEvents: "none", width: "4.5rem" }}
      >
        <Input placeholder="stealthscale.com" ps="4.5rem" />
      </InputGroup>
    </Column>
  ),
  title: "Both ends, and a wide one",
};

export default specimen({
  about:
    "Puts something at one or both ends of a field — an icon, a unit, a button — without the field losing its own hit area.",
  group: "Controls",
  id: "controls/input-group",
  scenes: [sizes, ends],
  title: "Input group",
});
