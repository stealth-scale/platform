/**
 * Shows the avatar in every variant, shape and size, and stacked into a group.
 */

import { Column, Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  AvatarFallback,
  AvatarGroup,
  AvatarIcon,
  AvatarImage,
  AvatarRoot,
} from "#avatar/avatar.ts";

/**
 * How the fallback is filled.
 */
const VARIANTS = ["subtle", "solid", "outline"] as const;

/**
 * How the edges are cut.
 */
const SHAPES = ["full", "rounded", "square"] as const;

/**
 * How large it is.
 */
const SIZES = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl"] as const;

/**
 * Who is in the group.
 */
const PEOPLE = ["Ada Okafor", "Bram Voss", "Cleo Han", "Devi Rao"];

/**
 * A picture, so one avatar shows the image rather than the initials behind it.
 */
const PORTRAIT = "https://i.pravatar.cc/150?u=stealthscale";

export const variants: Scene = {
  about:
    "Drawn from initials rather than from a picture, because that is the only state the variants change: an avatar with an image loaded looks the same in all three.",
  draw: () => (
    <Matrix knob="variant" of={VARIANTS}>
      {(variant) => (
        <AvatarRoot colorPalette="primary" variant={variant}>
          <AvatarFallback name="Ada Okafor" />
        </AvatarRoot>
      )}
    </Matrix>
  ),
  title: "Variants",
};

export const shapes: Scene = {
  about:
    "How much of the corner is cut. Full is the one a person expects for a person; square is for anything that is not one — an organisation, a service, a bot.",
  draw: () => (
    <Matrix direction="row" gap="6" knob="shape" of={SHAPES}>
      {(shape) => (
        <AvatarRoot colorPalette="primary" shape={shape}>
          <AvatarFallback name="Ada Okafor" />
        </AvatarRoot>
      )}
    </Matrix>
  ),
  title: "Shapes",
};

export const sizes: Scene = {
  about:
    "Carrying a picture this time, so the crop can be judged as well as the diameter. The initials sit behind the image and show through only while it is loading or if it never arrives.",
  draw: () => (
    <Matrix direction="row" gap="4" knob="size" of={SIZES}>
      {(size) => (
        <AvatarRoot colorPalette="primary" size={size}>
          <AvatarFallback name="Ada Okafor" />
          <AvatarImage alt="Ada Okafor" src={PORTRAIT} />
        </AvatarRoot>
      )}
    </Matrix>
  ),
  title: "Sizes",
};

export const stacked: Scene = {
  about:
    "A group overlaps its avatars by a fixed amount, which reads at `lg` and swallows the initials at `sm`. Every avatar in one needs a fill for the overlap to show, so the counted overflow at the end is `subtle` rather than `outline` — an outline avatar is transparent and the one behind it shows straight through.",
  draw: () => (
    <Column gap="4">
      <AvatarGroup size="lg">
        {PEOPLE.map((person) => (
          <AvatarRoot colorPalette="primary" key={person}>
            <AvatarFallback name={person} />
          </AvatarRoot>
        ))}
        <AvatarRoot variant="subtle">
          <AvatarFallback>+8</AvatarFallback>
        </AvatarRoot>
      </AvatarGroup>

      <AvatarGroup size="lg">
        {PEOPLE.slice(0, 3).map((person) => (
          <AvatarRoot key={person}>
            <AvatarFallback name={person} />
            <AvatarImage alt={person} src={`${PORTRAIT}-${person}`} />
          </AvatarRoot>
        ))}
        <AvatarRoot variant="subtle">
          <AvatarIcon />
        </AvatarRoot>
      </AvatarGroup>
    </Column>
  ),
  title: "Stacked into a group",
};

export default specimen({
  about:
    "Stands for a person. It falls back to their initials, and then to a generic mark, so it always draws something.",
  group: "Media",
  id: "media/avatar",
  scenes: [variants, shapes, sizes, stacked],
  title: "Avatar",
});
