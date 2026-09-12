/**
 * Shows the password input at every size, with the button that reveals what was typed.
 */

import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Column, Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  PasswordInputControl,
  PasswordInputIndicator,
  PasswordInputInput,
  PasswordInputLabel,
  PasswordInputRoot,
  PasswordInputVisibilityTrigger,
} from "#password-input/password-input.ts";

/**
 * How large the field is.
 */
const SIZES = ["sm", "md", "lg"] as const;

export const sizes: Scene = {
  about:
    "The trigger swaps one icon for the other rather than changing shape, so the field’s width stays put as it is pressed. Press one — that is what the trailing element’s fixed size is for.",
  draw: () => (
    <Column gap="6" width="sm">
      <Matrix gap="6" knob="size" of={SIZES}>
        {(size) => (
          <PasswordInputRoot colorPalette="primary" size={size}>
            <PasswordInputLabel>Passphrase</PasswordInputLabel>
            <PasswordInputControl>
              <PasswordInputInput
                defaultValue="correct horse battery staple"
                placeholder="Four words, at least"
              />
              <PasswordInputVisibilityTrigger>
                <PasswordInputIndicator fallback={<EyeIcon size={16} />}>
                  <EyeOffIcon size={16} />
                </PasswordInputIndicator>
              </PasswordInputVisibilityTrigger>
            </PasswordInputControl>
          </PasswordInputRoot>
        )}
      </Matrix>
    </Column>
  ),
  title: "Sizes",
};

export default specimen({
  about:
    "A field whose contents are hidden, with a button to reveal them. The reveal is what makes a long passphrase typeable, so it is not optional.",
  group: "Controls",
  id: "controls/password-input",
  scenes: [sizes],
  title: "Password input",
});
