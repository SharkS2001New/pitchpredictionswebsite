'use client';

import Calendar from "react-calendar";
import { memo, useMemo, useState } from "react";
import useCompatRouter from "../functions/use-compat-router";
import { formatLocalIsoDate } from "../functions/GetTodaysDate";
import "react-calendar/dist/Calendar.css";

function MyCalendar() {
  const router = useCompatRouter();
  const [date, setDate] = useState(() => new Date());

  const { minDate, maxDate } = useMemo(() => {
    const min = new Date();
    min.setDate(min.getDate() - 60);

    const max = new Date();
    max.setDate(max.getDate() + 60);

    return { minDate: min, maxDate: max };
  }, []);

  const dateSelected = Array.isArray(router.query?.filter_date)
    ? router.query.filter_date[0]
    : router.query?.filter_date;

  const isDateFilterPage =
    typeof dateSelected === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateSelected);

  const calendarValue = isDateFilterPage
    ? (() => {
        const [year, month, day] = dateSelected.split("-").map(Number);
        return new Date(year, month - 1, day);
      })()
    : date;

  function onChange(nextDate) {
    setDate(nextDate);

    const isoDate = formatLocalIsoDate(nextDate);
    if (!isoDate) return;

    // Full navigation so SSR always loads fixtures for the chosen date.
    window.location.href = `/football-predictions-for-${isoDate}?filter_date=${isoDate}`;
  }

  return (
    <div className="row sidebar-calendar" suppressHydrationWarning>
      <Calendar
        className="sidebar-calendar-widget"
        locale="en-US"
        value={calendarValue}
        minDate={minDate}
        maxDate={maxDate}
        onChange={onChange}
      />
    </div>
  );
}

export default memo(MyCalendar);
