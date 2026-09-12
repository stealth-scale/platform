/**
 * The thing a scene presses to make something happen.
 */

import { type ComponentPropsWithRef, type ReactElement } from "react";

import { chakra } from "@chakra-ui/react";

/**
 * How the ring is drawn, which is the same ring every recipe in this kit draws.
 */
const RING = {
  outlineColor: "colorPalette.focusRing",
  outlineOffset: "2px",
  outlineStyle: "solid",
  outlineWidth: "2px",
};

/**
 * How the one that is on is drawn.
 *
 * Stated here rather than at the call site, because whichever trigger is current is decided by
 * whatever is cloning it — a pager marks its own page, a toggle group its own item — and a scene
 * that had to style that would be styling something it does not control.
 */
const SELECTED = {
  bg: "colorPalette.solid",
  borderColor: "colorPalette.solid",
  color: "colorPalette.contrast",
};

/**
 * Describes the props of {@link Trigger}.
 *
 * Everything a button takes is accepted and passed through, because a trigger is nearly always
 * handed to a component that clones it: `asChild` puts the handler, the ARIA state and the ref on
 * whatever it was given, and a child that dropped them would be a button that does nothing.
 */
export interface TriggerProps extends ComponentPropsWithRef<"button"> {
  /**
   * What it is called, where it carries a mark rather than words.
   *
   * Stating one also squares the button, since a mark needs the same room on both axes. Without a
   * label an icon-only trigger is a square nobody can name.
   */
  label?: string;

  /**
   * Draws it without a rule, for a trigger sitting beside a louder one.
   */
  quiet?: boolean;
}

/**
 * Draws something to press.
 *
 * Not this kit's button. A scene showing a dialog is showing the dialog, and the control that
 * opened it is furniture — so it lives here, where a specimen can reach it without its package
 * depending on `components/controls`. The button has a specimen of its own, and that is where to
 * look at a button.
 *
 * @param props - The words and how they are drawn. `TriggerProps` documents every member.
 * @returns One pressable.
 */
export function Trigger(props: TriggerProps): ReactElement {
  const { label, quiet = false, ...rest } = props;

  return (
    <chakra.button
      _focusVisible={RING}
      _hover={{ bg: "bg.subtle" }}
      _selected={SELECTED}
      alignItems="center"
      aria-label={label}
      borderColor={quiet ? "transparent" : "border"}
      borderRadius="l2"
      borderWidth="1px"
      colorPalette="primary"
      cursor="button"
      display="inline-flex"
      fontSize="sm"
      fontWeight="medium"
      gap="2"
      height="9"
      justifyContent="center"
      paddingInline={label === undefined ? "3" : "0"}
      type="button"
      width={label === undefined ? undefined : "9"}
      {...rest}
    />
  );
}
