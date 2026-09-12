/**
 * Shows the QR code at every size, and with a mark laid over the middle of it.
 */

import { Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { Image } from "#image/image.ts";
import { QrCodeFrame, QrCodeOverlay, QrCodePattern, QrCodeRoot } from "#qr-code/qr-code.ts";

/**
 * How large the code is drawn.
 */
const SIZES = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl"] as const;

/**
 * What the code encodes.
 */
const VALUE = "https://ark-ui.com";

/**
 * A mark to sit in the middle, as a data URL so the specimen needs no asset.
 */
const MARK = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect width="48" height="48" rx="10" fill="#111"/>
    <path d="M24 12 12 18l12 6 12-6-12-6Zm0 12-12 6 12 6 12-6-12-6Z" fill="#fff"/>
  </svg>`,
)}`;

export const sizes: Scene = {
  about:
    "The pattern is the same at every size; what changes is how much room each module gets. The small end is the one to look at, because a code whose modules fall below a camera’s resolution stops being scannable long before it stops being legible.",
  draw: () => (
    <Matrix direction="row" gap="6" knob="size" of={SIZES}>
      {(size) => (
        <QrCodeRoot size={size} value={VALUE}>
          <QrCodeFrame>
            <QrCodePattern />
          </QrCodeFrame>
        </QrCodeRoot>
      )}
    </Matrix>
  ),
  title: "Sizes",
};

export const overlay: Scene = {
  about:
    "An overlay punches a hole in the pattern, so the error correction has to be raised to `H` before the code still scans. Laying a mark over a code left at the default is how a working code becomes a decorative one.",
  draw: () => (
    <QrCodeRoot encoding={{ ecc: "H" }} size="xl" value={VALUE}>
      <QrCodeFrame>
        <QrCodePattern />
      </QrCodeFrame>
      <QrCodeOverlay>
        <Image alt="The mark" src={MARK} />
      </QrCodeOverlay>
    </QrCodeRoot>
  ),
  title: "With a mark over it",
};

export default specimen({
  about:
    "Encodes a value as a scannable pattern, optionally with a mark laid over the middle of it.",
  group: "Media",
  id: "media/qr-code",
  scenes: [sizes, overlay],
  title: "QR code",
});
