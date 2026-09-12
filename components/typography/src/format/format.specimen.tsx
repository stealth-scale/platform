/**
 * Shows a figure and a file size written out the way the reader's locale writes them.
 */

import { Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { FormatByte, FormatNumber } from "#format/format.ts";
import { Text } from "#text/text.ts";

/**
 * The ways a figure can be written, against what each is for.
 */
const FORMATS = [
  { label: "currency", options: { currency: "EUR", style: "currency" }, value: 1_056_430.5 },
  { label: "percent", options: { style: "percent" }, value: 0.0725 },
  { label: "decimal", options: { maximumFractionDigits: 2 }, value: 1_056_430.5 },
  { label: "unit", options: { style: "unit", unit: "day" }, value: 30 },
  { label: "compact", options: { notation: "compact" }, value: 1_056_430.5 },
] as const;

/**
 * The units a file size is written in.
 */
const SIZES = ["byte", "bit"] as const;

export const figures: Scene = {
  about:
    "Nothing here states a separator, a symbol or where the symbol sits. All of that comes from the locale in scope, which the application sets once for the whole page — so switch the catalogue’s locale and every figure below is written again.",
  draw: () => (
    <Matrix knob="style" label={(format) => format.label} of={FORMATS}>
      {(format) => (
        <Text fontVariantNumeric="tabular-nums">
          <FormatNumber {...format.options} value={format.value} />
        </Text>
      )}
    </Matrix>
  ),
  title: "Figures",
};

export const sizes: Scene = {
  about:
    "A file size, which is a figure with a unit that changes as the figure grows. Bits and bytes are counted the same way and named differently, and getting that wrong is the classic off-by-eight.",
  draw: () => (
    <Matrix direction="row" gap="8" knob="unit" of={SIZES}>
      {(unit) => (
        <Text fontVariantNumeric="tabular-nums">
          <FormatByte unit={unit} value={1_450_000} />
        </Text>
      )}
    </Matrix>
  ),
  title: "File sizes",
};

export default specimen({
  about:
    "Writes a figure the way the reader’s locale writes it — the separators, the symbol and where it sits. Nothing about the format is stated here; it comes from the locale in scope.",
  group: "Typography",
  id: "typography/format",
  scenes: [figures, sizes],
  title: "Format",
});
