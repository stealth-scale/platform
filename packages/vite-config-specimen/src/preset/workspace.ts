/**
 * What a workspace states once, at its root, on behalf of every specimen below it.
 *
 * Separate from what a catalogue extends, because the linter runs from the root of the workspace
 * and reads the root's config and no other. A relaxation stated in the application showing the
 * catalogue would compose, merge, and then never be read, leaving a rule the author believes they
 * turned off and a linter that goes on firing.
 */

import { lint } from "@stealthscale/vite-config";
import { type Layer, owned } from "@stealthscale/vite-config-core";

/**
 * Where specimens are, as the linter sees them from the root.
 */
const SPECIMENS = ["**/*.specimen.tsx"];

/**
 * The layers a root config states for the specimens below it.
 *
 * Every one of them is about the same file: a specimen is read by its default export and built out
 * of the small components arranging one picture, which four rules written for ordinary modules
 * each refuse for a different reason.
 *
 * Owned, so a repository takes one back by a name that says where it came from.
 *
 * @param files - Which files are specimens. Default: any `*.specimen.tsx` in the workspace.
 * @returns Each layer a root config needs, in the order they compose.
 */
export function workspace(files: readonly string[] = SPECIMENS): readonly Layer[] {
  return owned("specimen", [
    lint.defaultExported([...files]),
    lint.undocumented([...files]),

    lint.relax({
      because:
        "what a specimen exports is a scene description rather than a component: `specimen()` " +
        "answers an object the catalogue reads, and the rule is a fast refresh convention that " +
        "takes it for an anonymous component. Naming a constant in each of them would satisfy a " +
        "reading of the file that is wrong about what the value is",
      files: [...files],
      rules: { "react/only-export-components": "off" },
    }),

    lint.relax({
      because:
        "a specimen is one scene, and a scene is built from the small components that arrange it. " +
        "Each exists to be drawn once, beside the caption explaining it; splitting them into " +
        "files of their own puts every piece further from the picture it is part of",
      files: [...files],
      rules: { "react/no-multi-comp": "off" },
    }),

    lint.relax({
      because:
        "the refs a tour points at are read when it asks for its target, inside a callback it " +
        "calls after the render. The rule reports any ref reachable from a call argument without " +
        "telling when the read happens, so passing the refs and passing getters are refused alike",
      files: [...files],
      rules: { "react/refs": "off" },
    }),
  ]);
}
