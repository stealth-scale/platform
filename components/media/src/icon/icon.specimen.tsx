/**
 * Shows the wrapper that makes a borrowed glyph take this kit's sizes and colours.
 */

import {
  ArrowRightIcon,
  BellIcon,
  CalendarIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  DownloadIcon,
  FileTextIcon,
  SearchIcon,
  SettingsIcon,
  TrashIcon,
  TriangleAlertIcon,
  UserIcon,
} from "lucide-react";

import { Column, Matrix, Row, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Icon } from "#icon/icon.ts";

/**
 * How large the glyph is.
 */
const SIZES = ["inherit", "xs", "sm", "md", "lg", "xl", "2xl"] as const;

/**
 * A dozen of the glyphs this kit reaches for, so the wrapper is judged against a set rather than
 * against one shape.
 */
const GLYPHS = [
  SearchIcon,
  BellIcon,
  UserIcon,
  SettingsIcon,
  CalendarIcon,
  FileTextIcon,
  DownloadIcon,
  TrashIcon,
  ArrowRightIcon,
  CircleCheckIcon,
  CircleAlertIcon,
  TriangleAlertIcon,
];

/**
 * The inks a glyph is usually set in, against what each one means.
 */
const INKS = [
  { color: "fg", label: "fg" },
  { color: "fg.muted", label: "fg.muted" },
  { color: "colorPalette.fg", label: "colorPalette.fg" },
  { color: "fg.error", label: "fg.error" },
  { color: "fg.success", label: "fg.success" },
  { color: "fg.warning", label: "fg.warning" },
];

export const sizes: Scene = {
  about:
    "`inherit` is the default and the one worth checking: the glyph should be exactly as tall as the text beside it and the same colour, which is what `1em` and `currentColor` buy. A glyph given a size stops following the text and takes the kit’s scale instead.",
  draw: () => (
    <Matrix direction="row" gap="6" knob="size" of={SIZES}>
      {(size) => (
        <Icon size={size}>
          <CircleAlertIcon />
        </Icon>
      )}
    </Matrix>
  ),
  title: "Sizes",
};

export const glyphs: Scene = {
  about:
    "A set at one size, which is where an odd weight or a stray viewBox shows. One glyph on its own always looks right.",
  draw: () => (
    <Row gap="5">
      {GLYPHS.map((Glyph) => (
        <Icon key={Glyph.displayName} size="lg">
          <Glyph />
        </Icon>
      ))}
    </Row>
  ),
  title: "A set of glyphs",
};

export const inks: Scene = {
  about:
    "A glyph takes its colour from the text around it unless told otherwise, so setting one is stating that it means something the sentence does not.",
  draw: () => (
    <Matrix direction="row" gap="6" knob="color" label={(ink) => ink.label} of={INKS}>
      {(ink) => (
        <Icon color={ink.color} colorPalette="primary" size="lg">
          <CircleAlertIcon />
        </Icon>
      )}
    </Matrix>
  ),
  title: "Inks",
};

export const following: Scene = {
  about:
    "Left at `inherit`, the glyph is the height of the line it sits in. This is the case the wrapper exists for: a lucide icon dropped in raw is sixteen pixels whatever the text does.",
  draw: () => (
    <Column gap="3">
      {(["xs", "sm", "md"] as const).map((size) => (
        <Row gap="2" key={size}>
          <Icon>
            <CircleCheckIcon />
          </Icon>
          <Text size={size}>Four lines matched at {size}</Text>
        </Row>
      ))}
    </Column>
  ),
  title: "Following the text",
};

export default specimen({
  about:
    "Wraps a glyph borrowed from anywhere so it takes this kit’s sizes and this kit’s colours. Left alone it follows the text it sits in, which is what most of them should do.",
  group: "Media",
  id: "media/icon",
  scenes: [sizes, glyphs, inks, following],
  title: "Icon",
});
