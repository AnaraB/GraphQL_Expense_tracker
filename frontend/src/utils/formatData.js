export default function formatData(timestamp) {
  const data = new Date(parseInt(timestamp)); // Convert timestamp to Date object
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return data.toLocaleDateString("en-GB", options); // Format the date in '12 Dec 2024' format
}

// Example usage:
const timestamp = "18938238048"; // Your example timestamp
const formattedDate = formatData(timestamp);
console.log(formattedDate);
