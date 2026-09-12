/**
 * Shows the tree, nested two levels deep, in each way it can be selected.
 */

import { ChevronRightIcon } from "lucide-react";

import { Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  createTreeCollection,
  TreeViewBranch,
  TreeViewBranchContent,
  TreeViewBranchControl,
  TreeViewBranchIndicator,
  TreeViewBranchText,
  TreeViewItem,
  TreeViewItemText,
  TreeViewLabel,
  TreeViewNodeProvider,
  TreeViewRoot,
  TreeViewTree,
} from "#tree-view/tree-view.ts";

/**
 * Describes one row of the tree.
 */
interface Node {
  /**
   * What sits under it, where anything does.
   */
  children?: Node[];

  /**
   * Identifies the row.
   */
  id: string;

  /**
   * What the row is called.
   */
  name: string;
}

/**
 * What the tree holds: one branch with two rows under it, and one row on its own.
 *
 * Built with the factory this package publishes beside the tree itself, since a tree cannot be
 * drawn without one.
 */
const collection = createTreeCollection<Node>({
  nodeToString: (node) => node.name,
  nodeToValue: (node) => node.id,
  rootNode: {
    children: [
      {
        children: [
          { id: "payouts", name: "Payouts" },
          { id: "exports", name: "Exports" },
        ],
        id: "ledger",
        name: "Ledger",
      },
      { id: "archive", name: "Archive" },
    ],
    id: "root",
    name: "",
  },
});

/**
 * Every way a tree lets rows be picked.
 */
const MODES = ["single", "multiple"] as const;

export const modes: Scene = {
  about:
    "Opened, because closed every tree looks the same and it is the indent running down an open branch that says whether the nesting reads. A branch is a row that can be opened as well as picked, so the indicator and the label are separate targets.",
  draw: () => (
    <Matrix direction="row" gap="12" knob="selectionMode" of={MODES}>
      {(mode) => (
        <TreeViewRoot
          collection={collection}
          colorPalette="primary"
          defaultExpandedValue={["ledger"]}
          maxW="14rem"
          selectionMode={mode}
        >
          <TreeViewLabel>Workspace</TreeViewLabel>
          <TreeViewTree>
            {collection.rootNode.children?.map((node, index) => (
              <TreeViewNodeProvider indexPath={[index]} key={node.id} node={node}>
                {node.children === undefined ? (
                  <TreeViewItem>
                    <TreeViewItemText>{node.name}</TreeViewItemText>
                  </TreeViewItem>
                ) : (
                  <TreeViewBranch>
                    <TreeViewBranchControl>
                      <TreeViewBranchIndicator>
                        <ChevronRightIcon size={14} />
                      </TreeViewBranchIndicator>
                      <TreeViewBranchText>{node.name}</TreeViewBranchText>
                    </TreeViewBranchControl>
                    <TreeViewBranchContent>
                      {node.children.map((child, childIndex) => (
                        <TreeViewNodeProvider
                          indexPath={[index, childIndex]}
                          key={child.id}
                          node={child}
                        >
                          <TreeViewItem>
                            <TreeViewItemText>{child.name}</TreeViewItemText>
                          </TreeViewItem>
                        </TreeViewNodeProvider>
                      ))}
                    </TreeViewBranchContent>
                  </TreeViewBranch>
                )}
              </TreeViewNodeProvider>
            ))}
          </TreeViewTree>
        </TreeViewRoot>
      )}
    </Matrix>
  ),
  title: "Selection modes",
};

export default specimen({
  about:
    "A nested list that opens and closes, walked by the keyboard as one control. It is given a collection rather than children, so it knows the shape of what it is showing.",
  group: "Layout",
  id: "layout/tree-view",
  scenes: [modes],
  title: "Tree view",
});
