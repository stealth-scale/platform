/**
 * The password input: a text field that hides what is typed, and a button that reveals it.
 *
 * Ark supplies the behaviour and this file supplies the look, joined by a slot recipe written in
 * semantic tokens throughout, so a theme that retints `bg`, `border` and `fg` restyles it without
 * naming it.
 *
 * The indicator nests inside the visibility trigger rather than beside it, which is Ark's anatomy.
 * The trigger is the button and the indicator is whichever eye it is currently showing.
 *
 * The border and the focus ring sit on the input, and the trigger floats over its trailing end,
 * with the input reserving room for it in its own inline padding. Ark styles it that way so the
 * ring lands on the field a reader is typing in rather than on a wrapper around it.
 */

import { type Assign } from "@ark-ui/react";
import { PasswordInput as Ark, passwordInputAnatomy } from "@ark-ui/react/password-input";
import {
  createSlotRecipeContext,
  defineSlotRecipe,
  type HTMLChakraProps,
  type RecipeVariantProps,
  type UnstyledProp,
} from "@chakra-ui/react";

/**
 * States how a password input is drawn.
 */
const recipe = defineSlotRecipe({
  className: "scale-password-input",
  slots: passwordInputAnatomy.keys(),

  base: {
    root: {
      color: "fg",
      display: "flex",
      flexDirection: "column",
      gap: "1.5",
      width: "full",

      _disabled: { layerStyle: "disabled" },
    },

    label: {
      color: "fg",
      fontWeight: "medium",
      textStyle: "sm",
    },

    control: {
      alignItems: "center",
      display: "flex",
      position: "relative",
      width: "full",
    },

    input: {
      bg: "transparent",
      borderColor: "border",
      borderRadius: "l2",
      borderWidth: "1px",
      color: "fg",
      minWidth: "0",
      outline: "none",
      transition: "border-color 0.15s, box-shadow 0.15s",
      width: "full",

      _focus: { focusRing: "inside" },
      _invalid: { borderColor: "border.error" },
      _placeholder: { color: "fg.subtle" },
    },

    visibilityTrigger: {
      alignItems: "center",
      borderRadius: "l1",
      color: "fg.muted",
      cursor: "button",
      display: "inline-flex",
      insetBlockStart: "50%",
      justifyContent: "center",
      position: "absolute",
      transform: "translateY(-50%)",
      transition: "color 0.15s",

      _disabled: { layerStyle: "disabled" },
      _focusVisible: { focusRing: "outside" },
      _hover: { color: "fg" },

      "& svg": { boxSize: "4" },
    },

    indicator: {
      alignItems: "center",
      display: "inline-flex",
      justifyContent: "center",
    },
  },

  variants: {
    size: {
      sm: {
        indicator: { boxSize: "4" },
        input: { height: "8", paddingInlineEnd: "8", paddingInlineStart: "2.5", textStyle: "sm" },
        visibilityTrigger: { boxSize: "6", insetInlineEnd: "1" },
      },

      md: {
        indicator: { boxSize: "4" },
        input: { height: "10", paddingInlineEnd: "10", paddingInlineStart: "3", textStyle: "sm" },
        visibilityTrigger: { boxSize: "8", insetInlineEnd: "1" },
      },

      lg: {
        indicator: { boxSize: "5" },
        input: { height: "11", paddingInlineEnd: "11", paddingInlineStart: "3.5", textStyle: "md" },
        visibilityTrigger: { boxSize: "8", insetInlineEnd: "1.5" },
      },
    },
  },

  defaultVariants: { size: "md" },
});

/**
 * Binds the recipe to the parts below, and carries the resolved styles down the tree.
 */
const { PropsProvider, useStyles, withContext, withProvider } = createSlotRecipeContext({ recipe });

/**
 * Describes what a password input takes beyond an element's own props.
 */
