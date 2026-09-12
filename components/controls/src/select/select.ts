/**
 * The select, under this design system's own name.
 */

/**
 * The builder a select is driven by, so the package that has the select has it too.
 *
 * A select is given a collection rather than children and cannot be used without one, so sending a
 * consumer to another package for the only value it will not work without would make this an
 * incomplete package. `collections` publishes the same builder for the components it owns.
 */
export { createListCollection, type ListCollection } from "@chakra-ui/react/collection";
export {
  Select,
  SelectClearTrigger,
  type SelectClearTriggerProps,
  SelectContent,
  type SelectContentProps,
  SelectContext,
  SelectControl,
  type SelectControlProps,
  type SelectFocusOutsideEvent,
  SelectHiddenSelect,
  type SelectHighlightChangeDetails,
  SelectIndicator,
  SelectIndicatorGroup,
  type SelectIndicatorGroupProps,
  type SelectIndicatorProps,
  type SelectInteractOutsideEvent,
  SelectItem,
  SelectItemContext,
  SelectItemGroup,
  SelectItemGroupLabel,
  type SelectItemGroupLabelProps,
  type SelectItemGroupProps,
  SelectItemIndicator,
  type SelectItemIndicatorProps,
  type SelectItemProps,
  SelectItemText,
  type SelectItemTextProps,
  SelectLabel,
  type SelectLabelProps,
  SelectList,
  type SelectListProps,
  type SelectOpenChangeDetails,
  type SelectPointerDownOutsideEvent,
  SelectPositioner,
  type SelectPositionerProps,
  SelectPropsProvider,
  SelectRoot,
  type SelectRootComponent,
  type SelectRootProps,
  SelectRootProvider,
  type SelectRootProviderProps,
  SelectTrigger,
  type SelectTriggerProps,
  type SelectValueChangeDetails,
  SelectValueText,
  type SelectValueTextProps,
  useSelect,
  useSelectContext,
  useSelectItemContext,
  type UseSelectProps,
  type UseSelectReturn,
  useSelectStyles,
} from "@chakra-ui/react/select";
