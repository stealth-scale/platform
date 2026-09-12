import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Worn } from "@stealthscale/foundation-specimen";
import { system } from "@stealthscale/theme";

import { App } from "#app.tsx";

/**
 * The theme the catalogue is drawn in.
 */
const BASE = { name: "base", system };

/**
 * Mounts the catalogue.
 *
 * @throws Error Where the document has no root to mount into.
 */
function mount(): void {
  const root = document.querySelector("#root");

  if (root === null) throw new Error("the catalogue has no root to mount into");

  createRoot(root).render(
    <StrictMode>
      <Worn theme={BASE}>
        <App />
      </Worn>
    </StrictMode>,
  );
}

mount();
