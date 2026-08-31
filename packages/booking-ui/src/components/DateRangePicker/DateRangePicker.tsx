import { ChevronLeft, ChevronRight } from "lucide-react";
import { type KeyboardEvent as ReactKeyboardEvent, useMemo, useRef, useState } from "react";

export interface DateRangeValue {
  startDate: string;
  endDate: string;
}

export interface DateRangePickerProps extends DateRangeValue {
  onChange: (value: DateRangeValue) => void;
  minDate?: string;
  startLabel?: string;
  endLabel?: string;
  invalid?: boolean;
  ariaDescribedBy?: string;
}

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const monthFormatter = new Intl.DateTimeFormat("de-DE", {
  month: "long",
  year: "numeric",
});
const dayFormatter = new Intl.DateTimeFormat("de-DE", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

function parseIsoDate(value: string): Date | null {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return date;
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function shiftDateByMonths(date: Date, amount: number): Date {
  const targetMonth = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const lastDay = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate();
  return new Date(
    targetMonth.getFullYear(),
    targetMonth.getMonth(),
    Math.min(date.getDate(), lastDay),
  );
}

function compareDates(left: Date, right: Date): number {
  const leftValue = new Date(left.getFullYear(), left.getMonth(), left.getDate()).getTime();
  const rightValue = new Date(right.getFullYear(), right.getMonth(), right.getDate()).getTime();
  return leftValue - rightValue;
}

function getMonthDays(month: Date): Array<Date | null> {
  const firstDay = startOfMonth(month);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: Array<Date | null> = Array.from({ length: mondayOffset }, () => null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), day));
  }

  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function CalendarMonth({
  month,
  startDate,
  endDate,
  minDate,
  focusDate,
  onSelect,
  onDayKeyDown,
}: {
  month: Date;
  startDate: Date | null;
  endDate: Date | null;
  minDate: Date | null;
  focusDate: Date;
  onSelect: (date: Date) => void;
  onDayKeyDown: (event: ReactKeyboardEvent<HTMLButtonElement>, date: Date) => void;
}) {
  const days = useMemo(() => getMonthDays(month), [month]);

  return (
    <section className="date-range-month" aria-label={monthFormatter.format(month)}>
      <h4>{monthFormatter.format(month)}</h4>
      <div className="date-range-weekdays" aria-hidden="true">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>
      <div className="date-range-days" role="grid" aria-label={monthFormatter.format(month)}>
        {days.map((date, index) => {
          if (!date) {
            return (
              <span className="date-range-day-spacer" role="presentation" key={`spacer-${index}`} />
            );
          }

          const isStart = Boolean(startDate && compareDates(date, startDate) === 0);
          const isEnd = Boolean(endDate && compareDates(date, endDate) === 0);
          const isInRange = Boolean(
            startDate &&
            endDate &&
            compareDates(date, startDate) > 0 &&
            compareDates(date, endDate) < 0,
          );
          const isDisabled = Boolean(minDate && compareDates(date, minDate) < 0);
          const isFocused = compareDates(date, focusDate) === 0;
          const isSelected = isStart || isEnd || isInRange;
          const className = [
            "date-range-day",
            isStart ? "is-start" : "",
            isEnd ? "is-end" : "",
            isInRange ? "is-in-range" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              className={className}
              type="button"
              role="gridcell"
              key={toIsoDate(date)}
              data-date={toIsoDate(date)}
              disabled={isDisabled}
              tabIndex={isDisabled || !isFocused ? -1 : 0}
              aria-label={`${dayFormatter.format(date)}${isStart ? ", Beginn des Zeitraums" : ""}${isEnd ? ", Ende des Zeitraums" : ""}${isInRange ? ", innerhalb des gewählten Zeitraums" : ""}`}
              aria-selected={isSelected}
              onClick={() => onSelect(date)}
              onKeyDown={(event) => onDayKeyDown(event, date)}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Responsive date range input. Coarse-pointer devices use native date fields;
 * desktop devices receive a dependency-free two-month range calendar.
 */
export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  minDate = toIsoDate(new Date()),
  startLabel = "Anreise / Veranstaltungsbeginn",
  endLabel = "Abreise / Veranstaltungsende",
  invalid = false,
  ariaDescribedBy,
}: DateRangePickerProps) {
  const minimumDate = parseIsoDate(minDate);
  const requestedInitialMonth = parseIsoDate(startDate);
  const initialMonth =
    requestedInitialMonth && (!minimumDate || compareDates(requestedInitialMonth, minimumDate) >= 0)
      ? requestedInitialMonth
      : (minimumDate ?? new Date());
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(initialMonth));
  const [focusDate, setFocusDate] = useState(initialMonth);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const start = parseIsoDate(startDate);
  const end = parseIsoDate(endDate);
  const minimum = parseIsoDate(minDate);
  const minimumMonth = minimum ? startOfMonth(minimum) : null;
  const previousMonthsDisabled = Boolean(
    minimumMonth && compareDates(viewMonth, minimumMonth) <= 0,
  );

  function selectDate(date: Date) {
    setFocusDate(date);
    if (!start || end || compareDates(date, start) < 0) {
      onChange({ startDate: toIsoDate(date), endDate: "" });
      return;
    }

    onChange({ startDate, endDate: toIsoDate(date) });
  }

  function focusCalendarDate(date: Date) {
    const nextDate = minimum && compareDates(date, minimum) < 0 ? minimum : date;
    const nextMonth = startOfMonth(nextDate);
    const lastVisibleMonth = addMonths(viewMonth, 1);

    if (compareDates(nextMonth, viewMonth) < 0) {
      setViewMonth(nextMonth);
    } else if (compareDates(nextMonth, lastVisibleMonth) > 0) {
      setViewMonth(addMonths(nextMonth, -1));
    }

    setFocusDate(nextDate);
    window.setTimeout(() => {
      pickerRef.current
        ?.querySelector<HTMLButtonElement>(`[data-date="${toIsoDate(nextDate)}"]`)
        ?.focus();
    }, 0);
  }

  function handleDayKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, date: Date) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectDate(date);
      return;
    }

    const mondayOffset = (date.getDay() + 6) % 7;
    let nextDate: Date | null = null;

    if (event.key === "ArrowLeft") nextDate = addDays(date, -1);
    else if (event.key === "ArrowRight") nextDate = addDays(date, 1);
    else if (event.key === "ArrowUp") nextDate = addDays(date, -7);
    else if (event.key === "ArrowDown") nextDate = addDays(date, 7);
    else if (event.key === "Home") nextDate = addDays(date, -mondayOffset);
    else if (event.key === "End") nextDate = addDays(date, 6 - mondayOffset);
    else if (event.key === "PageUp") nextDate = shiftDateByMonths(date, -1);
    else if (event.key === "PageDown") nextDate = shiftDateByMonths(date, 1);

    if (!nextDate) return;
    event.preventDefault();
    focusCalendarDate(nextDate);
  }

  function changeVisibleMonth(amount: number) {
    const nextViewMonth = addMonths(viewMonth, amount);
    const nextFocusDate =
      minimum && compareDates(nextViewMonth, minimum) < 0 ? minimum : nextViewMonth;
    setViewMonth(nextViewMonth);
    setFocusDate(nextFocusDate);
  }

  return (
    <div className="date-range-picker" ref={pickerRef}>
      <div className="date-range-native">
        <label>
          {startLabel}
          <input
            type="date"
            value={startDate}
            min={minDate}
            aria-invalid={invalid}
            aria-describedby={ariaDescribedBy}
            onChange={(event) =>
              onChange({
                startDate: event.target.value,
                endDate: endDate && event.target.value > endDate ? "" : endDate,
              })
            }
          />
        </label>
        <label>
          {endLabel}
          <input
            type="date"
            value={endDate}
            min={startDate || minDate}
            aria-invalid={invalid}
            aria-describedby={ariaDescribedBy}
            onChange={(event) => onChange({ startDate, endDate: event.target.value })}
          />
        </label>
      </div>

      <div className="date-range-desktop" aria-invalid={invalid} aria-describedby={ariaDescribedBy}>
        <div className="date-range-toolbar">
          <p aria-live="polite">
            {startDate
              ? endDate
                ? "Zeitraum gewählt"
                : "Jetzt Enddatum wählen"
              : "Start- und Enddatum wählen"}
          </p>
          <div>
            <button
              type="button"
              aria-label="Vorherige Monate"
              disabled={previousMonthsDisabled}
              onClick={() => changeVisibleMonth(-1)}
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" aria-label="Nächste Monate" onClick={() => changeVisibleMonth(1)}>
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="date-range-months">
          <CalendarMonth
            month={viewMonth}
            startDate={start}
            endDate={end}
            minDate={minimum}
            focusDate={focusDate}
            onSelect={selectDate}
            onDayKeyDown={handleDayKeyDown}
          />
          <CalendarMonth
            month={addMonths(viewMonth, 1)}
            startDate={start}
            endDate={end}
            minDate={minimum}
            focusDate={focusDate}
            onSelect={selectDate}
            onDayKeyDown={handleDayKeyDown}
          />
        </div>
      </div>
    </div>
  );
}
