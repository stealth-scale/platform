import { describe, expect, it } from "vite-plus/test";

import { system } from "#config.ts";
import {
  BASE,
  conditioned,
  conditionsIn,
  DARK,
  entryAt,
  LIGHT,
  lightnessOf,
  MODES,
  numberOf,
  resolved,
  textOf,
  valueAt,
} from "#testing.ts";

describe("textOf", () => {
  it("answers a string as it is", () => {
    expect(textOf("1rem")).toBe("1rem");
  });

  it("answers nothing for a value that is not one", () => {
    expect(textOf({ base: "red" })).toBe("");
    expect(textOf(Number.NaN)).toBe("");
  });
});

describe("conditioned", () => {
  it("knows a bag of values from a single one", () => {
    expect(conditioned({ _dark: "black" })).toBe(true);
    expect(conditioned("black")).toBe(false);
    expect(conditioned(null)).toBe(false);
  });
});

describe("valueAt", () => {
  it("reads a token that carries one string", () => {
    expect(valueAt({ l3: { value: "1rem" } }, "l3")).toBe("1rem");
  });

  it("answers nothing for a token the block does not have", () => {
    expect(valueAt({}, "l3")).toBe("");
  });
});

describe("entryAt", () => {
  it("reads a token under one condition", () => {
    expect(entryAt({ bg: { value: { _dark: "black", _light: "white" } } }, "bg", LIGHT)).toBe(
      "white",
    );
  });

  it("answers nothing where the condition is missing", () => {
    expect(entryAt({ bg: { value: { _light: "white" } } }, "bg", DARK)).toBe("");
  });

  it("answers nothing where the token carries one value rather than a bag", () => {
    expect(entryAt({ bg: { value: "white" } }, "bg", LIGHT)).toBe("");
  });
});

describe("conditionsIn", () => {
  it("lists the conditions across every entry, once each", () => {
    const block = {
      bg: { value: { _dark: "black", _light: "white" } },
      fg: { value: { _dark: "white", _light: "black" } },
    };

    expect(conditionsIn(block)).toEqual(MODES.toSorted());
  });

  it("counts an unconditional value as its own condition", () => {
    expect(conditionsIn({ solid: { value: { base: "red" } } })).toEqual([BASE]);
  });

  it("passes over an entry that carries nothing", () => {
    expect(conditionsIn({ bg: undefined })).toEqual([]);
  });
});

describe("resolved", () => {
  it("reads a token back through a system", () => {
    expect(resolved(system, "radii.l3")).toBe("0.625rem");
  });

  it("answers nothing for a token the system does not have", () => {
    expect(resolved(system, "colors.nonesuch.500")).toBe("");
  });
});

describe("numberOf", () => {
  it("reads the number off a CSS length", () => {
    expect(numberOf("1.0625rem")).toBeCloseTo(1.0625, 4);
  });

  it("answers `NaN` for a value that starts with no number", () => {
    expect(numberOf("auto")).toBeNaN();
  });
});

describe("lightnessOf", () => {
  it("reads the lightness out of an OKLCH colour", () => {
    expect(lightnessOf("oklch(97.0% 0.0060 262.0)")).toBeCloseTo(97, 4);
  });

  it("answers `NaN` for a colour written some other way", () => {
    expect(lightnessOf("#ffffff")).toBeNaN();
  });
});
