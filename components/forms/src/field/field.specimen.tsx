/**
 * Shows the field wrapping a control with its label, its hint and its error, in each state.
 */

import { Field as Line, Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  FieldErrorText,
  FieldHelperText,
  FieldLabel,
  FieldRequiredIndicator,
  FieldRoot,
  type FieldRootProps,
} from "#field/field.ts";

/**
 * Describes one state a field can be in.
 */
interface State {
  /**
   * What the caption calls it.
   */
  name: string;

  /**
   * What puts the field in it.
   */
  props: FieldRootProps;
}

/**
 * Names each state a field can be in, against the props that put it there.
 */
const STATES: readonly State[] = [
  { name: "at rest", props: {} },
  { name: "required", props: { required: true } },
  { name: "invalid", props: { invalid: true } },
  { name: "disabled", props: { disabled: true } },
  { name: "read only", props: { readOnly: true } },
];

export const states: Scene = {
  about:
    "The hint and the error are both written every time, and whichever the state calls for is the one shown — so they never appear together and the field never changes height as it goes wrong. The state is stated once on the root and reaches the label, the control and the text under it.",
  draw: () => (
    <Matrix knob="state" label={(state) => state.name} of={STATES}>
      {(state) => (
        <FieldRoot maxW="sm" {...state.props}>
          <FieldLabel>
            IBAN
            <FieldRequiredIndicator />
          </FieldLabel>
          <Line defaultValue="NL91 ABNA 0417 1643 00" />
          <FieldHelperText>Where a payout is sent.</FieldHelperText>
          <FieldErrorText>That is not a valid IBAN.</FieldErrorText>
        </FieldRoot>
      )}
    </Matrix>
  ),
  title: "States",
};

export default specimen({
  about:
    "Wraps one control with its label, its hint and its error, and carries the state to all three. The control inside is whatever the form needs — the field itself draws none of it.",
  group: "Forms",
  id: "forms/field",
  scenes: [states],
  title: "Field",
});
