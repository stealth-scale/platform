/**
 * Shows the run of text that means nothing on its own.
 */

import { type Scene, specimen } from "@stealthscale/foundation-specimen";

import { Span } from "#span/span.ts";
import { Text } from "#text/text.ts";

export const inSentence: Scene = {
  about:
    "The one to reach for when the change is visual and nothing more. It says nothing to a screen reader, which is the whole point: a quieter colour is not emphasis.",
  draw: () => (
    <Text maxW="md">
      The offer was raised on Tuesday, <Span color="fg.muted">three days before it settled</Span>.
    </Text>
  ),
  title: "In a sentence",
};

export default specimen({
  about:
    "A run of text with no meaning attached, for a change that is only visual. Where the words matter more than the ones around them, reach for `Strong` or `Em` instead.",
  group: "Typography",
  id: "typography/span",
  scenes: [inSentence],
  title: "Span",
});
