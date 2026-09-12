import { fmt, lint, test } from "@stealthscale/vite-config";
import { preset as react } from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/node";
import { workspace } from "@stealthscale/vite-config/preset/workspace";

import { workspace as specimens } from "./packages/vite-config-specimen/src/preset/workspace.ts";

/**
 * Configures this workspace once, at its root.
 *
 * `workspace` carries what is true of every stealth repository, `react.workspace` what is true of
 * every one that renders, and `specimens` what is true of every file drawing a page of the
 * catalogue. Anything true only of this one is stated beside them.
 *
 * The specimen layers are reached by path, and by the module stating them rather than through the
 * package's own entry. A config is loaded before any config exists to name the source condition, so
 * an import by name resolves through `dist`; and the entry carries the layer that appends the index
 * plugin, which a root has no use for and would have to have built to read.
 */
export default defineConfig(import.meta.dirname, {
  extends: [
    workspace(),
    react.workspace(),
    specimens(),

    fmt.skip({
      because:
        "changesets writes it from the changeset files and rewrites it on every release, so a " +
        "wrapped changelog is undone by the next `changeset version` and the diff it leaves is " +
        "nobody's to read. The prose is already wrapped where it is written, in the changeset",
      files: ["**/CHANGELOG.md"],
    }),

    // Branches alone, because branches alone are the ones the counter gets wrong here. It reads a
    // component back from the code the JSX transform emitted, and reports conditions the file does
    // not contain: `section.tsx` holds a heading and its children, no `if` and no `&&` anywhere,
    // and is counted as four branches with one of them never taken. Rendering it with no children
    // leaves that one at zero, which is what shows there is no test to write for it. Every real
    // condition in the same file is covered, and statements, functions and lines stay at all of it.
    test.covering({ branches: 80 }),

    lint.relax({
      because:
        "a theme's `fonts` entry exists for its side effect: importing it is what puts the faces " +
        "on the page. There is nothing for it to assign, which is the whole point of the file, " +
        "and it is a separate entry so that importing the theme itself stays free of them",
      files: ["themes/*/src/fonts.ts"],
      rules: { "import/no-unassigned-import": "off" },
    }),

    lint.relax({
      because:
        "the rule reads a component built by a call as something other than a component, so a " +
        "file of them looks to it like a file mixing components with constants. Chakra's slot " +
        'recipes build every part that way — `withProvider(Ark.Root, "root")` — and the same ' +
        "file's `export function` parts are accepted, which is what shows the reading is the " +
        "rule's rather than the file's",
      files: ["**/*.tsx"],
      rules: { "react/only-export-components": "off" },
    }),

    lint.relax({
      because:
        "a specification's `describe` holds its cases, so its length is the number of things " +
        "being asserted rather than a function doing too much. The limit asks whether one unit of " +
        "work has grown too big, and a suite is not one",
      files: ["**/*.spec.ts", "**/*.spec.tsx"],
      rules: { "eslint/max-lines-per-function": "off" },
    }),

    lint.relax({
      because:
        "a package's entry point names every export of every component it owns, so `controls` " +
        "alone runs to nine hundred lines of them. The limit asks whether a file does one thing, " +
        "and a seam does: it says what the package publishes, which is the length of that list",
      files: ["components/*/src/index.ts", "foundations/*/src/index.ts"],
      rules: { "eslint/max-lines": "off" },
    }),
  ],
});
