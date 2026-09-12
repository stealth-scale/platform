import { useEffect, useState } from "react";

/**
 * Reads the address's fragment.
 *
 * @returns The fragment, without its `#`.
 */
function fragment(): string {
  return globalThis.location.hash.slice(1);
}

/**
 * Follows the address's fragment, which is where the page on show is named.
 *
 * @returns The fragment now.
 */
export function useHash(): string {
  const [hash, setHash] = useState(fragment);

  useEffect(() => {
    /**
     * Puts the state back in step with the address.
     */
    function follow(): void {
      setHash(fragment());
    }

    globalThis.addEventListener("hashchange", follow);

    return (): void => {
      globalThis.removeEventListener("hashchange", follow);
    };
  }, []);

  return hash;
}
