function getFormattedYesterdayDate() {
    try {
      // Declare current date
      const today = new Date();
      // Get yesterday's date by subtracting one day from the current date
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate());
      // Get the year, month, and day from yesterday's date
      const year = yesterday.getFullYear();
      const month = String(yesterday.getMonth() + 1).padStart(2, '0');
      const day = String(yesterday.getDate()).padStart(2, '0');
      // Format the date in "YYYY-MM-DD" format
      const formatted_date = `${year}-${month}-${day}`;
  
      return formatted_date;
      
    } catch (err) {
      console.log(err.message);
    }
}

export default getFormattedYesterdayDate;