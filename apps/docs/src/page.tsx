import { type ReactElement, useEffect, useState } from "react";

import { collect, type Documented, Prose, Section, Text } from "@stealthscale/foundation-specimen";
import { type Indexed } from "@stealthscale/vite-plugin-specimen";

/**
 * Describes the props of {@link Page}.
 */
export interface PageProps {
  /**
   * The page to draw, as the index lists it.
   */
  entry: Indexed;
}

/**
 * Draws one page: its opening, then each scene under its title.
 *
 * The module is loaded when the page is opened and nothing is loaded before, which is the whole
 * point of the index. Keyed by the entry where it is drawn, so opening another page starts afresh
 * rather than resetting.
 *
 * @param props - The page. `PageProps` documents every member.
 * @returns The page, or what went wrong loading it.
 */
export function Page({ entry }: PageProps): ReactElement {
  const [page, setPage] = useState<Documented>();
  const [wrong, setWrong] = useState("");

  useEffect(() => {
    let live = true;

    /**
     * Loads the module and reads the page out of it.
     */
    async function open(): Promise<void> {
      try {
        const module = await entry.load();

        if (live) setPage(collect({ modules: { [entry.path]: module } })[0]);
      } catch (error) {
        if (live) setWrong(error instanceof Error ? error.message : String(error));
      }
    }

    void open();

    return (): void => {
      live = false;
    };
  }, [entry]);

  if (wrong !== "") return <Text>{wrong}</Text>;
  if (page === undefined) return <Text muted>Loading {entry.title}…</Text>;

  return (
    <Section title={page.title}>
      {page.about === "" ? null : (
        <Prose>
          <Text>{page.about}</Text>
        </Prose>
      )}

      {page.scenes.map((scene) => (
        <Section key={scene.title} title={scene.title}>
          {scene.about === undefined ? null : (
            <Prose>
              <Text>{scene.about}</Text>
            </Prose>
          )}
          <scene.draw />
        </Section>
      ))}
    </Section>
  );
}
