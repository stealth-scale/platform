/**
 * What a repository showing a catalogue is configured by.
 *
 * Two entry points, because the linter and the bundler read different files. A root config takes
 * `preset.workspace()`, the linter reading the root and no other. The application showing the
 * catalogue takes `preset.layers()`, which appends the plugin that indexes its specimens.
 *
 * @packageDocumentation
 */

export * as preset from "#preset/index.ts";
