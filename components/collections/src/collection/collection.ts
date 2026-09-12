/**
 * The builders that turn a list of records into something a collection component can read.
 *
 * A listbox, a select, a combobox or a tree is given a collection rather than children, so the
 * component knows how to walk what it is showing without being told again at every callback.
 */

export {
  type CollectionItem,
  type CollectionOptions,
  createFileTreeCollection,
  createGridCollection,
  createListCollection,
  createTreeCollection,
  type FilePathTreeNode,
  type FlatTreeNode,
  type GridCollection,
  type ListCollection,
  type TreeCollection,
  type TreeCollectionOptions,
  type TreeNode,
} from "@chakra-ui/react/collection";
