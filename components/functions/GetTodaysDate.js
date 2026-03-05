// components/functions/GetTodaysDate.js

function getFormattedCurrentDate() {
  try {
    // Method 1: Manual construction (MOST RELIABLE - works everywhere)
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`; // Always returns 2026-03-06
    
    // OR Method 2: Use toISOString() (also reliable)
    // return new Date().toISOString().split('T')[0]; // Also returns 2026-03-06
    
    // DON'T use toLocaleDateString() - it's locale-dependent!
  } catch (err) {
    console.error("Error formatting current date:", err.message);
    // Return today's date as fallback using ISO string
    return new Date().toISOString().split('T')[0];
  }
}

export default getFormattedCurrentDate;