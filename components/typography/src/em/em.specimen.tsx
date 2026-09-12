/**
 * Shows emphasis inside a sentence, which is the only place it means anything.
 */

import { type Scene, specimen } from "@stealthscale/foundation-specimen";

import { Em } from "#em/em.ts";
import { Text } from "#text/text.ts";

export const inSentence: Scene = {
  about:
    "Stress rather than italics. It comes out italic here because that is how English marks stress, and a locale that marks it another way is free to.",
  draw: () => (
    <Text maxW="md">
      The offer was <Em>raised</Em> on Tuesday, not accepted.
    </Text>
  ),
  title: "In a sentence",
};

export default specimen({
  about:
    "Marks a run of text as stressed. Reach for it where reading the sentence aloud would put weight on the word; reach for a span where the change is only visual.",
  group: "Typography",
  id: "typography/em",
  scenes: [inSentence],
  title: "Em",
});
