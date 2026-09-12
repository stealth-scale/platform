/**
 * Shows the image in each way it can fill the box it is given.
 */

import { Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { Image } from "#image/image.ts";

/**
 * How the picture fills a box that is not its own shape.
 */
const FITS = ["fill", "contain", "cover", "none", "scale-down"] as const;

/**
 * A wide SVG data URL, so the specimen needs no asset on disk.
 */
const PICTURE = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="240">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3b82f6"/><stop offset="1" stop-color="#a855f7"/>
    </linearGradient></defs>
    <rect width="480" height="240" fill="url(#g)"/>
    <circle cx="120" cy="120" r="70" fill="#fff" opacity="0.85"/>
  </svg>`,
)}`;

export const fits: Scene = {
  about:
    "The same wide picture in a square box, once per fit. The box is deliberately the wrong shape for the picture, because that is the only condition under which the fits differ at all.",
  draw: () => (
    <Matrix direction="row" gap="6" knob="objectFit" of={FITS}>
      {(fit) => (
        <Image
          alt="A generated gradient"
          borderColor="border"
          borderRadius="l2"
          borderWidth="1px"
          boxSize="8rem"
          objectFit={fit}
          src={PICTURE}
        />
      )}
    </Matrix>
  ),
  title: "Fits",
};

export default specimen({
  about:
    "A picture, and what happens to it when the box it is given is not its shape. Everything else about it is the element the browser already has.",
  group: "Media",
  id: "media/image",
  scenes: [fits],
  title: "Image",
});
