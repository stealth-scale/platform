/**
 * Presents a body of something: markdown, a diff, a document, a record about a thing.
 *
 * Every component here is Chakra's under this design system's own name, so an application imports
 * the styling engine nowhere. That is the seam the theme's provider is: the engine underneath stays
 * this repository's to change.
 *
 * @packageDocumentation
 */

export {
  CodeBlock,
  type CodeBlockAdapter,
  CodeBlockAdapterProvider,
  CodeBlockCode,
  type CodeBlockCodeProps,
  CodeBlockCodeText,
  type CodeBlockCodeTextProps,
  CodeBlockCollapseIndicator,
  type CodeBlockCollapseIndicatorProps,
  CodeBlockCollapseText,
  type CodeBlockCollapseTextProps,
  CodeBlockCollapseTrigger,
  type CodeBlockCollapseTriggerProps,
  CodeBlockContent,
  type CodeBlockContentProps,
  CodeBlockContext,
  type CodeBlockContextProps,
  CodeBlockControl,
  type CodeBlockControlProps,
  CodeBlockCopyIndicator,
  type CodeBlockCopyIndicatorProps,
  CodeBlockCopyTrigger,
  type CodeBlockCopyTriggerProps,
  CodeBlockFooter,
  type CodeBlockFooterProps,
  CodeBlockHeader,
  type CodeBlockHeaderProps,
  CodeBlockOverlay,
  type CodeBlockOverlayProps,
  CodeBlockRoot,
  type CodeBlockRootProps,
  CodeBlockTitle,
  type CodeBlockTitleProps,
  createHighlightJsAdapter,
  createShikiAdapter,
  type HighlightJsAdapterOptions,
  plainTextAdapter,
  type ShikiAdapterOptions,
} from "#code-block/code-block.ts";
export {
  Marquee,
  MarqueeContent,
  type MarqueeContentProps,
  MarqueeEdge,
  type MarqueeEdgeProps,
  MarqueeItem,
  type MarqueeItemProps,
  MarqueePropsProvider,
  MarqueeRoot,
  type MarqueeRootProps,
  MarqueeRootProvider,
  type MarqueeRootProviderProps,
  MarqueeViewport,
  type MarqueeViewportProps,
  useMarquee,
  useMarqueeContext,
  type UseMarqueeContext,
  type UseMarqueeProps,
  type UseMarqueeReturn,
  useMarqueeStyles,
} from "#marquee/marquee.ts";
