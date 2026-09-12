/**
 * Shows the two grids: one told where its lines fall, one told only how many columns to make.
 */

import { Matrix, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import { Box } from "#box/box.ts";
import { Grid, GridItem } from "#grid/grid.ts";
import { SimpleGrid } from "#simple-grid/simple-grid.ts";

/**
 * How many columns the simple grid is asked for.
 */
const COLUMNS = [2, 3, 4] as const;

export const spanning: Scene = {
  about:
    "A grid is told its template, so a cell can be told to cross it. This is the one to reach for when the layout has a shape — a wide first cell, a sidebar, a row that breaks the rhythm.",
  draw: () => (
    <Grid gap="3" templateColumns="repeat(4, 1fr)" w="24rem">
      <GridItem bg="colorPalette.subtle" borderRadius="l1" colSpan={2} p="3">
        <Text>spans two</Text>
      </GridItem>
      <GridItem bg="bg.muted" borderRadius="l1" p="3" />
      <GridItem bg="bg.muted" borderRadius="l1" p="3" />
    </Grid>
  ),
  title: "A cell that spans",
};

export const columns: Scene = {
  about:
    "A simple grid is told a number and divides the width evenly, which is what most layouts actually want. Nothing here states a template, so nothing has to be restated when the count changes.",
  draw: () => (
    <Matrix knob="columns" label={String} of={COLUMNS}>
      {(count) => (
        <SimpleGrid columns={count} gap="3" w="24rem">
          {Array.from({ length: 6 }, (_, index) => (
            <Box bg="bg.muted" borderRadius="l1" key={index} p="3">
              <Text>{index + 1}</Text>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Matrix>
  ),
  title: "An even count",
};

export default specimen({
  about:
    "Two grids, differing in who decides the columns. A grid is told the template and a cell can span it; a simple grid is told a number and divides the width evenly.",
  group: "Layout",
  id: "layout/grid",
  scenes: [spanning, columns],
  title: "Grid",
});