export interface PasswordInputRootBaseProps
  extends Assign<Ark.RootBaseProps, RecipeVariantProps<typeof recipe>>, UnstyledProp {}

/**
 * Describes the props of {@link PasswordInputRoot}.
 */
export interface PasswordInputRootProps extends HTMLChakraProps<
  "div",
  PasswordInputRootBaseProps
> {}

/**
 * Holds the field, and remembers whether what is typed is currently shown.
 */
export const PasswordInputRoot = withProvider<HTMLDivElement, PasswordInputRootProps>(
  Ark.Root,
  "root",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link PasswordInputRootProvider}.
 */
export interface PasswordInputRootProviderProps extends HTMLChakraProps<
  "div",
  Assign<Ark.RootProviderBaseProps, RecipeVariantProps<typeof recipe>> & UnstyledProp
> {}

/**
 * Holds the field against state built outside it by `usePasswordInput`.
 */
export const PasswordInputRootProvider = withProvider<
  HTMLDivElement,
  PasswordInputRootProviderProps
>(Ark.RootProvider, "root", { forwardAsChild: true });

/**
 * Describes the props of {@link PasswordInputLabel}.
 */
export interface PasswordInputLabelProps
  extends HTMLChakraProps<"label", Ark.LabelBaseProps>, UnstyledProp {}

/**
 * Names the field, and is what a click focuses it through.
 */
export const PasswordInputLabel = withContext<HTMLLabelElement, PasswordInputLabelProps>(
  Ark.Label,
  "label",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link PasswordInputControl}.
 */
export interface PasswordInputControlProps
  extends HTMLChakraProps<"div", Ark.ControlBaseProps>, UnstyledProp {}

/**
 * Draws the box the input and the trigger sit in, and carries the focus ring for both.
 */
export const PasswordInputControl = withContext<HTMLDivElement, PasswordInputControlProps>(
  Ark.Control,
  "control",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link PasswordInputInput}.
 */
export interface PasswordInputInputProps
  extends HTMLChakraProps<"input", Ark.InputBaseProps>, UnstyledProp {}

/**
 * The field itself, typed into.
 */
export const PasswordInputInput = withContext<HTMLInputElement, PasswordInputInputProps>(
  Ark.Input,
  "input",
  { forwardAsChild: true },
);

/**
 * Describes the props of {@link PasswordInputVisibilityTrigger}.
 */
export interface PasswordInputVisibilityTriggerProps
  extends HTMLChakraProps<"button", Ark.VisibilityTriggerBaseProps>, UnstyledProp {}

/**
 * Shows or hides what has been typed.
 */
export const PasswordInputVisibilityTrigger = withContext<
  HTMLButtonElement,
  PasswordInputVisibilityTriggerProps
>(Ark.VisibilityTrigger, "visibilityTrigger", { forwardAsChild: true });

/**
 * Describes the props of {@link PasswordInputIndicator}.
 */
export interface PasswordInputIndicatorProps
  extends HTMLChakraProps<"span", Ark.IndicatorBaseProps>, UnstyledProp {}

/**
 * Draws whichever of the trigger's two icons matches the current state.
 */
export const PasswordInputIndicator = withContext<HTMLSpanElement, PasswordInputIndicatorProps>(
  Ark.Indicator,
  "indicator",
  { forwardAsChild: true },
);

/**
 * Reads the field's state where a child needs it, as a render prop.
 */
export const PasswordInputContext = Ark.Context;

/**
 * Sets the props every password input under it takes by default.
 */
export const PasswordInputPropsProvider = PropsProvider;

/**
 * Reads the styles the recipe resolved, for a part this file does not wrap.
 */
export const usePasswordInputStyles = useStyles;

export {
  type PasswordInputVisibilityChangeDetails,
  usePasswordInput,
  usePasswordInputContext,
  type UsePasswordInputContext,
  type UsePasswordInputProps,
  type UsePasswordInputReturn,
} from "@ark-ui/react/password-input";
