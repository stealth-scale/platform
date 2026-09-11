import { defineConfig } from "@stealthscale/vite-config/preset/node";
import { workspace } from "@stealthscale/vite-config/preset/workspace";
import { preset as react } from "@stealthscale/vite-config-react";

/**
 * Configures this workspace once, at its root.
 *
 * `workspace` carries what is true of every stealth repository and `react.workspace` what is true
 * of every one that renders. Anything true only of this one is stated beside them.
 */
export default defineConfig(import.meta.dirname, {
  extends: [workspace(), react.workspace()],
});
