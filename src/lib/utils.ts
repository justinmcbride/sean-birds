// Parse bird list and sort by scientific name

export interface Bird {
  commonName: string;
  scientificName: string;
  original: string; // Original text for output
}

export function sortBirdList(input: string): Bird[] {
  // Check if input is empty
  if (!input.trim()) return [];

  // Split the input by commas
  const birds = input
    .split(",")
    .map((bird) => bird.trim())
    .filter((bird) => bird);

  // Parse each bird entry to extract common name and scientific name
  const parsedBirds = birds.map((bird) => {
    // Look for name format: common name (scientific name)
    const match = bird.match(/(.*?)\s*\((.*?)\)/);

    if (match && match.length >= 3) {
      return {
        commonName: match[1].trim(),
        scientificName: match[2].trim(),
        original: bird,
      };
    }

    // If format doesn't match, return the original text
    return {
      commonName: bird,
      scientificName: "",
      original: bird,
    };
  });

  // Sort the birds by scientific name (alphabetically)
  const sortedBirds = [...parsedBirds].sort((a, b) => {
    if (!a.scientificName) return 1;
    if (!b.scientificName) return -1;
    return a.scientificName.localeCompare(b.scientificName);
  });

  // Format the output with scientific names italicized
  return sortedBirds;
}

// Convert text with formatting markers to HTML format for MS Word compatibility
export function convertToHTML(birds: Bird[]): string {
  let html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>\n<p>`;

  html += birds
    .map((bird) => {
      if (bird.scientificName) {
        return `${bird.commonName} (<em>${bird.scientificName}</em>)`;
      }
      return bird.original;
    })
    .join(", ");

  html += `</p>\n</body></html>`;
  return html;
}
