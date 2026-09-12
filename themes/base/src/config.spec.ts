import { describe, expect, it } from "vite-plus/test";

import { config, system } from "#config.ts";
import { resolved } from "#testing.ts";

/**
 * Reads the theme block.
 */
const theme = config.theme ?? {};

/**
 * Lists the raw token categories the theme states.
 */
const tokens = Object.keys(theme.tokens ?? {}).toSorted();

/**
 * Lists the semantic token categories the theme states.
 */
const semantic = Object.keys(theme.semanticTokens ?? {}).toSorted();

/**
 * Reads one token's value back through this theme's system.
 */
function valueOf(path: string): string {
  return resolved(system, path);
}

describe("config", () => {
  it("names its CSS variables after this design system rather than the engine", () => {
    expect(config.cssVarsPrefix).toBe("scale");
  });

  it("states every category that carries an opinion", () => {
    expect(tokens).toEqual(["colors", "fontSizes", "fonts"]);
    expect(semantic).toEqual(["colors", "radii", "shadows"]);
    expect(theme.textStyles).toBeDefined();
  });
});

describe("system", () => {
  it("resolves a palette step to the colour the ramp built", () => {
    expect(valueOf("colors.gray.500")).toContain("oklch(");
  });

  it("resolves every role `colorPalette` needs, for the one palette it ships", () => {
    const roles = ["solid", "contrast", "fg", "muted", "subtle", "emphasized", "focusRing"];
    const missing = roles.filter((role) => valueOf(`colors.gray.${role}`) === "");

    expect(missing).toEqual([]);
  });

  it("ships no brand colour, which a theme built on this one states for itself", () => {
    expect(valueOf("colors.primary.solid")).toBe("");
  });

  it("resolves the corner scale, which Chakra ships as semantic tokens", () => {
    expect(valueOf("radii.l3")).toBe("0.625rem");
  });
});
