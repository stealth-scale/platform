/**
 * The combobox, under this design system's own name.
 */

/**
 * The builder a combobox is driven by, so the package that has the combobox has it too.
 *
 * A combobox is given a collection rather than children and cannot be used without one. The select
 * beside it publishes the same builder for the same reason: a consumer deep-importing either gets a
 * component that works, rather than one that needs a second package before it will draw.
 */
export { createListCollection, type ListCollection } from "@chakra-ui/react/collection";

export {
  Combobox,
  ComboboxClearTrigger,
  type ComboboxClearTriggerProps,
  ComboboxContent,
  type ComboboxContentProps,
  ComboboxContext,
  ComboboxControl,
  type ComboboxControlProps,
  ComboboxEmpty,
  type ComboboxEmptyProps,
  type ComboboxFocusOutsideEvent,
  type ComboboxHighlightChangeDetails,
  ComboboxIndicatorGroup,
  type ComboboxIndicatorGroupProps,
  ComboboxInput,
  type ComboboxInputProps,
  type ComboboxInputValueChangeDetails,
  type ComboboxInteractOutsideEvent,
  ComboboxItem,
  ComboboxItemContext,
  ComboboxItemGroup,
  ComboboxItemGroupLabel,
  type ComboboxItemGroupLabelProps,
  type ComboboxItemGroupProps,
  ComboboxItemIndicator,
  type ComboboxItemIndicatorProps,
  type ComboboxItemProps,
  ComboboxItemText,
  type ComboboxItemTextProps,
  ComboboxLabel,
  type ComboboxLabelProps,
  ComboboxList,
  type ComboboxListProps,
  type ComboboxOpenChangeDetails,
  type ComboboxPointerDownOutsideEvent,
  ComboboxPositioner,
  type ComboboxPositionerProps,
  ComboboxPropsProvider,
  ComboboxRoot,
  type ComboboxRootProps,
  ComboboxRootProvider,
  type ComboboxRootProviderProps,
  type ComboboxSelectionDetails,
  ComboboxTrigger,
  type ComboboxTriggerProps,
  type ComboboxValueChangeDetails,
  useCombobox,
  useComboboxContext,
  useComboboxItemContext,
  type UseComboboxProps,
  type UseComboboxReturn,
  useComboboxStyles,
} from "@chakra-ui/react/combobox";
