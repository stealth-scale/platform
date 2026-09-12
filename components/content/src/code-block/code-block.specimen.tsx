/**
 * Shows the code block at every size, with the copy button and the collapse.
 */

import { CheckIcon, CopyIcon } from "lucide-react";

import { Column, Matrix, type Scene, specimen, Trigger } from "@stealthscale/foundation-specimen";

import {
  CodeBlockCode,
  CodeBlockCodeText,
  CodeBlockCollapseText,
  CodeBlockCollapseTrigger,
  CodeBlockContent,
  CodeBlockControl,
  CodeBlockCopyIndicator,
  CodeBlockCopyTrigger,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockOverlay,
  CodeBlockRoot,
  CodeBlockTitle,
} from "#code-block/code-block.ts";

/**
 * How large the code is set.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * What the block holds.
 */
const CODE = `import { AppProvider } from '@stealthscale/foundation-providers'
import { system } from '@stealthscale/theme-corporate'

export function App() {
  return <AppProvider system={system}>{children}</AppProvider>
}`;

/**
 * The same again, long enough that the collapse has something to hide.
 */
const LONG = [CODE, CODE, CODE].join("\n\n");

export const sizes: Scene = {
  about:
    "No adapter is set, so the code is drawn as plain text. Highlighting is the adapter’s job, and the block is the same shape with or without one — which is what lets a page ship without pulling a highlighter in.",
  draw: () => (
    <Column width="2xl">
      <Matrix gap="8" knob="size" of={SIZES}>
        {(size) => (
          <CodeBlockRoot code={CODE} language="tsx" size={size}>
            <CodeBlockHeader>
              <CodeBlockTitle>app.tsx</CodeBlockTitle>
              <CodeBlockControl>
                <CodeBlockCopyTrigger asChild>
                  <Trigger label="Copy" quiet>
                    <CodeBlockCopyIndicator copied={<CheckIcon size={14} />}>
                      <CopyIcon size={14} />
                    </CodeBlockCopyIndicator>
                  </Trigger>
                </CodeBlockCopyTrigger>
              </CodeBlockControl>
            </CodeBlockHeader>
            <CodeBlockContent>
              <CodeBlockCode>
                <CodeBlockCodeText />
              </CodeBlockCode>
            </CodeBlockContent>
          </CodeBlockRoot>
        )}
      </Matrix>
    </Column>
  ),
  title: "Sizes",
};

export const collapsed: Scene = {
  about:
    "Held to eight lines with the rest faded out under an overlay. The collapse text carries both wordings itself — one while it is shut and whatever it is given once it is open — so the trigger holds one part rather than a chevron beside a label.",
  draw: () => (
    <Column width="2xl">
      <CodeBlockRoot code={LONG} language="tsx" maxLines={8} size="sm">
        <CodeBlockContent>
          <CodeBlockCode>
            <CodeBlockCodeText />
          </CodeBlockCode>
          <CodeBlockOverlay />
        </CodeBlockContent>
        <CodeBlockFooter>
          <CodeBlockCollapseTrigger>
            <CodeBlockCollapseText>Show less</CodeBlockCollapseText>
          </CodeBlockCollapseTrigger>
        </CodeBlockFooter>
      </CodeBlockRoot>
    </Column>
  ),
  title: "Held to a few lines",
};

export default specimen({
  about:
    "A block of source with a title, a copy button and a collapse. Highlighting is an adapter’s job, so the block draws the same either way.",
  group: "Content",
  id: "content/code-block",
  scenes: [sizes, collapsed],
  title: "Code block",
});
