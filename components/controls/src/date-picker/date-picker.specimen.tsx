/**
 * Shows the date picker at every size, over one day, a range, and by month and year.
 */

import { type ReactElement } from "react";

import { CalendarIcon, XIcon } from "lucide-react";

import { Column, Matrix, type Scene, specimen } from "@stealthscale/foundation-specimen";

import {
  DatePickerClearTrigger,
  DatePickerContent,
  DatePickerContext,
  DatePickerControl,
  DatePickerIndicatorGroup,
  DatePickerInput,
  DatePickerLabel,
  DatePickerNextTrigger,
  DatePickerPositioner,
  DatePickerPrevTrigger,
  DatePickerRoot,
  type DatePickerRootProps,
  DatePickerTable,
  DatePickerTableBody,
  DatePickerTableCell,
  DatePickerTableCellTrigger,
  DatePickerTableHead,
  DatePickerTableHeader,
  DatePickerTableRow,
  DatePickerTrigger,
  DatePickerView,
  DatePickerViewControl,
  DatePickerViewTrigger,
  parseDate,
} from "#date-picker/date-picker.ts";

/**
 * How the field is bordered.
 */
const VARIANTS = ["outline", "subtle", "flushed"] as const;

/**
 * How large it is.
 */
const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

/**
 * Which day is picked to start with.
 */
const DAY = parseDate("2026-09-04");

/**
 * Draws the grid of days for whichever view is open.
 *
 * The header row, the week rows and the cells all come out of the same api, so the calendar is the
 * same markup for a day view, a month view and a year view.
 *
 * @returns One calendar.
 */
function Days(): ReactElement {
  return (
    <DatePickerView view="day">
      <DatePickerContext>
        {(picker) => (
          <Column gap="2">
            <DatePickerViewControl>
              <DatePickerPrevTrigger />
              <DatePickerViewTrigger>
                <DatePickerLabel />
              </DatePickerViewTrigger>
              <DatePickerNextTrigger />
            </DatePickerViewControl>

            <DatePickerTable>
              <DatePickerTableHead>
                <DatePickerTableRow>
                  {picker.weekDays.map((day) => (
                    <DatePickerTableHeader key={day.short}>{day.narrow}</DatePickerTableHeader>
                  ))}
                </DatePickerTableRow>
              </DatePickerTableHead>
              <DatePickerTableBody>
                {picker.weeks.map((week) => (
                  <DatePickerTableRow key={week.map((day) => day.toString()).join()}>
                    {week.map((value) => (
                      <DatePickerTableCell key={value.toString()} value={value}>
                        <DatePickerTableCellTrigger>{value.day}</DatePickerTableCellTrigger>
                      </DatePickerTableCell>
                    ))}
                  </DatePickerTableRow>
                ))}
              </DatePickerTableBody>
            </DatePickerTable>
          </Column>
        )}
      </DatePickerContext>
    </DatePickerView>
  );
}

/**
 * Draws one picker: the field, and the calendar it opens.
 *
 * A range needs two fields rather than one, since each end is typed separately, so the second is
 * drawn only when the picker is set to take one.
 *
 * @param props - The styling props, passed through to `DatePickerRoot`.
 * @returns One picker.
 */
function Picker(props: Omit<DatePickerRootProps, "children">): ReactElement {
  const ranged = props.selectionMode === "range";

  return (
    <DatePickerRoot colorPalette="primary" width={ranged ? "20rem" : "14rem"} {...props}>
      <DatePickerControl>
        <DatePickerInput index={0} />
        {ranged ? <DatePickerInput index={1} /> : null}
        <DatePickerIndicatorGroup>
          <DatePickerClearTrigger>
            <XIcon size={14} />
          </DatePickerClearTrigger>
          <DatePickerTrigger>
            <CalendarIcon size={16} />
          </DatePickerTrigger>
        </DatePickerIndicatorGroup>
      </DatePickerControl>
      <DatePickerPositioner>
        <DatePickerContent>
          <Days />
        </DatePickerContent>
      </DatePickerPositioner>
    </DatePickerRoot>
  );
}

export const variants: Scene = {
  about:
    "How the field is bordered, which the calendar takes no notice of: what opens is the same panel however the field that opened it is drawn. Open one.",
  draw: () => (
    <Matrix gap="8" knob="variant" of={VARIANTS}>
      {(variant) => <Picker defaultValue={[DAY]} variant={variant} />}
    </Matrix>
  ),
  title: "Variants",
};

export const sizes: Scene = {
  about:
    "The field steps with the size and the calendar does not, since a calendar has a fixed number of columns and shrinking it would put the days out of reach.",
  draw: () => (
    <Matrix direction="row" gap="4" knob="size" of={SIZES}>
      {(size) => <Picker defaultValue={[DAY]} size={size} />}
    </Matrix>
  ),
  title: "Sizes",
};

export const spans: Scene = {
  about:
    "A range needs two fields rather than one, since each end is typed separately. Hiding the outside days is the other flag worth seeing: it leaves the leading and trailing cells empty rather than filling them from the neighbouring months.",
  draw: () => (
    <Column align="start" gap="4">
      <Picker defaultValue={[DAY, DAY.add({ days: 6 })]} selectionMode="range" />
      <Picker defaultValue={[DAY]} hideOutsideDays />
      <Picker defaultValue={[DAY]} disabled />
    </Column>
  ),
  title: "Ranges, outside days and disabled",
};

export default specimen({
  about:
    "A date typed or picked from a calendar, over one day or a span of them. The calendar is the same markup for a day, a month and a year view.",
  group: "Controls",
  id: "controls/date-picker",
  scenes: [variants, sizes, spans],
  title: "Date picker",
});
