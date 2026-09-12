/**
 * Measures contrast the way WCAG does. This is the number 1.4.3, 1.4.6 and 1.4.11 are written
 * against, and the only way to tell a palette that looks deliberate from one a reader cannot use.
 *
 * Ported rather than taken from a colour library: the whole of what is needed is two matrices, a
 * gamma curve and a dot product, where a general library is forty kilobytes shipped to every
 * consumer for a fraction of its surface.
 *
 * It reads the four ways a colour reaches a caller. A theme writes OKLCH with a percentage, a
 * browser hands the same colour back with the lightness scaled to one, and anything inherited from
 * Chakra arrives as hex or as the `rgb()` a browser serialises it to. A checker that reads only the
 * first of those is a checker that answers `NaN` for most of a real page.
 */

/**
 * Names a colour in linear sRGB, where each channel runs 0 to 1 and a value outside that is a
 * colour the display cannot show as written.
 */
interface Linear {
  /**
   * The blue channel.
   */
  blue: number;
  /**
   * The green channel.
   */
  green: number;
  /**
   * The red channel.
   */
  red: number;
}

/**
 * Matches an OKLCH colour, whether the lightness carries a percentage or runs 0 to 1.
 */
const OKLCH = /^oklch\(\s*(?<lightness>[\d.]+)(?<percent>%)?\s+(?<chroma>[\d.]+)\s+(?<hue>[\d.]+)/u;

/**
 * Matches a hex colour of three, four, six or eight digits.
 */
const HEX = /^#(?<digits>[\da-f]{3,8})$/iu;

/**
 * Matches the `rgb()` a browser serialises a colour to, comma-separated or not.
 */
const RGB = /^rgba?\(\s*(?<red>[\d.]+)[\s,]+(?<green>[\d.]+)[\s,]+(?<blue>[\d.]+)/u;

/**
 * Holds the ratio normal text has to clear at each level.
 *
 * Large text clears at 3 and 4.5, which is a judgement about the type rather than about the
 * colours, so a caller measuring a heading compares the ratio itself.
 */
const LEVELS = { AA: 4.5, AAA: 7 };

/**
 * Names how much contrast is being asked for.
 */
export type Level = keyof typeof LEVELS;

/**
 * Undoes the sRGB transfer curve, so a channel a display was told to show becomes the light it
 * actually emits.
 *
 * OKLCH needs none of this, which is why the OKLCH path skips it: the conversion out of OKLCH lands
 * in linear light already, and decoding it again would be undoing a step never taken.
 *
 * @param channel - One channel, 0 to 1, as a stylesheet writes it.
 * @returns The same channel in linear light.
 */
function decoded(channel: number): number {
  return channel <= 0.040_45 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

/**
 * Reads an OKLCH colour into linear sRGB, unclamped.
 *
 * Unclamped on purpose: a channel outside 0 to 1 is a colour outside the display's gamut, and
 * flattening it here would report a contrast the reader never sees. The matrices are Björn
 * Ottosson's.
 *
 * @param colour - The colour, as CSS writes it.
 * @returns The colour in linear sRGB, or nothing where the value is not OKLCH.
 */
function oklchOf(colour: string): Linear | undefined {
  const read = OKLCH.exec(colour)?.groups;
  if (read === undefined) return undefined;

  // A percentage runs to a hundred and a bare number runs to one. CSS accepts both and a browser
  // hands back the second, so the two have to be told apart rather than assumed.
  const lightness = Number(read["lightness"]) / (read["percent"] === undefined ? 1 : 100);
  const chroma = Number(read["chroma"]);
  const radians = (Number(read["hue"]) * Math.PI) / 180;
  const a = chroma * Math.cos(radians);
  const b = chroma * Math.sin(radians);

  const long = (lightness + 0.396_337_777_4 * a + 0.215_803_757_3 * b) ** 3;
  const medium = (lightness - 0.105_561_345_8 * a - 0.063_854_172_8 * b) ** 3;
  const short = (lightness - 0.089_484_177_5 * a - 1.291_485_548 * b) ** 3;

  return {
    blue: -0.004_196_086_3 * long - 0.703_418_614_7 * medium + 1.707_614_701 * short,
    green: -1.268_438_004_6 * long + 2.609_757_401_1 * medium - 0.341_319_396_5 * short,
    red: 4.076_741_662_1 * long - 3.307_711_591_3 * medium + 0.230_969_929_2 * short,
  };
}

/**
 * Widens a three or four digit hex to six or eight, which is what pairing the digits means.
 *
 * @param digits - The digits, without the hash.
 * @returns The same colour, a byte per channel.
 */
function widened(digits: string): string {
  return digits.length > 4 ? digits : digits.replaceAll(/([\da-f])/giu, "$1$1");
}

/**
 * Reads one channel out of a six or eight digit hex.
 *
 * @param digits - The widened digits, without the hash.
 * @param index - Where the channel's pair of digits starts.
 * @returns The channel in linear light.
 */
function byteAt(digits: string, index: number): number {
  return decoded(Number.parseInt(digits.slice(index, index + 2), 16) / 255);
}

/**
 * Reads a hex or `rgb()` colour into linear sRGB.
 *
 * @param colour - The colour, as CSS writes it.
 * @returns The colour in linear sRGB, or nothing where the value is neither.
 */
function srgbOf(colour: string): Linear | undefined {
  const digits = HEX.exec(colour)?.groups?.["digits"];

  if (digits !== undefined) {
    const bytes = widened(digits);

    return {
      blue: byteAt(bytes, 4),
      green: byteAt(bytes, 2),
      red: byteAt(bytes, 0),
    };
  }

  const read = RGB.exec(colour)?.groups;
  if (read === undefined) return undefined;

  return {
    blue: decoded(Number(read["blue"]) / 255),
    green: decoded(Number(read["green"]) / 255),
    red: decoded(Number(read["red"]) / 255),
  };
}

/**
 * Measures relative luminance as WCAG defines it.
 *
 * @param colour - The colour, as CSS writes it: OKLCH, hex or `rgb()`.
 * @returns The luminance, 0 for black and 1 for white, or `NaN` for an unreadable colour.
 */
export function luminance(colour: string): number {
  const linear = oklchOf(colour) ?? srgbOf(colour);
  if (linear === undefined) return Number.NaN;

  return 0.2126 * linear.red + 0.7152 * linear.green + 0.0722 * linear.blue;
}

/**
 * Measures the contrast ratio between two colours, from 1 to 21.
 *
 * The order does not matter: the ratio is the same whichever colour is in front, and the two do not
 * have to be written the same way.
 *
 * @param foreground - The text colour.
 * @param background - The colour behind it.
 * @returns The ratio, or `NaN` where either colour cannot be read, so a caller tells "unreadable"
 *   from "not measured".
 */
export function contrast(foreground: string, background: string): number {
  const front = luminance(foreground);
  const back = luminance(background);
  if (Number.isNaN(front) || Number.isNaN(back)) return Number.NaN;

  const [darker, lighter] = front < back ? [front, back] : [back, front];
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Answers whether text of one colour can be read on another.
 *
 * @param foreground - The text colour.
 * @param background - The colour behind it.
 * @param level - How much contrast is being asked for. `AA` is what 1.4.3 requires of normal text
 *   and `AAA` what 1.4.6 does.
 * @returns `true` when the pair clears the level. A colour that cannot be read clears nothing.
 */
export function readable(foreground: string, background: string, level: Level = "AA"): boolean {
  return contrast(foreground, background) >= LEVELS[level];
}
