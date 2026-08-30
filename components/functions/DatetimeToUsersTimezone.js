/**
 * Normalize API date strings into a Date instance.
 * Handles DD/MM/YYYY, DD-MM-YYYY, MySQL "YYYY-MM-DD HH:mm:ss", and ISO strings.
 */
export function normalizeDateInput(dateValue) {
  if (dateValue == null || dateValue === "") return null;

  if (dateValue instanceof Date) {
    return Number.isNaN(dateValue.getTime()) ? null : dateValue;
  }

  if (typeof dateValue === "number" || /^\d{10,13}$/.test(String(dateValue).trim())) {
    const numeric = Number(dateValue);
    const date = new Date(numeric < 1e12 ? numeric * 1000 : numeric);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  let dateInput = String(dateValue).trim();
  const lowered = dateInput.toLowerCase();

  if (
    lowered === "null" ||
    lowered === "undefined" ||
    lowered === "invalid date" ||
    lowered === "n/a" ||
    lowered === "tbd" ||
    dateInput === "-"
  ) {
    return null;
  }

  if (/^0000-00-00/.test(dateInput)) {
    return null;
  }

  if (/^\d{2}\/\d{2}\/\d{4}/.test(dateInput)) {
    // APIs mix MM/DD/YYYY (most fixture endpoints) and DD/MM/YYYY (some auth/search).
    const [datePart, timePart = "00:00"] = dateInput.split(/\s+/);
    const [first, second, year] = datePart.split("/");
    const a = Number(first);
    const b = Number(second);
    let month;
    let day;

    if (b > 12 && a >= 1 && a <= 12) {
      // e.g. 08/30/2026 → August 30 (US)
      month = first;
      day = second;
    } else if (a > 12 && b >= 1 && b <= 12) {
      // e.g. 30/08/2026 → August 30 (EU)
      day = first;
      month = second;
    } else {
      // Ambiguous (both <= 12). Prefer MM/DD — backend DATE_FORMAT uses %m/%d/%Y.
      month = first;
      day = second;
    }

    dateInput = `${year}-${month}-${day}T${
      timePart.length === 5 ? `${timePart}:00` : timePart
    }`;
  } else if (/^\d{2}-\d{2}-\d{4}/.test(dateInput)) {
    const [datePart, timePart = "00:00"] = dateInput.split(/\s+/);
    const [first, second, year] = datePart.split("-");
    const a = Number(first);
    const b = Number(second);
    let month;
    let day;

    if (b > 12 && a >= 1 && a <= 12) {
      month = first;
      day = second;
    } else if (a > 12 && b >= 1 && b <= 12) {
      day = first;
      month = second;
    } else {
      // Dashed dates from our APIs are usually DD-MM-YYYY.
      day = first;
      month = second;
    }

    dateInput = `${year}-${month}-${day}T${
      timePart.length === 5 ? `${timePart}:00` : timePart
    }`;
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    dateInput = `${dateInput}T00:00:00`;
  } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(dateInput)) {
    dateInput = dateInput.replace(" ", "T");
    if (/T\d{2}:\d{2}$/.test(dateInput)) {
      dateInput += ":00";
    }
  }

  const date = new Date(dateInput);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Pick the first parseable kickoff datetime from fixture / jackpot payloads. */
export function resolveFixtureDateTime(fixture) {
  if (!fixture) return null;

  const candidates = [
    fixture.match?.datetime,
    fixture.match?.unformatted_date,
    fixture.match?.unformated_date,
    fixture.datetime,
    fixture.date,
    fixture.unformatted_date,
    fixture.unformatedDate,
    fixture.unformated_date,
    fixture.fixture_date,
    fixture.match_date,
    fixture.start_datetime_formatted,
  ];

  for (const candidate of candidates) {
    if (candidate == null || candidate === "") continue;
    if (normalizeDateInput(candidate)) return candidate;
  }

  return null;
}

export function formatFixtureDateTime(dateValue) {
  if (!dateValue) return "Date not available";

  const formatted = DateTimeToUsersTimezone(dateValue);
  if (isInvalidFormattedDate(formatted)) return formatted;
  return formatted;
}

export function formatFixtureDate(dateValue) {
  const formatted = formatFixtureDateTime(dateValue);
  if (isInvalidFormattedDate(formatted)) return formatted;
  return formatted.split(" ")[0] || formatted;
}

export function formatFixtureTime(dateValue) {
  const formatted = formatFixtureDateTime(dateValue);
  if (isInvalidFormattedDate(formatted)) return "-";
  const parts = formatted.split(" ");
  return parts.length > 1 ? parts[1] : "-";
}

function isInvalidFormattedDate(value) {
  return (
    value === "Invalid date" ||
    value === "Date not available" ||
    value === "Date error"
  );
}

function DateTimeToUsersTimezone(original_date_given) {
  if (!original_date_given) return "Date not available";

  try {
    const date = normalizeDateInput(original_date_given);

    if (!date) {
      return "Invalid date";
    }

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: userTimeZone,
    };

    const formatter = new Intl.DateTimeFormat("en-GB", options);
    const parts = formatter.formatToParts(date);

    const day = parts.find((p) => p.type === "day")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const year = parts.find((p) => p.type === "year")?.value;
    let hour = parts.find((p) => p.type === "hour")?.value;
    const minute = parts.find((p) => p.type === "minute")?.value;

    if (hour && hour.startsWith("0") && hour.length > 1) {
      hour = hour.substring(1);
    }

    return `${day}/${month}/${year} ${hour}:${minute}`;
  } catch (error) {
    console.error("Error converting date:", error);
    return "Date error";
  }
}

export default DateTimeToUsersTimezone;
