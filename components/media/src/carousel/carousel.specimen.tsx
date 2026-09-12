/**
 * Shows the carousel in both orientations, and with more than one slide in view.
 */

import { type ReactElement } from "react";

import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from "lucide-react";

import { Box, Matrix, Row, type Scene, specimen, Trigger } from "@stealthscale/foundation-specimen";

import {
  CarouselAutoplayIndicator,
  CarouselAutoplayTrigger,
  CarouselControl,
  CarouselIndicatorGroup,
  CarouselIndicators,
  CarouselItem,
  CarouselItemGroup,
  CarouselNextTrigger,
  CarouselPrevTrigger,
  CarouselProgressText,
  CarouselRoot,
  type CarouselRootProps,
} from "#carousel/carousel.ts";
import { Image } from "#image/image.ts";

/**
 * What is on the slides.
 *
 * A carousel of grey boxes says nothing about a carousel. Pictures are what it is nearly always
 * used for, and they are what show whether a slide is clipped at the edge of the viewport.
 */
const SLIDES = [
  { hue: 217, title: "Ledger" },
  { hue: 271, title: "Payouts" },
  { hue: 24, title: "Exports" },
  { hue: 142, title: "Archive" },
  { hue: 340, title: "Queries" },
];

/**
 * Which way it scrolls.
 */
const ORIENTATIONS = ["horizontal", "vertical"] as const;

/**
 * Paints one slide, as an SVG data URL, so the scene needs no asset on disk.
 *
 * @param hue - Where on the wheel the gradient starts.
 * @returns A picture, as a data URL.
 */
function picture(hue: number): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="hsl(${String(hue)} 80% 62%)"/>
        <stop offset="1" stop-color="hsl(${String((hue + 40) % 360)} 70% 42%)"/>
      </linearGradient></defs>
      <rect width="480" height="320" fill="url(#g)"/>
      <circle cx="120" cy="90" r="60" fill="#fff" opacity="0.18"/>
      <circle cx="380" cy="250" r="90" fill="#000" opacity="0.12"/>
    </svg>`,
  )}`;
}

/**
 * Draws the row under the slides: the paging at one end, the dots in the middle, the count and the
 * pause at the other.
 *
 * Read left to right rather than as four controls of different heights in a line.
 *
 * @returns The row under the slides.
 */
function Controls(): ReactElement {
  return (
    <CarouselControl alignItems="center" justifyContent="space-between">
      <Row gap="1">
        <CarouselPrevTrigger asChild>
          <Trigger label="Previous slide" quiet>
            <ChevronLeftIcon size={16} />
          </Trigger>
        </CarouselPrevTrigger>
        <CarouselNextTrigger asChild>
          <Trigger label="Next slide" quiet>
            <ChevronRightIcon size={16} />
          </Trigger>
        </CarouselNextTrigger>
      </Row>

      <CarouselIndicatorGroup alignItems="center" display="flex" gap="1.5">
        <CarouselIndicators />
      </CarouselIndicatorGroup>

      <Row gap="2">
        <CarouselProgressText color="fg.muted" textStyle="xs" />
        <CarouselAutoplayTrigger asChild>
          <Trigger label="Play or pause" quiet>
            <CarouselAutoplayIndicator
              paused={<PauseIcon size={16} />}
              play={<PlayIcon size={16} />}
            />
          </Trigger>
        </CarouselAutoplayTrigger>
      </Row>
    </CarouselControl>
  );
}

/**
 * Draws one carousel, with the controls under it.
 *
 * Autoplay belongs on the root, and the trigger only pauses what the root has started. Every
 * carousel here plays, because several on one page is ordinary and they do not interfere: each has
 * its own machine, its own id and its own timer.
 *
 * The indicator names the action rather than the state — play is drawn while it is paused — so
 * reading the pair the other way round shows every running carousel a play button.
 *
 * @param props - Whichever of them the scene is turning. `CarouselRootProps` documents every
 *   member.
 * @returns One carousel.
 */
function Slides(props: Omit<CarouselRootProps, "children" | "slideCount">): ReactElement {
  return (
    <CarouselRoot
      allowMouseDrag
      autoplay
      colorPalette="primary"
      defaultPage={0}
      loop
      slideCount={SLIDES.length}
      width="20rem"
      {...props}
    >
      <CarouselItemGroup flex="1">
        {SLIDES.map((slide, index) => (
          <CarouselItem index={index} key={slide.title}>
            <Image
              alt={slide.title}
              borderRadius="l2"
              height="9rem"
              objectFit="cover"
              src={picture(slide.hue)}
              width="full"
            />
          </CarouselItem>
        ))}
      </CarouselItemGroup>

      <Controls />
    </CarouselRoot>
  );
}

export const orientations: Scene = {
  about:
    "Running down, it needs a height from whatever holds it: the slides are then stacked and there is nothing else to measure the viewport against.",
  draw: () => (
    <Matrix direction="row" gap="12" knob="orientation" of={ORIENTATIONS}>
      {(orientation) =>
        orientation === "vertical" ? (
          <Box height="20rem" pad="0">
            <Slides height="full" orientation="vertical" />
          </Box>
        ) : (
          <Slides orientation="horizontal" />
        )
      }
    </Matrix>
  ),
  title: "Orientations",
};

export const several: Scene = {
  about:
    "Two in view is where the spacing has to be right: the gap between slides belongs to the carousel rather than to the slide, and it only shows itself once more than one is on screen. Moving one at a time rather than a page at a time is the other half of that.",
  draw: () => <Slides slidesPerMove={1} slidesPerPage={2} width="32rem" />,
  title: "More than one in view",
};

export default specimen({
  about:
    "Slides that scroll, drag and page, with dots, a count and a pause. Every one plays on its own timer, so several on a page do not interfere.",
  group: "Media",
  id: "media/carousel",
  scenes: [orientations, several],
  title: "Carousel",
});
