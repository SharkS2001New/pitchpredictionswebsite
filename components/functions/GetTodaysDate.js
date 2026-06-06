// components/functions/GetTodaysDate.js

const SITE_TIMEZONE = "Africa/Nairobi";

function getFormattedDateInTimezone(timeZone, date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getFormattedCurrentDate() {
  try {
    return getFormattedDateInTimezone(SITE_TIMEZONE);
  } catch (err) {
    console.error("Error formatting current date:", err.message);
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}

export default getFormattedCurrentDate;
