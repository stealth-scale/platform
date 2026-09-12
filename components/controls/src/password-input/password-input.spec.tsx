import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { type BoundFunctions, type queries, render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vite-plus/test";

import {
  PasswordInputControl,
  PasswordInputIndicator,
  PasswordInputInput,
  PasswordInputLabel,
  PasswordInputRoot,
  type PasswordInputRootProps,
  PasswordInputVisibilityTrigger,
} from "#password-input/password-input.ts";

/**
 * The styling system these tests draw under, which is Chakra with nothing retuned.
 */
const system = createSystem(defaultConfig);

/**
 * Renders a labelled field with a reveal button, and answers queries bound to that render alone.
 */
function field(
  props: Omit<PasswordInputRootProps, "children"> = {},
): BoundFunctions<typeof queries> {
  const { container } = render(
    <ChakraProvider value={system}>
      <PasswordInputRoot {...props}>
        <PasswordInputLabel>Passphrase</PasswordInputLabel>
        <PasswordInputControl>
          <PasswordInputInput />
          <PasswordInputVisibilityTrigger>
            <PasswordInputIndicator fallback="Show">Hide</PasswordInputIndicator>
          </PasswordInputVisibilityTrigger>
        </PasswordInputControl>
      </PasswordInputRoot>
    </ChakraProvider>,
  );

  return within(container);
}

describe("PasswordInputRoot", () => {
  it("carries the recipe class, which is what proves the recipe resolved", () => {
    expect(field().getByText("Passphrase").parentElement?.className).toContain(
      "scale-password-input",
    );
  });

  it("takes a size that changes what its field is styled with", () => {
    const medium = field().getByLabelText("Passphrase").className;
    const large = field({ size: "lg" }).getByLabelText("Passphrase").className;

    expect(medium).toBeDefined();
    expect(large).not.toBe(medium);
  });
});

describe("PasswordInputVisibilityTrigger", () => {
  it("hides what is typed until it is pressed", async () => {
    const drawn = field();
    const input = drawn.getByLabelText("Passphrase");

    await userEvent.type(input, "correct horse");
    expect(input.getAttribute("type")).toBe("password");

    await userEvent.click(drawn.getByRole("button"));
    expect(input.getAttribute("type")).toBe("text");

    await userEvent.click(drawn.getByRole("button"));
    expect(input.getAttribute("type")).toBe("password");
  });

  it("shows the indicator that matches the state it is in", async () => {
    const drawn = field();

    expect(drawn.queryByText("Show")).not.toBeNull();
    expect(drawn.queryByText("Hide")).toBeNull();

    await userEvent.click(drawn.getByRole("button"));

    expect(drawn.queryByText("Hide")).not.toBeNull();
    expect(drawn.queryByText("Show")).toBeNull();
  });
});
