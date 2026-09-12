/**
 * Shows a short quotation set inside a line rather than pulled out of it.
 */

import { type Scene, specimen } from "@stealthscale/foundation-specimen";

import { Quote } from "#quote/quote.ts";
import { Text } from "#text/text.ts";

export const inSentence: Scene = {
  about:
    "The marks are the browser’s, so they follow the locale: a quotation in German opens low, and nothing here has to know that.",
  draw: () => (
    <Text maxW="md">
      The clerk wrote <Quote>received in full</Quote> across the foot of it.
    </Text>
  ),
  title: "In a sentence",
};

export default specimen({
  about:
    "A short quotation inside a line, with the marks the locale uses. Reach for a blockquote where the quotation is long enough to stand on its own.",
  group: "Typography",
  id: "typography/quote",
  scenes: [inSentence],
  title: "Quote",
});
