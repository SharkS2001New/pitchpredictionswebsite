const colors = ["rgb(0, 70, 130)", "purple", "rgb(30, 168, 236)", "rgb(127, 0, 41)", "rgb(189, 0, 0)", "purple", "brown", "red"]; // Array of colors
const colorMapping = {}; // Object to store the color mapping
const colorWithName = []; // Array to store color with description

function assignColorToDescription(description) {
  if (!colorMapping[description]) {
    // If the description does not have a color assigned yet, assign a new color based on the index
    const colorIndex = Object.keys(colorMapping).length % colors.length;
    const color = colors[colorIndex];

    // Check if the description contains "Relagation" and set the color accordingly
    if (description !== null) {
      const normalizedDescription = description.toSentenceCase();
      if (normalizedDescription.includes("Relegation")) {
        if (normalizedDescription === "Relegation") {
          colorWithName.push({ color: "red", description });
          colorMapping[description] = "red";
        } else {
          colorWithName.push({ color: "brown", description });
          colorMapping[description] = "brown";
        }
      } else {
        colorWithName.push({ color, description });
        colorMapping[description] = color;
      }
    }
  }
  return { color: colorMapping[description], colorWithName };
}


export default assignColorToDescription;

String.prototype.toSentenceCase = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};