/**
 * Shows importance inside a sentence, which is the only place it means anything.
 */

import { type Scene, specimen } from "@stealthscale/foundation-specimen";

import { Strong } from "#strong/strong.ts";
import { Text } from "#text/text.ts";

export const inSentence: Scene = {
  about:
    "Importance rather than weight. A screen reader can announce it, which is what separates it from setting a word bolder.",
  draw: () => (
    <Text maxW="md">
      The offer <Strong>settled on the Friday</Strong>, three days later.
    </Text>
  ),
  title: "In a sentence",
};

export default specimen({
  about:
    "Marks a run of text as important. Reach for it where the words carry more weight than the ones around them, and for a span where only the type does.",
  group: "Typography",
  id: "typography/strong",
  scenes: [inSentence],
  title: "Strong",
});
