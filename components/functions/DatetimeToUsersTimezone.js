function DateTimeToUsersTimezone(original_date_given) {
    if (!original_date_given) return "Date not available";
    
    try {
        let dateInput = original_date_given;

        if (typeof dateInput === "string" && /^\d{2}\/\d{2}\/\d{4}/.test(dateInput)) {
            const [datePart, timePart = "00:00"] = dateInput.split(" ");
            const [day, month, year] = datePart.split("/");
            dateInput = `${year}-${month}-${day}T${timePart.length === 5 ? `${timePart}:00` : timePart}`;
        }

        const date = new Date(dateInput);
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
            return "Invalid date";
        }
        
        // Get user's timezone
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Format options
        const options = {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: userTimeZone
        };
        
        // Format using Intl.DateTimeFormat
        const formatter = new Intl.DateTimeFormat('en-GB', options);
        const parts = formatter.formatToParts(date);
        
        // Extract the parts
        const day = parts.find(p => p.type === 'day')?.value;
        const month = parts.find(p => p.type === 'month')?.value;
        const year = parts.find(p => p.type === 'year')?.value;
        let hour = parts.find(p => p.type === 'hour')?.value;
        const minute = parts.find(p => p.type === 'minute')?.value;
        
        // Remove leading zero from hour
        if (hour && hour.startsWith('0') && hour.length > 1) {
            hour = hour.substring(1);
        }
        
        return `${day}/${month}/${year} ${hour}:${minute}`;
        
    } catch (error) {
        console.error('Error converting date:', error);
        return "Date error";
    }
}

export default DateTimeToUsersTimezone;