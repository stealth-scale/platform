/**
 * Shows the menu in both variants and both sizes, with every kind of item it can hold.
 */

import { type ReactElement } from "react";

import { ChevronRightIcon } from "lucide-react";

import { Box, Matrix, type Scene, specimen, Trigger } from "@stealthscale/foundation-specimen";

import {
  MenuArrow,
  MenuArrowTip,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuItemCommand,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuItemIndicator,
  MenuItemText,
  MenuPositioner,
  MenuRadioItem,
  MenuRadioItemGroup,
  MenuRoot,
  type MenuRootProps,
  MenuSeparator,
  MenuTrigger,
  MenuTriggerItem,
} from "#menu/menu.ts";

/**
 * How the highlighted item is drawn.
 */
const VARIANTS = ["subtle", "solid"] as const;

/**
 * How large the items are.
 */
const SIZES = ["sm", "md"] as const;

/**
 * What the submenu offers.
 */
const FORMATS = ["CSV", "JSON", "PDF"];

/**
 * Describes what one menu is styled by.
 */
type StyledProps = Pick<MenuRootProps, "open" | "size" | "variant">;

/**
 * Draws the submenu, which is a whole menu again under one item of the outer one.
 *
 * Only the styling is inherited: whether the outer menu is open says nothing about this one.
 *
 * @param props - The styling, passed through so the submenu matches the menu that holds it.
 * @returns One item, and the menu it opens beside itself.
 */
function Exports(props: StyledProps): ReactElement {
  return (
    <MenuRoot {...props} positioning={{ gutter: -2, placement: "right-start" }}>
      <MenuTriggerItem>
        Export
        <ChevronRightIcon size={14} />
      </MenuTriggerItem>
      <MenuPositioner>
        <MenuContent>
          {FORMATS.map((format) => (
            <MenuItem key={format} value={format}>
              {format}
            </MenuItem>
          ))}
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  );
}

/**
 * Draws one menu behind a button, holding a plain item, a checkbox, a radio set and a submenu.
 *
 * Every kind of item is in the one menu because they have to line up: the indicator column is the
 * same width for all of them, and a plain item with no indicator still has to sit in it.
 *
 * @param props - The styling, passed through to `MenuRoot`.
 * @returns The button, and the menu it opens.
 */
function Actions(props: StyledProps): ReactElement {
  return (
    <MenuRoot {...props}>
      <MenuTrigger asChild>
        <Trigger>Actions</Trigger>
      </MenuTrigger>
      <MenuPositioner>
        <MenuContent colorPalette="primary">
          <MenuArrow>
            <MenuArrowTip />
          </MenuArrow>
          <MenuItemGroup>
            <MenuItemGroupLabel>Payout</MenuItemGroupLabel>
            <MenuItem value="release">
              <MenuItemText>Release</MenuItemText>
              <MenuItemCommand>⌘R</MenuItemCommand>
            </MenuItem>
            <MenuItem value="hold">
              <MenuItemText>Hold</MenuItemText>
              <MenuItemCommand>⌘H</MenuItemCommand>
            </MenuItem>
            <MenuItem color="fg.error" value="void">
              Void
            </MenuItem>
          </MenuItemGroup>

          <MenuSeparator />

          <MenuCheckboxItem checked value="notify">
            <MenuItemIndicator />
            <MenuItemText>Notify the account</MenuItemText>
          </MenuCheckboxItem>

          <MenuSeparator />

          <MenuRadioItemGroup value="week">
            <MenuItemGroupLabel>Window</MenuItemGroupLabel>
            <MenuRadioItem value="week">
              <MenuItemIndicator />
              <MenuItemText>This week</MenuItemText>
            </MenuRadioItem>
            <MenuRadioItem value="month">
              <MenuItemIndicator />
              <MenuItemText>This month</MenuItemText>
            </MenuRadioItem>
          </MenuRadioItemGroup>

          <MenuSeparator />

          <Exports size={props.size} variant={props.variant} />
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  );
}

/**
 * Gives one open menu the room its panel needs, and something to anchor against.
 *
 * A menu positions itself against the nearest positioned ancestor, so several in a row with nothing
 * between them all anchor to the same box and stack on top of one another.
 *
 * @param props - The styling of the menu inside it.
 * @returns One cell holding one open menu.
 */
function Cell(props: StyledProps): ReactElement {
  return (
    <Box anchor height="32rem" pad="0" width="13rem">
      <Actions open {...props} />
    </Box>
  );
}

export const variants: Scene = {
  about:
    "Held open, because closed they are the same button: what the knob changes is inside. Solid fills the highlighted row, subtle tints it — and the row under the pointer has to be findable without being louder than the words on it.",
  draw: () => (
    <Matrix direction="row" gap="6" knob="variant" of={VARIANTS}>
      {(variant) => <Cell variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "The indicator column keeps its width at both sizes, so a plain item with nothing in that column still lines up with a checked one beside it.",
  draw: () => (
    <Matrix direction="row" gap="6" knob="size" of={SIZES}>
      {(size) => <Cell size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export default specimen({
  about:
    "A list of actions behind a trigger, holding plain items, checkboxes, a radio set and submenus. Every kind shares one indicator column so they line up whatever is in it.",
  group: "Overlays",
  id: "overlays/menu",
  scenes: [variants, sizes],
  title: "Menu",
});
