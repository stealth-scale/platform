/**
 * Draws a number about a thing, and the tiles that hold a wall of them.
 *
 * Every component here is Chakra's under this design system's own name, so an application imports
 * the styling engine nowhere. That is the seam the theme's provider is: the engine underneath stays
 * this repository's to change.
 *
 * @packageDocumentation
 */

export {
  Stat,
  StatDownIndicator,
  type StatDownIndicatorProps,
  StatGroup,
  type StatGroupProps,
  StatHelpText,
  type StatHelpTextProps,
  StatLabel,
  type StatLabelProps,
  StatPropsProvider,
  StatRoot,
  type StatRootProps,
  StatUpIndicator,
  type StatUpIndicatorProps,
  StatValueText,
  type StatValueTextProps,
  StatValueUnit,
  type StatValueUnitProps,
  useStatStyles,
} from "#stat/stat.ts";
export {
  TimerActionTrigger,
  type TimerActionTriggerProps,
  TimerArea,
  type TimerAreaProps,
  TimerContext,
  TimerControl,
  type TimerControlProps,
  TimerItem,
  type TimerItemProps,
  TimerPropsProvider,
  TimerRoot,
  type TimerRootBaseProps,
  type TimerRootProps,
  TimerRootProvider,
  type TimerRootProviderProps,
  TimerSeparator,
  type TimerSeparatorProps,
  useTimer,
  useTimerContext,
  type UseTimerContext,
  type UseTimerProps,
  type UseTimerReturn,
  useTimerStyles,
} from "#timer/timer.ts";
