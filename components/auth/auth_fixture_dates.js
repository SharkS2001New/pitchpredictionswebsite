import getFormattedCurrentDate, {
  getFormattedDateWithOffset,
} from "../functions/GetTodaysDate";

export function getAuthFixtureDates() {
  const today = getFormattedCurrentDate();
  return {
    yesterday: getFormattedDateWithOffset(-1),
    today,
    tomorrow: getFormattedDateWithOffset(1),
  };
}

export default getAuthFixtureDates;
