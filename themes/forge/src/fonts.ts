/**
 * Loads the typefaces Forge asks for, and does nothing else.
 *
 * Importing this module is what puts the faces on the page: the theme's config names families, and
 * naming one is not loading it. It is a separate entry point so that importing the theme stays free
 * of side effects, and an application that serves the same faces some other way can leave it out.
 *
 * @packageDocumentation
 */

import "@fontsource-variable/fira-code";
import "@fontsource-variable/jost";
