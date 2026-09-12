/**
 * Shows the fieldset grouping several fields under one legend.
 */

import { Field as Line, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { FieldLabel, FieldRoot } from "#field/field.ts";
import {
  FieldsetContent,
  FieldsetHelperText,
  FieldsetLegend,
  FieldsetRoot,
} from "#fieldset/fieldset.ts";

export const grouped: Scene = {
  about:
    "What a legend is for: a name over a set of fields rather than over one. A screen reader announces it before each field inside, so “Street” is heard as “Registered address, Street” without any field repeating it.",
  draw: () => (
    <FieldsetRoot maxW="sm">
      <FieldsetLegend>Registered address</FieldsetLegend>
      <FieldsetHelperText>Where correspondence is sent.</FieldsetHelperText>

      <FieldsetContent>
        <FieldRoot>
          <FieldLabel>Street</FieldLabel>
          <Line placeholder="Keizersgracht 1" />
        </FieldRoot>

        <FieldRoot>
          <FieldLabel>Postcode</FieldLabel>
          <Line placeholder="1015 CJ" />
        </FieldRoot>

        <FieldRoot>
          <FieldLabel>City</FieldLabel>
          <Line placeholder="Amsterdam" />
        </FieldRoot>
      </FieldsetContent>
    </FieldsetRoot>
  ),
  title: "Under one legend",
};

export default specimen({
  about:
    "Several fields under one name, disabled together and announced together. Reach for it where the fields answer one question between them — an address, a date range, a set of contacts.",
  group: "Forms",
  id: "forms/fieldset",
  scenes: [grouped],
  title: "Fieldset",
});
