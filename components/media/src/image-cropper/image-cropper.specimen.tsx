/**
 * Shows the image cropper over a generated picture, in both crop shapes.
 */

import { type ReactElement, useState } from "react";

import { Column, Matrix, type Scene, specimen, Trigger } from "@stealthscale/foundation-specimen";

import {
  ImageCropperGrid,
  ImageCropperHandle,
  type ImageCropperHandlePosition,
  ImageCropperImage,
  ImageCropperRoot,
  ImageCropperSelection,
  ImageCropperViewport,
} from "#image-cropper/image-cropper.ts";

/**
 * Names the eight handles, so every edge and corner can be dragged.
 */
const HANDLES: readonly ImageCropperHandlePosition[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

/**
 * What the crop can be cut to.
 */
const SHAPES = ["rectangle", "circle"] as const;

/**
 * An SVG data URL, so the scene needs no asset on disk and still has something to crop.
 */
const PICTURE = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3b82f6"/><stop offset="1" stop-color="#a855f7"/>
    </linearGradient></defs>
    <rect width="640" height="480" fill="url(#g)"/>
    <circle cx="220" cy="180" r="90" fill="#fff" opacity="0.85"/>
    <rect x="360" y="260" width="200" height="140" fill="#111" opacity="0.7"/>
  </svg>`,
)}`;

/**
 * Draws one cropper, with a button that zooms the picture under the crop.
 *
 * @param props - The shape and size the crop is cut to.
 * @returns The cropper and the control that zooms it.
 */
function Cropper(props: { shape: (typeof SHAPES)[number] }): ReactElement {
  const [zoom, setZoom] = useState(1);

  return (
    <Column gap="3">
      <Trigger
        onClick={() => {
          setZoom(zoom === 1 ? 1.6 : 1);
        }}
        quiet
      >
        Zoom {zoom === 1 ? "in" : "out"}
      </Trigger>

      <ImageCropperRoot
        colorPalette="primary"
        cropShape={props.shape}
        size="sm"
        zoom={zoom}
        zoomStep={0.2}
      >
        <ImageCropperViewport>
          <ImageCropperImage alt="A generated gradient" src={PICTURE} />
          <ImageCropperSelection>
            {HANDLES.map((position) => (
              <ImageCropperHandle key={position} position={position} />
            ))}
            <ImageCropperGrid axis="horizontal" />
            <ImageCropperGrid axis="vertical" />
          </ImageCropperSelection>
        </ImageCropperViewport>
      </ImageCropperRoot>
    </Column>
  );
}

export const shapes: Scene = {
  about:
    "Drag inside the box to move the crop, or a handle to resize it. Zooming is what shows the scrim and the handles doing their work: the crop stays where it is while the picture moves under it. The circular crop is the one to watch — the handles still sit on a square, because the box being resized is square whatever shape is cut out of it.",
  draw: () => (
    <Matrix direction="row" gap="10" knob="cropShape" of={SHAPES}>
      {(shape) => <Cropper shape={shape} />}
    </Matrix>
  ),
  title: "Crop shapes",
};

export default specimen({
  about:
    "A crop over a picture, moved and resized by the reader, with the picture zoomable underneath. What it hands back is the region rather than a new picture.",
  group: "Media",
  id: "media/image-cropper",
  scenes: [shapes],
  title: "Image cropper",
});
