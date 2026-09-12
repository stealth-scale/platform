/**
 * What a specimen is written with, and what a catalogue is configured with.
 *
 * A leaf on purpose. It reaches for the styling factory and for nothing this kit publishes, so a
 * component package can depend on it to document itself without the package that documents it
 * depending back.
 *
 * @packageDocumentation
 */

export { Box, type BoxProps } from "#box.tsx";
export { Caption, type CaptionProps } from "#caption.tsx";
export { type Catalogue, defineCatalogue, type Wearable } from "#catalogue.ts";
export { collect, type Documented, type Found, headingOf } from "#collect.ts";
export { Column, type ColumnProps } from "#column.tsx";
export { Field, type FieldProps } from "#field.tsx";
export { Matrix, type MatrixProps } from "#matrix.tsx";
export { MEASURE } from "#measure.ts";
export { Prose, type ProseProps } from "#prose.tsx";
export { Row, type RowProps } from "#row.tsx";
export { Section, type SectionProps } from "#section.tsx";
export { type Scene, scene, type Specimen, specimen } from "#specimen.ts";
export { Text, type TextProps } from "#text.tsx";
export { Trigger, type TriggerProps } from "#trigger.tsx";
