function FormatedDate(num_of_days) {
    try {
      if (num_of_days > 0) {
        // Declare current date
        const today = new Date();
        // Declare next days date and initialize
        const tomorrow = new Date(today);
        // Compute days and add days to get date needed
        tomorrow.setDate(tomorrow.getDate() + parseInt(num_of_days));
        // Get the year, month, and day from the next date
        const year = tomorrow.getFullYear();
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const day = String(tomorrow.getDate()).padStart(2, '0');
        // Format the date in "YYYY-MM-DD" format
        const formatted_date = `${year}-${month}-${day}`;
  
        return formatted_date;
      } else {
        return "Invalid number of days provided";
      }
    } catch (err) {
    }
}  

export default FormatedDate;