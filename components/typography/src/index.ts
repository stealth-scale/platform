/**
 * Draws the components that are text: a heading, a paragraph, a snippet of code, a key a reader is
 * asked to press.
 *
 * Every component here is Chakra's under this design system's own name, so an application imports
 * the styling engine nowhere. That is the seam the theme's provider is: the engine underneath stays
 * this repository's to change.
 *
 * @packageDocumentation
 */

export {
  Blockquote,
  BlockquoteCaption,
  type BlockquoteCaptionProps,
  BlockquoteContent,
  type BlockquoteContentProps,
  BlockquoteIcon,
  type BlockquoteIconProps,
  BlockquotePropsProvider,
  BlockquoteRoot,
  type BlockquoteRootProps,
  useBlockquoteStyles,
} from "#blockquote/blockquote.ts";
export { Code, type CodeProps, CodePropsProvider } from "#code/code.ts";
export { Em, type EmProps } from "#em/em.ts";
export {
  FormatByte,
  type FormatByteProps,
  FormatNumber,
  type FormatNumberProps,
} from "#format/format.ts";
export { Heading, type HeadingProps, HeadingPropsProvider } from "#heading/heading.ts";
export {
  Highlight,
  type HighlightChunk,
  type HighlightProps,
  useHighlight,
  type UseHighlightProps,
} from "#highlight/highlight.ts";
export { Kbd, type KbdProps } from "#kbd/kbd.ts";
export {
  List,
  ListIndicator,
  type ListIndicatorProps,
  ListItem,
  type ListItemProps,
  ListRoot,
  type ListRootProps,
  ListRootPropsProvider,
  useListStyles,
} from "#list/list.ts";
export { Mark, type MarkProps, MarkPropsProvider } from "#mark/mark.ts";
export { Quote, type QuoteProps } from "#quote/quote.ts";
export { Span, type SpanProps } from "#span/span.ts";
export { Strong, type StrongProps } from "#strong/strong.ts";
export { Text, type TextProps, TextPropsProvider } from "#text/text.ts";
