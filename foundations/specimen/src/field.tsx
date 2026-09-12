/**
 * The line a scene types into when the field is not what is being shown.
 */

import { type ComponentPropsWithRef, type ReactElement } from "react";

import { chakra } from "@chakra-ui/react";

/**
 * How the ring is drawn, which is the same ring every recipe in this kit draws.
 */
const RING = {
  outlineColor: "colorPalette.focusRing",
  outlineOffset: "0",
  outlineStyle: "solid",
  outlineWidth: "2px",
};

/**
 * Describes the props of {@link Field}.
 *
 * Everything an input takes is accepted and passed through, for the same reason {@link TriggerProps}
 * does: a field handed to a component that clones it has to carry the props back.
 */
export interface FieldProps extends ComponentPropsWithRef<"input"> {
  /**
   * Takes whatever room is left over beside its siblings.
   *
   * A field welded to a button is the shape of every search box there is, and the field is the half
   * that absorbs the width — the button keeps its own.
   */
  grows?: boolean;
}

/**
 * Draws a line to type into.
 *
 * Not this kit's input. A scene showing a form field, a popover or a group is showing that, and the
 * line inside it is furniture — so it lives here, where a specimen can reach it without its package
 * depending on `components/controls`. The input has a specimen of its own.
 *
 * @param props - The line, as an input takes it. `FieldProps` documents it.
 * @returns One line to type into.
 */
export function Field(props: FieldProps): ReactElement {
  const { grows = false, ...rest } = props;

  return (
    <chakra.input
      _focusVisible={RING}
      borderColor="border"
      borderRadius="l2"
      borderWidth="1px"
      colorPalette="primary"
      flex={grows ? "1" : undefined}
      fontSize="sm"
      height="9"
      minWidth="0"
      paddingInline="3"
      {...rest}
    />
  );
}
