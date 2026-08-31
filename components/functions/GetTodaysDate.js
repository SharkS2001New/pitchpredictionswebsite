// components/functions/GetTodaysDate.js

const SITE_TIMEZONE = "Africa/Nairobi";

function getDatePartsInTimezone(timeZone, date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
}

function partsToIsoDate(parts) {
  const lookup = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value])
  );
  const { year, month, day } = lookup;

  if (!year || !month || !day) {
    throw new Error("Unable to parse date parts");
  }

  return `${year}-${month}-${day}`;
}

function getFormattedDateInTimezone(timeZone, date = new Date()) {
  return partsToIsoDate(getDatePartsInTimezone(timeZone, date));
}

function getFormattedCurrentDate() {
  try {
    return getFormattedDateInTimezone(SITE_TIMEZONE);
  } catch (err) {
    console.error("Error formatting current date:", err.message);
    const date = new Date();
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}

function addDaysToIsoDate(isoDate, days) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getFormattedDateWithOffset(daysFromToday) {
  return addDaysToIsoDate(getFormattedCurrentDate(), daysFromToday);
}

/** Format a Date as YYYY-MM-DD using local calendar fields (no UTC shift). */
function formatLocalIsoDate(date = new Date()) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Extract YYYY-MM-DD from /football-predictions-for-YYYY-MM-DD slug or query. */
function resolveFilterDateFromRoute({ params = {}, query = {} } = {}) {
  const fromQuery = Array.isArray(query.filter_date)
    ? query.filter_date[0]
    : query.filter_date;

  if (typeof fromQuery === "string" && /^\d{4}-\d{2}-\d{2}$/.test(fromQuery)) {
    return fromQuery;
  }

  const slug =
    params["football-prediction-for-date"] ||
    params.filter_date ||
    "";

  if (typeof slug === "string") {
    const match = slug.match(/(\d{4}-\d{2}-\d{2})/);
    if (match) return match[1];
  }

  return "";
}

export default getFormattedCurrentDate;
export {
  SITE_TIMEZONE,
  addDaysToIsoDate,
  getFormattedDateWithOffset,
  getFormattedDateInTimezone,
  formatLocalIsoDate,
  resolveFilterDateFromRoute,
};
