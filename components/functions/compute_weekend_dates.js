import React from "react";

function DateofWeekend() {
  try {
    var dates = [];

    var curr = new Date(); // get current date
    var currentDay = curr.getDay();
    var daysUntilSaturday = 6 - currentDay; // Number of days until next Saturday
    var daysUntilSunday = daysUntilSaturday + 1; // Number of days until next Sunday

    var nextSaturday = new Date(curr.getTime() + daysUntilSaturday * 24 * 60 * 60 * 1000);
    var nextSunday = new Date(curr.getTime() + daysUntilSunday * 24 * 60 * 60 * 1000);

    var formattedNextSaturday = formatDate(nextSaturday);
    var formattedNextSunday = formatDate(nextSunday);

    // push the dates to array
    dates.push(formattedNextSaturday);
    dates.push(formattedNextSunday);

    return dates;
  } catch (err) {
    console.log(err.message);
    return err.message;
  }
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default DateofWeekend;
