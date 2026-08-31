import { useEffect, useState } from "react";
import useCompatRouter from "../functions/use-compat-router";
import { formatLocalIsoDate } from "../functions/GetTodaysDate";

function CustomDatePicker() {
  const router = useCompatRouter();
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const dateSelected = Array.isArray(router.query?.filter_date)
    ? router.query.filter_date[0]
    : router.query?.filter_date;

  useEffect(() => {
    if (typeof dateSelected === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateSelected)) {
      const [year, month, day] = dateSelected.split("-").map(Number);
      setSelectedDate(new Date(year, month - 1, day));
    }
  }, [dateSelected]);

  function getDateRange() {
    const previousDays = 6;
    const nextDays = 15;
    const today = new Date();
    const firstDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - previousDays
    );
    const lastDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + nextDays
    );
    return { firstDate, lastDate };
  }

  function openRoutingPages(isoDate) {
    if (!router.isReady || !isoDate) return;

    const path = router.pathname?.substring(1) || "";

    if (path === "football-predictions/double-chance-predictions") {
      router.push({
        pathname: "/football-predictions/double-chance-predictions",
        query: { filter_date: isoDate },
      });
      return;
    }

    if (
      path === "football-predictions/predictions-under-over" ||
      path === "football-predictions/predictions-under-over-goals"
    ) {
      router.push({
        pathname: "/football-predictions/predictions-under-over",
        query: { filter_date: isoDate },
      });
      return;
    }

    if (path === "football-predictions/predictions-halftime-fulltime") {
      router.push({
        pathname: "/football-predictions/predictions-halftime-fulltime",
        query: { filter_date: isoDate },
      });
      return;
    }

    if (path === "football-predictions/predictions-both-to-score") {
      router.push({
        pathname: "/football-predictions/predictions-both-to-score",
        query: { filter_date: isoDate },
      });
      return;
    }

    // Full page load so SSR always picks up the selected date.
    window.location.href = `/football-predictions-for-${isoDate}?filter_date=${isoDate}`;
  }

  function handleDateChange(event) {
    const isoDate = event.target.value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return;

    const [year, month, day] = isoDate.split("-").map(Number);
    const newDate = new Date(year, month - 1, day);
    setSelectedDate(newDate);
    openRoutingPages(isoDate);
  }

  function selectPreviousDateOnClick() {
    const { firstDate } = getDateRange();
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    if (newDate >= firstDate) {
      setSelectedDate(newDate);
      openRoutingPages(formatLocalIsoDate(newDate));
    }
  }

  function selectNextDateOnClick() {
    const { lastDate } = getDateRange();
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    if (newDate <= lastDate) {
      setSelectedDate(newDate);
      openRoutingPages(formatLocalIsoDate(newDate));
    }
  }

  const activeIso =
    typeof dateSelected === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateSelected)
      ? dateSelected
      : formatLocalIsoDate(selectedDate);

  const { firstDate, lastDate } = getDateRange();
  const dateOptions = [];
  for (
    let cursor = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());
    cursor <= lastDate;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    dateOptions.push(new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate()));
  }

  const today = new Date();

  return (
    <div className="row custom-select">
      <div
        className="col-2"
        onClick={selectPreviousDateOnClick}
        style={{ fontSize: "15px", cursor: "pointer", marginTop: "3px" }}
      >
        <span
          style={{
            padding: "4px 10px 3px 10px",
            background: "#202c3c",
            color: "white",
            borderRadius: "5px",
          }}
        >
          <i className="bi bi-arrow-left-circle"></i>
        </span>
      </div>
      <div className="col-8" style={{ backgroundColor: "#202c3c", borderRadius: "5px" }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 30, fontSize: "17px" }}>&#128197;</span>
          <select
            id="date-select"
            name="date"
            className="form-control text-center custom-select-option fixturesTextSize"
            value={activeIso}
            onChange={handleDateChange}
            style={{
              padding: "3px 10px 3px 10px",
              background: "#202c3c",
              color: "white",
              border: "none",
              fontWeight: "bold",
            }}
            aria-label="Select match date"
          >
            {dateOptions.map((optionDate) => {
              const iso = formatLocalIsoDate(optionDate);
              const isToday = optionDate.toDateString() === today.toDateString();
              return (
                <option
                  key={iso}
                  value={iso}
                  style={isToday ? { fontWeight: "bold" } : {}}
                >
                  {isToday
                    ? "TODAY"
                    : `${optionDate.getDate()}/${(
                        "0" + (optionDate.getMonth() + 1)
                      ).slice(-2)}. ${optionDate.toLocaleDateString("en-US", {
                        weekday: "short",
                      })}`}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div
        className="col-2"
        onClick={selectNextDateOnClick}
        style={{ fontSize: "15px", cursor: "pointer", marginTop: "3px" }}
      >
        <span
          style={{
            padding: "3px 10px 3px 10px",
            background: "#202c3c",
            color: "white",
            borderRadius: "5px",
          }}
        >
          <i className="bi bi-arrow-right-circle"></i>
        </span>
      </div>
    </div>
  );
}

export default CustomDatePicker;

