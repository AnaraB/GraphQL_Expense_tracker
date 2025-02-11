export default function formatDate(timestamp) {
  const date = new Date(parseInt(timestamp)); // Convert timestamp to Date object
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-GB", options); // e.g., "12 Dec 2024"
  }
  
 // Example usage:
const timestamp = "1704067200000";

  const humanReadableDate = formatDate(timestamp);
  console.log(humanReadableDate); // "12 Dec 2024"

