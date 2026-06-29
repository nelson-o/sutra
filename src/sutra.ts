export const markerCount = 32;

const devanagariDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

export type SutraPage = {
  markerNumber: number;
  marker: string;
  passages: string[];
};

function toDevanagariNumber(value: number) {
  return String(value)
    .split("")
    .map((digit) => devanagariDigits[Number(digit)])
    .join("");
}

function markerFor(value: number) {
  return `॥${toDevanagariNumber(value)}॥`;
}

export function createSutraPages(source: string): SutraPage[] {
  const text = source.trim();
  let cursor = 0;

  return Array.from({ length: markerCount }, (_, index) => {
    const markerNumber = index + 1;
    const marker = markerFor(markerNumber);
    const markerIndex = text.indexOf(marker, cursor);
    const endIndex =
      markerNumber === markerCount
        ? text.length
        : markerIndex + marker.length;

    if (markerIndex === -1) {
      throw new Error(`Missing sutra marker ${marker}`);
    }

    const pageText = text.slice(cursor, endIndex).trim();
    cursor = markerIndex + marker.length;

    return {
      markerNumber,
      marker,
      passages: pageText.split(/\n\s*\n/).filter(Boolean)
    };
  });
}
