import { defaultSystem } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { expect, test } from "vite-plus/test";

import { Box } from "#box.tsx";
import { declared } from "#declared.fixtures.ts";
import { Worn } from "#worn.tsx";

/**
 * A theme to wear, which is the engine's own.
 */
const WORN = { name: "default", system: defaultSystem };

test("puts a theme in scope, which is what the furniture inside resolves its tokens from", () => {
  const { container } = render(
    <Worn theme={WORN}>
      <Box>Drawn</Box>
    </Worn>,
  );

  expect(container.textContent).toBe("Drawn");
  expect(declared(container)).toContain("padding");
});
