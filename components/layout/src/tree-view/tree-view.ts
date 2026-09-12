/**
 * The tree view, under this design system's own name.
 */

/**
 * The builder a tree is driven by, so the package that has the tree has it too.
 *
 * A tree is given a collection rather than children and cannot be used without one, so sending a
 * consumer to another package for the only value it will not work without would make this an
 * incomplete package. `collections` publishes the same builder for the components it owns.
 */
export {
  createTreeCollection,
  type TreeCollection,
  type TreeNode,
} from "@chakra-ui/react/collection";
export {
  TreeView,
  TreeViewBranch,
  TreeViewBranchContent,
  type TreeViewBranchContentProps,
  TreeViewBranchControl,
  type TreeViewBranchControlProps,
  TreeViewBranchIndentGuide,
  type TreeViewBranchIndentGuideProps,
  TreeViewBranchIndicator,
  type TreeViewBranchIndicatorProps,
  type TreeViewBranchProps,
  TreeViewBranchText,
  type TreeViewBranchTextProps,
  TreeViewBranchTrigger,
  type TreeViewBranchTriggerProps,
  TreeViewContext,
  type TreeViewExpandedChangeDetails,
  type TreeViewFocusChangeDetails,
  TreeViewItem,
  TreeViewItemIndicator,
  type TreeViewItemIndicatorProps,
  type TreeViewItemProps,
  TreeViewItemText,
  type TreeViewItemTextProps,
  TreeViewLabel,
  type TreeViewLabelProps,
  type TreeViewLoadChildrenCompleteDetails,
  type TreeViewLoadChildrenDetails,
  TreeViewNode,
  TreeViewNodeCheckbox,
  TreeViewNodeCheckboxIndicator,
  type TreeViewNodeCheckboxIndicatorProps,
  type TreeViewNodeCheckboxProps,
  TreeViewNodeContext,
  type TreeViewNodeProps,
  TreeViewNodeProvider,
  type TreeViewNodeProviderProps,
  type TreeViewNodeRenderProps,
  type TreeViewNodeState,
  TreeViewRoot,
  type TreeViewRootProps,
  TreeViewRootProvider,
  type TreeViewRootProviderProps,
  type TreeViewSelectionChangeDetails,
  TreeViewTree,
  type TreeViewTreeProps,
  useTreeView,
  useTreeViewContext,
  useTreeViewNodeContext,
  type UseTreeViewProps,
  type UseTreeViewReturn,
  useTreeViewStyles,
} from "@chakra-ui/react/tree-view";
