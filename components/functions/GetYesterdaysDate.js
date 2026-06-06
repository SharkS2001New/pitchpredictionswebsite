import getFormattedCurrentDate from "./GetTodaysDate";

function subtractDaysFromDateString(dateString, days) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day - days));
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getFormattedYesterdayDate() {
  try {
    const today = getFormattedCurrentDate();
    return subtractDaysFromDateString(today, 1);
  } catch (err) {
    console.error("Error formatting yesterday date:", err.message);
    const fallbackToday = getFormattedCurrentDate();
    return subtractDaysFromDateString(fallbackToday, 1);
  }
}

export default getFormattedYesterdayDate;
