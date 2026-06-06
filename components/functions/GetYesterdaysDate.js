import getFormattedCurrentDate, { addDaysToIsoDate } from "./GetTodaysDate";

function getFormattedYesterdayDate() {
  try {
    return addDaysToIsoDate(getFormattedCurrentDate(), -1);
  } catch (err) {
    console.error("Error formatting yesterday date:", err.message);
    return addDaysToIsoDate(getFormattedCurrentDate(), -1);
  }
}

export default getFormattedYesterdayDate;
