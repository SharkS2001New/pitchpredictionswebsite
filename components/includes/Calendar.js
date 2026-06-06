'use client';

import Calendar from "react-calendar";
import { memo, useMemo, useState } from "react";
import useCompatRouter from "../functions/use-compat-router";
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

  const dateSelected = router.query["filter_date"];
  const isDateFilterPage =
    router.pathname.substring(1) === "[football-prediction-for-date]" &&
    dateSelected != undefined;

  const calendarValue = isDateFilterPage ? new Date(dateSelected) : date;

  function onChange(nextDate) {
    setDate(nextDate);

    const selected = new Date(nextDate);
    const tzOffset = selected.getTimezoneOffset() * 60000;
    const localDate = new Date(selected.getTime() - tzOffset);
    const isoDate = localDate.toISOString().substring(0, 10);

    if (!router.isReady) return;

    router.push({
      pathname: "/football-predictions-for-" + isoDate,
      query: { filter_date: isoDate },
    });
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
