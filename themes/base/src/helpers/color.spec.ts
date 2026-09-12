import { describe, expect, it } from "vite-plus/test";

import { edges, inks, oklch, quiet, ramp, roles, surfaces } from "#helpers/color.ts";
import {
  BASE,
  conditionsIn,
  DARK,
  entryAt,
  LIGHT,
  lightnessOf,
  MODES,
  textOf,
  valueAt,
} from "#testing.ts";

/**
 * Holds the surfaces of the base theme's ladder.
 */
const stack = surfaces({ dark: 13, light: 97 }, 262, 0.006);

describe("ramp", () => {
  it("names every step Chakra names", () => {
    expect(Object.keys(ramp(258, 0.19))).toEqual([
      "50",
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
      "950",
    ]);
  });

  it("runs from light to dark without turning back", () => {
    const steps = Object.values(ramp(258, 0.19)).map((step) => lightnessOf(step.value));

    expect(steps).toEqual(steps.toSorted((first, second) => second - first));
  });

  it("keeps grey grey", () => {
    const greys = Object.values(ramp(258, 0)).map((step) => textOf(step.value));

    expect(greys.every((grey) => grey.includes(" 0.0000 "))).toBe(true);
  });
});

describe("roles", () => {
  it("writes every entry `colorPalette` resolves through", () => {
    expect(Object.keys(roles("primary")).toSorted()).toEqual([
      "border",
      "contrast",
      "emphasized",
      "fg",
      "focusRing",
      "muted",
      "solid",
      "subtle",
    ]);
  });

  it("points every entry at the palette it was asked for", () => {
    const written = JSON.stringify(roles("forge"));

    expect(written).toContain("{colors.forge.");
    expect(written).not.toContain("{colors.primary.");
  });

  it("gives a new palette an unconditional value and a dark one", () => {
    expect(conditionsIn(roles("primary"))).toEqual([DARK, BASE].toSorted());
  });
});

describe("surfaces, inks and edges", () => {
  it("write the light value as a condition, because they override Chakra’s own tokens", () => {
    expect(conditionsIn(stack)).toEqual(MODES.toSorted());
    expect(conditionsIn(inks())).toEqual(MODES.toSorted());
    expect(conditionsIn(edges())).toEqual(MODES.toSorted());
  });

  it("lift a panel above its page in both modes", () => {
    for (const mode of MODES) {
      expect(lightnessOf(entryAt(stack, "panel", mode))).toBeGreaterThan(
        lightnessOf(entryAt(stack, "DEFAULT", mode)),
      );
    }
  });

  it("stop at white rather than past it", () => {
    const high = surfaces({ dark: 9, light: 98 }, 300, 0.01);

    expect(lightnessOf(entryAt(high, "popover", LIGHT))).toBe(100);
  });

  it("draw their ink and their borders from the grey ramp", () => {
    expect(JSON.stringify(inks())).toContain("{colors.gray.");
    expect(JSON.stringify(edges())).toContain("{colors.gray.");
  });

  it("follow the palette they are given", () => {
    expect(JSON.stringify(inks("slate"))).toContain("{colors.slate.");
  });
});

/**
 * Reads how far one quiet fill sits from the page it is drawn on.
 *
 * A distance rather than a lightness, because the two modes recess in opposite directions: a light
 * theme's quiet fill is darker than its page and a dark theme's is lighter, and the thing that has
 * to hold in both is that the louder role sits further away.
 *
 * @param role - Which fill.
 * @param mode - Which colour mode.
 * @returns The distance in lightness, always positive.
 */
function recessOf(role: string, mode: string): number {
  const surface = valueAt(quiet(), role).replace("{colors.bg.", "").replace("}", "");

  return Math.abs(
    lightnessOf(entryAt(stack, surface, mode)) - lightnessOf(entryAt(stack, "DEFAULT", mode)),
  );
}

describe("the quiet fills", () => {
  it("name a surface rather than a step of the grey ramp", () => {
    const written = JSON.stringify(quiet());

    expect(written).toContain("{colors.bg.");
    expect(written).not.toContain("{colors.gray.");
  });

  it("cover the three roles a component reaches for without naming a palette", () => {
    expect(Object.keys(quiet()).toSorted()).toEqual(["emphasized", "muted", "subtle"]);
  });

  it("point at surfaces the theme actually states", () => {
    const stated = new Set(Object.keys(stack).map((name) => `{colors.bg.${name}}`));
    const dangling = Object.keys(quiet()).filter((role) => !stated.has(valueAt(quiet(), role)));

    expect(dangling).toEqual([]);
  });

  it("point each role at the surface of its own name", () => {
    // The three were crossed over: `muted` named the emphasized surface and `emphasized` named
    // the muted one, so a hovered row came out darker than a pressed one. In dark mode both
    // named the popover and the two states were the same colour.
    for (const role of Object.keys(quiet())) {
      expect(valueAt(quiet(), role)).toBe(`{colors.bg.${role}}`);
    }
  });

  it("sit further from the page the louder they are, in either mode", () => {
    for (const mode of MODES) {
      expect(recessOf("subtle", mode)).toBeLessThan(recessOf("muted", mode));
      expect(recessOf("muted", mode)).toBeLessThan(recessOf("emphasized", mode));
    }
  });
});

describe("the surface ladder", () => {
  it("states the recessed fills as well as the raised ones", () => {
    expect(Object.keys(stack).toSorted()).toEqual([
      "DEFAULT",
      "emphasized",
      "muted",
      "panel",
      "popover",
      "subtle",
    ]);
  });

  it("recesses a quiet fill below a light page and above a dark one", () => {
    const page = {
      dark: lightnessOf(entryAt(stack, "DEFAULT", DARK)),
      light: lightnessOf(entryAt(stack, "DEFAULT", LIGHT)),
    };

    expect(lightnessOf(entryAt(stack, "subtle", LIGHT))).toBeLessThan(page.light);
    expect(lightnessOf(entryAt(stack, "subtle", DARK))).toBeGreaterThan(page.dark);
  });

  it("keeps every surface in the theme’s own tint", () => {
    const tints = Object.keys(stack).flatMap((name) =>
      MODES.map((mode) => entryAt(stack, name, mode).replace(/^oklch\([\d.]+%\s*/u, "")),
    );

    expect(new Set(tints).size).toBe(1);
  });
});

describe("oklch", () => {
  it("writes a colour CSS can read", () => {
    expect(oklch(60, 0.19, 258)).toBe("oklch(60.0% 0.1900 258.0)");
  });
});
