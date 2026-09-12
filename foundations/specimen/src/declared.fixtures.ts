/**
 * Reads back the CSS a styled element actually had written for it.
 *
 * The styling factory resolves a token to a custom property, and a document asked for the computed
 * value of one of those answers with an empty string: nothing has resolved the variable, because
 * nothing has laid the page out. Asking the stylesheet what was written instead is the closest a
 * test without a browser gets to asking what the element looks like.
 */

/**
 * Collects every declaration written for the classes of what a render drew.
 *
 * Takes the container rather than the element. A specification has just rendered one thing and
 * wants the styling of it, and reaching for `firstElementChild` at each call site means asserting
 * away a null the specification itself ruled out — an assertion the linter refuses, and rightly,
 * since nothing about the type says the render produced anything.
 *
 * @param container - What the render was drawn into.
 * @returns The rules that apply to the element it drew, run together.
 * @throws Error Where the render produced no element.
 */
export function declared(container: ParentNode): string {
  const element = container.firstElementChild;

  if (element === null) throw new Error("The render produced no element to read the styling of.");

  const classes = [...element.classList];
  const found: string[] = [];

  for (const sheet of document.styleSheets) {
    for (const rule of sheet.cssRules) {
      const applies =
        rule instanceof CSSStyleRule &&
        classes.some((named) => rule.selectorText.includes(`.${named}`));

      if (applies) found.push(rule.cssText);
    }
  }

  return found.join(" ");
}
