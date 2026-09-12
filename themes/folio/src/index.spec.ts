import { describe, expect, it } from "vite-plus/test";

import { config as base } from "@stealthscale/theme";
import { numberOf, resolved } from "@stealthscale/theme/testing";

import { config, system } from "#index.ts";

/**
 * Reads the colours this theme states for itself.
 */
const stated = Object.keys(config.theme?.tokens?.colors ?? {});

/**
 * Reads one token's value back through this theme's system.
 */
function valueOf(path: string): string {
  return resolved(system, path);
}

/**
 * Reads one font size in rem.
 */
function remOf(path: string): number {
  return numberOf(valueOf(path));
}

describe("folio", () => {
  it("states only what makes it differ", () => {
    expect(stated).not.toContain("accent");
    expect(config.cssVarsPrefix).toBeUndefined();
  });

  it("draws an editorial product in its own hue", () => {
    expect(valueOf("colors.primary.500")).toContain(" 295.0)");
  });

  it("inherits the base rather than Chakra for what it does not state", () => {
    expect(base.cssVarsPrefix).toBe("scale");
    expect(valueOf("colors.primary.solid")).not.toBe("");
  });

  it("sets body text larger and spreads the ramp wider", () => {
    expect(remOf("fontSizes.md")).toBeCloseTo(1.0625, 4);
    expect(remOf("fontSizes.4xl")).toBeGreaterThan(4);
  });
});
