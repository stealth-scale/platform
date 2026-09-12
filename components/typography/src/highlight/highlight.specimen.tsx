/**
 * Shows a search term picked out of a sentence.
 */

import { Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { Highlight } from "#highlight/highlight.ts";
import { Text } from "#text/text.ts";

/**
 * What is searched for, from one word to several.
 */
const QUERIES: ReadonlyArray<readonly string[]> = [["offer"], ["offer", "settled"], ["the"]];

export const queries: Scene = {
  about:
    "One sentence against each query. The last one is the case worth having: `the` matches more than once and matches inside another word, which is where a highlighter that splits on the wrong boundary gives itself away.",
  draw: () => (
    <Matrix knob="query" label={(query) => query.join(", ")} of={QUERIES}>
      {(query) => (
        <Text maxW="md">
          <Highlight
            ignoreCase
            query={[...query]}
            styles={{ bg: "colorPalette.subtle", color: "colorPalette.fg", px: "0.5" }}
          >
            The offer was raised on Tuesday, and the offer settled on the Friday after.
          </Highlight>
        </Text>
      )}
    </Matrix>
  ),
  title: "Queries",
};

export default specimen({
  about:
    "Picks a search term out of a sentence without the caller having to split the sentence up. It takes one term or several, and marks every match rather than the first.",
  group: "Typography",
  id: "typography/highlight",
  scenes: [queries],
  title: "Highlight",
});
