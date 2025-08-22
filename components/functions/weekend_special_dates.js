function WeekendSpecialDates() {
    try {
      const dates = [];
  
      const curr = new Date(); // Get the current date
      const currentDay = curr.getDay();
  
      // Calculate days until the next Friday, Saturday, and Sunday
      const daysUntilFriday = (5 - currentDay + 7) % 7; // Modulo ensures positive values
      const daysUntilSaturday = (6 - currentDay + 7) % 7;
      const daysUntilSunday = (7 - currentDay + 7) % 7;
  
      const nextFriday = new Date(curr.getTime() + daysUntilFriday * 24 * 60 * 60 * 1000);
      const nextSaturday = new Date(curr.getTime() + daysUntilSaturday * 24 * 60 * 60 * 1000);
      const nextSunday = new Date(curr.getTime() + daysUntilSunday * 24 * 60 * 60 * 1000);
  
      // Format dates
      dates.push(formatDate(nextFriday));
      dates.push(formatDate(nextSaturday));
      dates.push(formatDate(nextSunday));
  
      return dates;
    } catch (err) {
      console.error(err.message);
      return err.message;
    }
  }
  
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  
  export default WeekendSpecialDates;
  