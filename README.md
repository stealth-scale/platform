# @stealthscale/platform

Built, checked, tested and released under the house configuration, which is composed out of layers
rather than copied between repositories.

## Working on it

```bash
pnpm install
pnpm run ready     # build, check and test, uncached
```

`ready` runs `vp run ci`, which is the same command a build server runs, so a laptop answers the
same question as any provider.

## Configuring a package

The workspace root states `lint`, `fmt`, `run` and `test` once, and nowhere else reads them. A
package states only what is true of itself, and extends exactly one tier:

```ts
import { defineConfig } from "@stealthscale/vite-config-react/preset/web";

export default defineConfig(import.meta.dirname);
```

| Tier                                          | For                                 |
| --------------------------------------------- | ----------------------------------- |
| `@stealthscale/vite-config/preset/base`       | Publishes, says nothing about where it runs |
| `@stealthscale/vite-config/preset/node`       | Publishes and runs on the console   |
| `@stealthscale/vite-config-react/preset/web`  | A component library that publishes  |
| `@stealthscale/vite-config-react/preset/app`  | An application that is deployed     |

`import.meta.dirname` is required. Under `vp test` the working directory is the workspace root, and
a config is bundled to a temporary file outside its own package before it runs, so nothing else can
say which package is being configured.

Anything a package departs on is stated as a layer beside `extends`, carrying the reason with it.
[The configuration's own readme](https://github.com/stealth-scale/config#readme) has the four kinds
and what each is for.
