/**
 * Shows what the four collection factories build, since nothing about them is drawn on its own.
 */

import { type ReactElement, type ReactNode } from "react";

import { Box, Column, Row, type Scene, specimen, Text } from "@stealthscale/foundation-specimen";

import {
  createFileTreeCollection,
  createGridCollection,
  createListCollection,
  createTreeCollection,
} from "#collection/collection.ts";

/**
 * Describes a node of the tree built by hand.
 */
interface Node {
  /**
   * What sits under it, where anything does.
   */
  children?: Node[];

  /**
   * Identifies the node.
   */
  id: string;

  /**
   * What the node is called.
   */
  name: string;
}

/**
 * Describes the props of {@link Panel}.
 */
interface PanelProps {
  /**
   * What the factory built.
   */
  children: ReactNode;

  /**
   * Which factory built it.
   */
  title: string;
}

/**
 * The flat list a select or a combobox is driven by.
 */
const list = createListCollection({
  items: [
    { label: "Bridge Ledger", value: "bridge" },
    { label: "Halden & Co", value: "halden" },
    { label: "Perrin Freight", value: "perrin" },
  ],
});

/**
 * The same rows again, laid out three to a row, which is what a grid-navigable menu needs.
 */
const grid = createGridCollection({
  columnCount: 3,
  items: [
    { label: "Mon", value: "mon" },
    { label: "Tue", value: "tue" },
    { label: "Wed", value: "wed" },
    { label: "Thu", value: "thu" },
    { label: "Fri", value: "fri" },
    { label: "Sat", value: "sat" },
  ],
});

/**
 * The nested list a tree view is driven by.
 */
const tree = createTreeCollection<Node>({
  nodeToString: (node) => node.name,
  nodeToValue: (node) => node.id,
  rootNode: {
    children: [
      { children: [{ id: "payouts", name: "Payouts" }], id: "ledger", name: "Ledger" },
      { children: [{ id: "2024", name: "2024.zip" }], id: "archive", name: "Archive" },
    ],
    id: "root",
    name: "",
  },
});

/**
 * The same shape again, built from paths rather than by hand.
 */
const files = createFileTreeCollection([
  "ledger/payouts.csv",
  "ledger/exports.csv",
  "archive/2024.zip",
]);

/**
 * Names one factory, and draws what it built under the name.
 *
 * @param props - The panel. `PanelProps` documents every member.
 * @returns One panel.
 */
function Panel(props: PanelProps): ReactElement {
  return (
    <Column gap="2" width="lg">
      <Text strong>{props.title}</Text>
      <Box framed pad="3">
        {props.children}
      </Box>
    </Column>
  );
}

export const flat: Scene = {
  about:
    "The list every select and combobox is driven by. It draws nothing itself, so what is on show is what it can be asked: its items, how many there are, and which is first.",
  draw: () => (
    <Panel title="createListCollection">
      <Column gap="1">
        {list.items.map((item) => (
          <Text key={item.value}>{item.label}</Text>
        ))}
        <Text muted size="xs">
          {list.size} items, first is {String(list.firstValue)}
        </Text>
      </Column>
    </Panel>
  ),
  title: "A flat list",
};

export const rows: Scene = {
  about:
    "The same items again, told how many columns to fall into. Drawn here as the rows the collection itself reports rather than as a grid, because those rows are what an arrow key moves between.",
  draw: () => (
    <Panel title="createGridCollection">
      <Column gap="2">
        {grid.getRows().map((row) => (
          <Row gap="2" key={row.map((cell) => cell.value).join()}>
            {row.map((cell) => (
              <Box key={cell.value} pad="2" surface="subtle">
                <Text>{cell.label}</Text>
              </Box>
            ))}
          </Row>
        ))}
      </Column>
    </Panel>
  ),
  title: "A grid of rows",
};

export const nested: Scene = {
  about:
    "A tree, walked from its root through its children. Nothing about the shape is drawn — this is the collection reporting what it holds.",
  draw: () => (
    <Panel title="createTreeCollection">
      <Column gap="1">
        {tree.getNodeChildren(tree.rootNode).map((node) => (
          <Column gap="0" key={node.id}>
            <Text>{node.name}</Text>
            {tree.getNodeChildren(node).map((child) => (
              <Text key={child.id} muted>
                {child.name}
              </Text>
            ))}
          </Column>
        ))}
      </Column>
    </Panel>
  ),
  title: "A nested tree",
};

export const paths: Scene = {
  about:
    "The same shape as the tree, built from a list of paths rather than by hand. The depth it reports is what an indent guide is drawn from, so the values it made out of those paths are what is worth reading back.",
  draw: () => (
    <Panel title="createFileTreeCollection">
      <Column gap="1">
        {files.getValues().map((value) => (
          <Text key={value} muted={files.getDepth(value) !== 1}>
            {value}
          </Text>
        ))}
      </Column>
    </Panel>
  ),
  title: "A tree from paths",
};

export default specimen({
  about:
    "The four factories every picker in the kit is driven by. None of them draws anything, so each is shown by reading it back with its own methods.",
  group: "Collections",
  id: "collections/collection",
  scenes: [flat, rows, nested, paths],
  title: "Collection",
});
