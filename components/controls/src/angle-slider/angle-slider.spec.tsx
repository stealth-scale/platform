import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vite-plus/test";

import {
  AngleSliderControl,
  AngleSliderLabel,
  AngleSliderMarker,
  AngleSliderMarkerGroup,
  AngleSliderRing,
  AngleSliderRoot,
  type AngleSliderRootProps,
  AngleSliderThumb,
  AngleSliderThumbIndicator,
  AngleSliderValueText,
} from "#angle-slider/angle-slider.tsx";

/**
 * The styling system these tests draw under, which is Chakra with nothing retuned.
 */
const system = createSystem(defaultConfig);

/**
 * Renders a labelled dial with two markers, and answers the element it was rendered into, so a test
 * may draw two dials and tell them apart.
 */
function dial(props: Omit<AngleSliderRootProps, "children"> = {}): HTMLElement {
  const { container } = render(
    <ChakraProvider value={system}>
      <AngleSliderRoot {...props}>
        <AngleSliderLabel>Bearing</AngleSliderLabel>
        <AngleSliderControl>
          <AngleSliderRing />
          <AngleSliderThumb>
            <AngleSliderThumbIndicator />
          </AngleSliderThumb>
          <AngleSliderMarkerGroup>
            <AngleSliderMarker value={90} />
            <AngleSliderMarker value={270} />
          </AngleSliderMarkerGroup>
        </AngleSliderControl>
        <AngleSliderValueText />
      </AngleSliderRoot>
    </ChakraProvider>,
  );

  return container;
}

describe("AngleSliderRoot", () => {
  it("carries the recipe class, which is what proves the recipe resolved", () => {
    const root = dial().querySelector<HTMLElement>("[data-part=root]");

    expect(root?.className).toContain("scale-angle-slider");
  });

  it("publishes the angle as a custom property, which is what draws the dial", () => {
    const root = dial({ defaultValue: 45 }).querySelector<HTMLElement>("[data-part=root]");

    expect(root?.style.getPropertyValue("--angle")).toBe("45deg");
    expect(root?.style.getPropertyValue("--value")).toBe("45");
  });
});

describe("AngleSliderRing", () => {
  it("draws a track circle and a range circle inside one svg", () => {
    const ring = dial().querySelector("svg");

    expect(ring?.querySelectorAll("circle")).toHaveLength(2);
    expect(ring?.getAttribute("aria-hidden")).toBe("true");
  });

  it("leaves the arc dashed by how much of the turn is left", () => {
    /**
     * Draws a dial turned to an angle and answers the circle carrying the arc.
     *
     * @param angle - How far round the dial is turned.
     * @returns That circle, or nothing where the dial drew none.
     */
    const range = (angle: number): null | SVGCircleElement =>
      dial({ defaultValue: angle }).querySelector<SVGCircleElement>("circle + circle");

    const full = Number(range(360)?.style.strokeDasharray);
    const quarter = Number(range(90)?.style.strokeDashoffset);

    expect(full).toBeGreaterThan(0);
    expect(Number(range(360)?.style.strokeDashoffset)).toBe(0);
    expect(quarter).toBeCloseTo(full * 0.75, 5);
  });
});

describe("AngleSliderThumb", () => {
  it("reports the angle it is at, out of a full turn", () => {
    const thumb = within(dial({ defaultValue: 120 })).getByRole("slider");

    expect(thumb.getAttribute("aria-valuenow")).toBe("120");
    expect(thumb.getAttribute("aria-valuemin")).toBe("0");
    expect(thumb.getAttribute("aria-valuemax")).toBe("360");
  });

  it("turns by a step when the keyboard asks", async () => {
    const thumb = within(dial({ defaultValue: 90 })).getByRole("slider");

    await userEvent.click(thumb);
    await userEvent.keyboard("{ArrowRight}");

    expect(thumb.getAttribute("aria-valuenow")).toBe("91");
  });
});

describe("AngleSliderMarker", () => {
  it("says of each marker whether the value has passed it", () => {
    const markers = dial({ defaultValue: 180 }).querySelectorAll<HTMLElement>("[data-part=marker]");

    expect([...markers].map((one) => one.dataset["state"])).toEqual(["under-value", "over-value"]);
  });
});
