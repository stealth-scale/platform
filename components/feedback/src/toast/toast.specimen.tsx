/**
 * Shows a toast raised in each of the types a toaster can raise.
 */

import { Column, Row, type Scene, specimen, Trigger } from "@stealthscale/foundation-specimen";

import {
  createToaster,
  ToastCloseTrigger,
  ToastDescription,
  Toaster,
  ToastIndicator,
  ToastRoot,
  ToastTitle,
} from "#toast/toast.ts";

/**
 * The one toaster this specimen raises into, in the corner a page usually puts it.
 */
const toaster = createToaster({ gap: 12, overlap: true, placement: "bottom-end" });

/**
 * What can be raised, against the words each carries.
 */
const KINDS = [
  { description: "Four lines matched.", title: "Reconciled", type: "success" },
  { description: "The account could not be verified.", title: "Payout held", type: "error" },
  { description: "This offer expires on Friday.", title: "Expiring", type: "warning" },
  { description: "The ledger was exported.", title: "Exported", type: "info" },
  { description: "Matching four hundred lines.", title: "Working", type: "loading" },
] as const;

export const kinds: Scene = {
  about:
    "Raise a few. A toast cannot be shown at rest, so the scene is the raising of one — and several at once is the case worth trying, since they stack and overlap until the pointer rests on them. The root is full width and the toaster does not size it, so the width is the caller’s to give: without one every toast comes out as wide as its shortest word.",
  draw: () => (
    <Column gap="4">
      <Row gap="2">
        {KINDS.map((kind) => (
          <Trigger
            key={kind.type}
            onClick={() => {
              toaster.create({ ...kind });
            }}
            quiet
          >
            {kind.title}
          </Trigger>
        ))}
      </Row>

      <Toaster toaster={toaster}>
        {(toast) => (
          <ToastRoot key={toast.id} width={{ base: "calc(100vw - 2rem)", sm: "sm" }}>
            <ToastIndicator />
            <Column gap="1">
              <ToastTitle>{toast.title}</ToastTitle>
              <ToastDescription>{toast.description}</ToastDescription>
            </Column>
            <ToastCloseTrigger />
          </ToastRoot>
        )}
      </Toaster>
    </Column>
  ),
  title: "The kinds it raises",
};

export default specimen({
  about:
    "A message raised into a corner of the window and dismissed on its own. Never the only place something is said, since a toast that is missed is gone.",
  group: "Feedback",
  id: "feedback/toast",
  scenes: [kinds],
  title: "Toast",
});
