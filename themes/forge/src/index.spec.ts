import { describe, expect, it } from "vite-plus/test";

import { config as base } from "@stealthscale/theme";
import { resolved } from "@stealthscale/theme/testing";

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

describe("forge", () => {
  it("states only what makes it differ", () => {
    expect(stated).not.toContain("accent");
    expect(config.cssVarsPrefix).toBeUndefined();
  });

  it("draws a warm, dense console in its own hue", () => {
    expect(valueOf("colors.primary.500")).toContain(" 45.0)");
  });

  it("inherits the base rather than Chakra for what it does not state", () => {
    expect(base.cssVarsPrefix).toBe("scale");
    expect(valueOf("colors.primary.solid")).not.toBe("");
  });

  it("draws its shadows flatter, since a console shows many surfaces at once", () => {
    expect(valueOf("shadows.lg")).toContain(" 70 /");
  });
});
