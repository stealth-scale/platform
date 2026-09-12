/**
 * Shows the trail back up a hierarchy, in both variants and at every size.
 */

import { type ReactElement } from "react";

import { ChevronRightIcon } from "lucide-react";

import { Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  BreadcrumbCurrentLink,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbRoot,
  type BreadcrumbRootProps,
  BreadcrumbSeparator,
} from "#breadcrumb/breadcrumb.ts";

/**
 * How the links are drawn.
 */
const VARIANTS = ["plain", "underline"] as const;

/**
 * How large the trail is.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Draws the same trail, however the breadcrumb around it is set.
 *
 * @param props - Whichever of them the scene is turning. `BreadcrumbRootProps` documents every
 *   member.
 * @returns One trail, with a truncated middle.
 */
function Trail(props: BreadcrumbRootProps): ReactElement {
  return (
    <BreadcrumbRoot colorPalette="primary" {...props}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#ledger">Ledger</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRightIcon size={14} />
        </BreadcrumbSeparator>
        {/* The ellipsis is its own list item, so wrapping it in one nests `li` in `li`. */}
        <BreadcrumbEllipsis />
        <BreadcrumbSeparator>
          <ChevronRightIcon size={14} />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbCurrentLink>Payout 4109</BreadcrumbCurrentLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </BreadcrumbRoot>
  );
}

export const variants: Scene = {
  about:
    "Underline states the links as links; plain leaves them to their colour and their cursor. The step you are on is not a link in either, so it never takes the underline.",
  draw: () => (
    <Matrix gap="8" knob="variant" of={VARIANTS}>
      {(variant) => <Trail variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "The ellipsis stands where the collapsed steps were, and it has to sit on the same baseline as the links either side of it. Seeing all three sizes at once is what checks that.",
  draw: () => (
    <Matrix direction="row" gap="8" knob="size" of={SIZES}>
      {(size) => <Trail size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export default specimen({
  about:
    "The trail back up a hierarchy. The last step is the page you are on, so it is marked as current rather than linked.",
  group: "Navigation",
  id: "navigation/breadcrumb",
  scenes: [variants, sizes],
  title: "Breadcrumb",
});
