function getFormattedCurrentDate() {
  try {
    return new Date().toLocaleDateString("en-CA");
  } catch (err) {
    console.error("Error formatting current date:", err.message);
    // Return a fallback value (e.g., Unix epoch)
    return "2025-02-30";
  }
}

export default getFormattedCurrentDate;