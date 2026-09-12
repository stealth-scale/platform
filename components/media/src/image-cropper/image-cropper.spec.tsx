import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";

import {
  ImageCropperGrid,
  ImageCropperHandle,
  ImageCropperImage,
  ImageCropperRoot,
  type ImageCropperRootProps,
  ImageCropperSelection,
  ImageCropperViewport,
} from "#image-cropper/image-cropper.ts";

/**
 * The styling system these tests draw under, which is Chakra with nothing retuned.
 */
const system = createSystem(defaultConfig);

/**
 * Renders a cropper over a placeholder picture and answers the element it was rendered into, so a
 * test may draw two croppers and tell them apart.
 */
function cropper(props: Omit<ImageCropperRootProps, "children"> = {}): HTMLElement {
  const { container } = render(
    <ChakraProvider value={system}>
      <ImageCropperRoot {...props}>
        <ImageCropperViewport>
          <ImageCropperImage alt="Portrait" src="/portrait.jpg" />
          <ImageCropperSelection>
            <ImageCropperHandle position="nw">
              <span />
            </ImageCropperHandle>
            <ImageCropperHandle position="se">
              <span />
            </ImageCropperHandle>
            <ImageCropperGrid axis="horizontal" />
            <ImageCropperGrid axis="vertical" />
          </ImageCropperSelection>
        </ImageCropperViewport>
      </ImageCropperRoot>
    </ChakraProvider>,
  );

  return container;
}

describe("ImageCropperRoot", () => {
  it("carries the recipe class, which is what proves the recipe resolved", () => {
    expect(cropper().querySelector<HTMLElement>("[data-part=root]")?.className).toContain(
      "scale-image-cropper",
    );
  });

  it("takes a size that changes how wide it is drawn", () => {
    const medium = cropper().querySelector<HTMLElement>("[data-part=root]")?.className;
    const large = cropper({ size: "lg" }).querySelector<HTMLElement>("[data-part=root]")?.className;

    expect(medium).toBeDefined();
    expect(large).not.toBe(medium);
  });

  it("passes a zoom through to the picture rather than styling itself with it", () => {
    const flat = cropper().querySelector<HTMLElement>("[data-part=image]")?.style.transform;
    const zoomed = cropper({ zoom: 2 }).querySelector<HTMLElement>("[data-part=image]")?.style
      .transform;

    expect(flat).toBeDefined();
    expect(zoomed).not.toBe(flat);
  });

  it("says which shape the crop is, which is what rounds the selection", () => {
    const round = cropper({ cropShape: "circle" });

    expect(round.querySelector<HTMLElement>("[data-part=root]")?.dataset["shape"]).toBe("circle");
    expect(round.querySelector<HTMLElement>("[data-part=selection]")?.dataset["shape"]).toBe(
      "circle",
    );
  });
});

describe("ImageCropperSelection", () => {
  it("is placed off the crop box the root publishes", () => {
    const selection = cropper().querySelector<HTMLElement>("[data-part=selection]");

    expect(selection?.style.top).toBe("var(--crop-y)");
    expect(selection?.style.width).toBe("var(--crop-width)");
  });

  it("reports the crop as a value a screen reader can read", () => {
    const selection = cropper().querySelector<HTMLElement>("[data-part=selection]");

    expect(selection?.getAttribute("aria-valuemin")).not.toBeNull();
    expect(selection?.getAttribute("aria-valuemax")).not.toBeNull();
  });
});

describe("ImageCropperHandle", () => {
  it("says where each handle sits, which is what positions and styles it", () => {
    const handles = cropper().querySelectorAll<HTMLElement>("[data-part=handle]");

    expect([...handles].map((one) => one.dataset["position"])).toEqual(["nw", "se"]);
  });
});

describe("ImageCropperGrid", () => {
  it("says which axis each line runs on", () => {
    const lines = cropper().querySelectorAll<HTMLElement>("[data-part=grid]");

    expect([...lines].map((one) => one.dataset["axis"])).toEqual(["horizontal", "vertical"]);
  });
});
