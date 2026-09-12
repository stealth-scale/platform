/**
 * Shows the panel that can be dragged around the page, resized, and folded away.
 */

import { Maximize2Icon, Minimize2Icon, MinusIcon, XIcon } from "lucide-react";

import { type Scene, specimen, Text, Trigger } from "@stealthscale/foundation-specimen";

import {
  FloatingPanelBody,
  FloatingPanelCloseTrigger,
  FloatingPanelContent,
  FloatingPanelControl,
  FloatingPanelDragTrigger,
  FloatingPanelHeader,
  FloatingPanelPositioner,
  FloatingPanelResizeTriggers,
  FloatingPanelRoot,
  FloatingPanelStageTrigger,
  FloatingPanelTitle,
  FloatingPanelTrigger,
} from "#floating-panel/floating-panel.ts";

/**
 * What each stage trigger does, against the mark it carries.
 */
const STAGES = [
  { Icon: MinusIcon, label: "Minimise", stage: "minimized" },
  { Icon: Maximize2Icon, label: "Maximise", stage: "maximized" },
  { Icon: Minimize2Icon, label: "Restore", stage: "default" },
] as const;

export const floating: Scene = {
  about:
    "Open it, then drag the header to move it or any edge to resize it. All three stage triggers are rendered and whichever does not apply is hidden, so the header shows two at a time rather than three. The header is the bar and the drag trigger is a region inside it — nested the other way round, the bar draws its own box and floats above the panel it belongs to.",
  draw: () => (
    <FloatingPanelRoot
      defaultPosition={{ x: 320, y: 240 }}
      defaultSize={{ height: 240, width: 320 }}
    >
      <FloatingPanelTrigger asChild>
        <Trigger>Open the panel</Trigger>
      </FloatingPanelTrigger>

      <FloatingPanelPositioner>
        <FloatingPanelContent colorPalette="primary">
          <FloatingPanelHeader>
            <FloatingPanelDragTrigger>
              <FloatingPanelTitle>Working notes</FloatingPanelTitle>
            </FloatingPanelDragTrigger>
            <FloatingPanelControl>
              {STAGES.map((entry) => (
                <FloatingPanelStageTrigger asChild key={entry.stage} stage={entry.stage}>
                  <Trigger label={entry.label} quiet>
                    <entry.Icon size={14} />
                  </Trigger>
                </FloatingPanelStageTrigger>
              ))}
              <FloatingPanelCloseTrigger asChild>
                <Trigger label="Close" quiet>
                  <XIcon size={14} />
                </Trigger>
              </FloatingPanelCloseTrigger>
            </FloatingPanelControl>
          </FloatingPanelHeader>

          <FloatingPanelBody>
            <Text muted>Drag the header to move the panel, or any edge to resize it.</Text>
          </FloatingPanelBody>

          <FloatingPanelResizeTriggers />
        </FloatingPanelContent>
      </FloatingPanelPositioner>
    </FloatingPanelRoot>
  ),
  title: "Dragged and resized",
};

export default specimen({
  about:
    "A panel the reader moves and sizes for themselves, and folds away without losing. What a working note, an inspector or a preview wants — everything else on the page stays live around it.",
  group: "Overlays",
  id: "overlays/floating-panel",
  scenes: [floating],
  title: "Floating panel",
});
