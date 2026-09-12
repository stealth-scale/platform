/**
 * Composes controls into something a person submits, and reports what is wrong with it.
 *
 * Every component here is Chakra's under this design system's own name, so an application imports
 * the styling engine nowhere. That is the seam the theme's provider is: the engine underneath stays
 * this repository's to change.
 *
 * @packageDocumentation
 */

export {
  Field,
  FieldContext,
  FieldErrorIcon,
  type FieldErrorIconProps,
  FieldErrorText,
  type FieldErrorTextProps,
  FieldHelperText,
  type FieldHelperTextProps,
  FieldItem,
  type FieldItemProps,
  FieldLabel,
  type FieldLabelProps,
  FieldPropsProvider,
  FieldRequiredIndicator,
  type FieldRequiredIndicatorProps,
  FieldRoot,
  type FieldRootProps,
  useFieldContext,
  useFieldStyles,
} from "#field/field.ts";
export {
  Fieldset,
  FieldsetContent,
  type FieldsetContentProps,
  FieldsetContext,
  FieldsetErrorText,
  type FieldsetErrorTextProps,
  FieldsetHelperText,
  type FieldsetHelperTextProps,
  FieldsetLegend,
  type FieldsetLegendProps,
  FieldsetRoot,
  type FieldsetRootProps,
  useFieldsetContext,
} from "#fieldset/fieldset.ts";
