/**
 * Shows the link in both variants, and the box that makes a whole card one.
 */

import { ExternalLinkIcon } from "lucide-react";

import { Column, Matrix, Row, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Link, LinkBox, LinkOverlay } from "#link/link.ts";

/**
 * How a link is drawn.
 */
const VARIANTS = ["plain", "underline"] as const;

export const variants: Scene = {
  about:
    "Underline states that the words are a link; plain leaves them to their colour. Plain is only safe where the link is somewhere a reader already expects one, since colour alone is not something everybody can see.",
  draw: () => (
    <Matrix direction="row" gap="10" knob="variant" of={VARIANTS}>
      {(variant) => (
        <Row gap="4">
          <Link colorPalette="primary" href="#ledger" variant={variant}>
            Open the ledger
          </Link>
          <Link colorPalette="primary" href="https://ark-ui.com" variant={variant}>
            Ark UI <ExternalLinkIcon size={14} />
          </Link>
        </Row>
      )}
    </Matrix>
  ),
  title: "Variants",
};

export const box: Scene = {
  about:
    "The heading is the only anchor, but the click target covers the whole card — and the text inside it stays selectable, which is what separates this from wrapping everything in an anchor.",
  draw: () => (
    <Column gap="2" width="sm">
      <LinkBox
        _hover={{ bg: "bg.subtle" }}
        borderColor="border"
        borderRadius="l3"
        borderWidth="1px"
        p="5"
      >
        <Column gap="1">
          <LinkOverlay colorPalette="primary" fontWeight="medium" href="#payout">
            Payout 4109
          </LinkOverlay>
          <Text muted>Settled on Friday, against four matched lines.</Text>
          <Text muted size="xs">
            The whole card follows the link.
          </Text>
        </Column>
      </LinkBox>
    </Column>
  ),
  title: "A whole card as a link",
};

export default specimen({
  about:
    "Somewhere to go. `LinkBox` is what makes a whole card one without nesting anchors or losing the ability to select the text inside it.",
  group: "Navigation",
  id: "navigation/link",
  scenes: [variants, box],
  title: "Link",
});
