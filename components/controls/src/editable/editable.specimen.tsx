/**
 * Shows the text that becomes a field once it is pressed, at every size.
 */

import { type ReactElement } from "react";

import { CheckIcon, PencilIcon, XIcon } from "lucide-react";

import { Column, Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { IconButton } from "#button/button.ts";
import {
  EditableArea,
  EditableCancelTrigger,
  EditableContext,
  EditableControl,
  EditableEditTrigger,
  EditableInput,
  EditablePreview,
  EditableRoot,
  EditableTextarea,
} from "#editable/editable.ts";

/**
 * How large the text is.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Draws the buttons beside the text: one to start editing, two to finish.
 *
 * @returns The buttons for whichever state the text is in.
 */
function Controls(): ReactElement {
  return (
    <EditableControl>
      <EditableContext>
        {(editable) =>
          editable.editing ? (
            <>
              <EditableCancelTrigger asChild>
                <IconButton aria-label="Cancel" size="xs" variant="ghost">
                  <XIcon size={14} />
                </IconButton>
              </EditableCancelTrigger>
              <EditableEditTrigger asChild>
                <IconButton aria-label="Save" size="xs" variant="ghost">
                  <CheckIcon size={14} />
                </IconButton>
              </EditableEditTrigger>
            </>
          ) : (
            <EditableEditTrigger asChild>
              <IconButton aria-label="Edit" size="xs" variant="ghost">
                <PencilIcon size={14} />
              </IconButton>
            </EditableEditTrigger>
          )
        }
      </EditableContext>
    </EditableControl>
  );
}

export const sizes: Scene = {
  about:
    "The preview and the field have to be exactly the same size, or the text jumps as it is pressed — which is the one thing this component has to get right. Press any of them and watch whether anything moves.",
  draw: () => (
    <Matrix gap="6" knob="size" of={SIZES}>
      {(size) => (
        <EditableRoot colorPalette="primary" defaultValue="Bridge Ledger" size={size}>
          <EditableArea>
            <EditablePreview />
            <EditableInput />
          </EditableArea>
        </EditableRoot>
      )}
    </Matrix>
  ),
  title: "Sizes",
};

export const shapes: Scene = {
  about:
    "With buttons, over several lines, and holding nothing. The empty one is the case to watch: without a placeholder there is no target to press, so the text becomes uneditable by being blank.",
  draw: () => (
    <Column gap="4" width="md">
      <EditableRoot colorPalette="primary" defaultValue="Bridge Ledger">
        <EditableArea>
          <EditablePreview />
          <EditableInput />
        </EditableArea>
        <Controls />
      </EditableRoot>

      <EditableRoot colorPalette="primary" defaultValue="Held while the account is verified.">
        <EditableArea>
          <EditablePreview />
          <EditableTextarea />
        </EditableArea>
      </EditableRoot>

      <EditableRoot colorPalette="primary" placeholder="Add a note">
        <EditableArea>
          <EditablePreview />
          <EditableInput />
        </EditableArea>
      </EditableRoot>
    </Column>
  ),
  title: "With buttons, over lines, and empty",
};

export default specimen({
  about:
    "Text that becomes a field where it stands. Reach for it where the value is read far more often than it is changed.",
  group: "Controls",
  id: "controls/editable",
  scenes: [sizes, shapes],
  title: "Editable",
});
