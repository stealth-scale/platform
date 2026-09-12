/**
 * Shows the copy button, which swaps to a tick for a moment once it has copied.
 */

import { CheckIcon, CopyIcon } from "lucide-react";

import { Column, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Button, IconButton } from "#button/button.ts";
import {
  ClipboardControl,
  ClipboardIndicator,
  ClipboardInput,
  ClipboardLabel,
  ClipboardRoot,
  ClipboardTrigger,
  ClipboardValueText,
} from "#clipboard/clipboard.ts";
import { InputGroup } from "#input-group/input-group.ts";
import { Input } from "#input/input.ts";

/**
 * What gets copied.
 */
const VALUE = "https://stealthscale.com/payouts/4109";

export const button: Scene = {
  about:
    "Press it. The indicator holds both marks and swaps on the state Ark publishes, then swaps back after a timeout — so the button says it worked without anything else on the page having to.",
  draw: () => (
    <ClipboardRoot colorPalette="primary" value={VALUE}>
      <ClipboardTrigger asChild>
        <Button size="sm" variant="outline">
          <ClipboardIndicator copied={<CheckIcon size={14} />}>
            <CopyIcon size={14} />
          </ClipboardIndicator>
          Copy the link
        </Button>
      </ClipboardTrigger>
    </ClipboardRoot>
  ),
  title: "On its own",
};

export const beside: Scene = {
  about:
    "Beside the value it copies, so a reader can see what they are about to take. The field is read-only rather than disabled: it can still be focused and selected, which is the fallback when the copy is refused by the browser.",
  draw: () => (
    <Column width="md">
      <ClipboardRoot colorPalette="primary" value={VALUE}>
        <ClipboardLabel>Link to the payout</ClipboardLabel>
        <ClipboardControl>
          <InputGroup
            endElement={
              <ClipboardTrigger asChild>
                <IconButton aria-label="Copy" size="xs" variant="ghost">
                  <ClipboardIndicator copied={<CheckIcon size={14} />}>
                    <CopyIcon size={14} />
                  </ClipboardIndicator>
                </IconButton>
              </ClipboardTrigger>
            }
          >
            <ClipboardInput asChild>
              <Input readOnly />
            </ClipboardInput>
          </InputGroup>
        </ClipboardControl>
      </ClipboardRoot>
    </Column>
  ),
  title: "Beside a field",
};

export const bare: Scene = {
  about:
    "The trigger takes whatever it is given, so the value itself can be the thing pressed. Reach for this where the copy is a convenience rather than the point of the row.",
  draw: () => (
    <ClipboardRoot colorPalette="primary" value={VALUE}>
      <ClipboardTrigger asChild>
        <Text muted>
          <ClipboardValueText />
        </Text>
      </ClipboardTrigger>
    </ClipboardRoot>
  ),
  title: "The value itself",
};

export default specimen({
  about:
    "Copies a value and says so for a moment. It draws no control of its own — the trigger is whatever it is handed.",
  group: "Controls",
  id: "controls/clipboard",
  scenes: [button, beside, bare],
  title: "Clipboard",
});
