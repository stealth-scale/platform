/**
 * Shows the element laid over one end of a field, and the things worth putting in one.
 */

import { CircleAlertIcon, LockIcon, SearchIcon, XIcon } from "lucide-react";

import {
  Column,
  Matrix,
  type Scene,
  specimen,
  Text,
  Trigger,
} from "@stealthscale/foundation-specimen";

import { InputGroup } from "#input-group/input-group.ts";
import { Input } from "#input/input.ts";

/**
 * Which end it sits at.
 */
const PLACEMENTS = ["start", "end"] as const;

/**
 * What is worth laying over the end of a field, against what each one is for.
 */
const CONTENTS = [
  { label: "an icon", node: <SearchIcon size={16} /> },
  { label: "a unit", node: <Text muted>GBP</Text> },
  {
    label: "a button",
    node: (
      <Trigger label="Clear" quiet>
        <XIcon size={14} />
      </Trigger>
    ),
  },
  { label: "a warning", node: <CircleAlertIcon color="currentColor" size={16} /> },
];

export const ends: Scene = {
  about:
    "The element is laid over the field rather than beside it, and where it lands is measured from a variable the group sets. Outside a group it has nothing to measure against and falls below the field, so both of these are inside one.",
  draw: () => (
    <Column width="sm">
      <Matrix gap="6" knob="placement" of={PLACEMENTS}>
        {(placement) =>
          placement === "start" ? (
            <InputGroup startElement={<SearchIcon size={16} />}>
              <Input placeholder="Search the ledger" />
            </InputGroup>
          ) : (
            <InputGroup endElement={<SearchIcon size={16} />}>
              <Input placeholder="Search the ledger" />
            </InputGroup>
          )
        }
      </Matrix>
    </Column>
  ),
  title: "Which end it sits at",
};

export const contents: Scene = {
  about:
    "The difference from an addon: an addon takes its own space beside the field and shares its border, while an element sits on top and the field is padded to make room. That is why anything put here has to be narrow enough for the room reserved.",
  draw: () => (
    <Column width="sm">
      <Matrix gap="6" knob="endElement" label={(entry) => entry.label} of={CONTENTS}>
        {(entry) => (
          <InputGroup endElement={entry.node} endElementProps={{ color: "fg.muted" }}>
            <Input defaultValue="4120.00" />
          </InputGroup>
        )}
      </Matrix>
    </Column>
  ),
  title: "What is worth putting in one",
};

export const disabled: Scene = {
  about:
    "Against a disabled field, where the element has to go quiet with it rather than staying at full strength over greyed-out text.",
  draw: () => (
    <Column width="sm">
      <InputGroup startElement={<LockIcon size={16} />}>
        <Input disabled value="Locked while it settles" />
      </InputGroup>
    </Column>
  ),
  title: "On a disabled field",
};

export default specimen({
  about:
    "Something laid over one end of a field — an icon, a unit, a small button. It sits on top and the field is padded to clear it, which is what separates it from an addon.",
  group: "Controls",
  id: "controls/input-element",
  scenes: [ends, contents, disabled],
  title: "Input element",
});
