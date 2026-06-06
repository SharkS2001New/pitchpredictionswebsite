import { getFormattedDateWithOffset } from "./GetTodaysDate";

function FormatedDate(num_of_days) {
  try {
    if (num_of_days > 0) {
      return getFormattedDateWithOffset(parseInt(num_of_days, 10));
    }

    return "Invalid number of days provided";
  } catch (err) {
    console.error("Error formatting offset date:", err.message);
    return getFormattedDateWithOffset(1);
  }
}

export default FormatedDate;
