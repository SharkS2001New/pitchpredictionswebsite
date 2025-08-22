function DateTimeToUsersTimezone(original_date_given) {
     const date = new Date(original_date_given);
 
     // Get the user's current timezone
     const usersTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
 
     // Get the offset from UTC in minutes
     const offsetInMinutes = new Date().getTimezoneOffset();
     
     // Calculate the hours part of the timezone offset
     const offsetInHours = Math.floor(-offsetInMinutes / 60);
 
     // Calculate the remaining minutes after extracting the hours
     const extraMinutes = Math.abs(offsetInMinutes % 60);
  
     // Adjust the date by adding the computed time difference
     date.setHours(date.getHours() + offsetInHours);
     date.setMinutes(date.getMinutes() + extraMinutes);
 
     const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: usersTimeZone };
 
     const inputDateString = date.toLocaleString('en-US', options);
 
     // Convert to the desired format (dd/mm/yyyy H:mm)
     const inputDate = new Date(inputDateString);
 
     const options1 = { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
 
     const myNewDateString = inputDate.toLocaleDateString('en-GB', options1).replace(',', '');
 
     return myNewDateString;
 }
 
 export default DateTimeToUsersTimezone;
 