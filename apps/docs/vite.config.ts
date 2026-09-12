import { override } from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config-react/preset/app";
import { preset as specimen } from "@stealthscale/vite-config-specimen";

export default defineConfig(import.meta.dirname, {
  extends: [
    override.page("."),
    specimen.layers({ patterns: ["../../components/*/src/**/*.specimen.tsx"] }),
  ],
});
