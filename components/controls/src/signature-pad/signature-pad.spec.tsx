import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { render, within } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";

import {
  SignaturePadClearTrigger,
  SignaturePadControl,
  SignaturePadGuide,
  SignaturePadHiddenInput,
  SignaturePadLabel,
  SignaturePadRoot,
  type SignaturePadRootProps,
  SignaturePadSegment,
} from "#signature-pad/signature-pad.ts";

/**
 * The styling system these tests draw under, which is Chakra with nothing retuned.
 */
const system = createSystem(defaultConfig);

/**
 * Renders a labelled pad and answers the element it was rendered into, so a test may draw two pads
 * and tell them apart.
 */
function pad(props: Omit<SignaturePadRootProps, "children"> = {}): HTMLElement {
  const { container } = render(
    <ChakraProvider value={system}>
      <SignaturePadRoot name="signature" {...props}>
        <SignaturePadLabel>Signature</SignaturePadLabel>
        <SignaturePadControl>
          <SignaturePadSegment />
          <SignaturePadClearTrigger>Clear</SignaturePadClearTrigger>
          <SignaturePadGuide />
        </SignaturePadControl>
        <SignaturePadHiddenInput value="" />
      </SignaturePadRoot>
    </ChakraProvider>,
  );

  return container;
}

describe("SignaturePadRoot", () => {
  it("carries the recipe class, which is what proves the recipe resolved", () => {
    expect(pad().querySelector<HTMLElement>("[data-part=root]")?.className).toContain(
      "scale-signature-pad",
    );
  });

  it("takes a size that changes what its control is styled with", () => {
    const medium = pad().querySelector<HTMLElement>("[data-part=control]")?.className;
    const large = pad({ size: "lg" }).querySelector<HTMLElement>("[data-part=control]")?.className;

    expect(medium).toBeDefined();
    expect(large).not.toBe(medium);
  });

  it("says it is disabled on every part that has to know", () => {
    const drawn = pad({ disabled: true });

    expect(drawn.querySelector<HTMLElement>("[data-part=root]")?.dataset["disabled"]).toBe("");
    expect(drawn.querySelector<HTMLElement>("[data-part=control]")?.dataset["disabled"]).toBe("");
  });
});

describe("SignaturePadSegment", () => {
  it("draws an accessible surface with nothing on it yet", () => {
    const segment = pad().querySelector("[data-part=segment]");

    expect(segment?.tagName.toLowerCase()).toBe("svg");
    expect(segment?.querySelectorAll("path")).toHaveLength(0);
  });
});

describe("SignaturePadClearTrigger", () => {
  it("stays away until there is something to clear", () => {
    expect(within(pad()).queryByRole("button", { name: "Clear" })).toBeNull();
  });
});

describe("SignaturePadHiddenInput", () => {
  it("carries the name the root was given, hidden and read-only", () => {
    const hidden = pad().querySelector<HTMLInputElement>("input[name=signature]");

    expect(hidden?.hidden).toBe(true);
    expect(hidden?.readOnly).toBe(true);
  });
});
