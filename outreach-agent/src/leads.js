/**
 * Lead discovery via Google Maps Places API (New) — Text Search.
 * Docs: https://developers.google.com/maps/documentation/places/web-service/text-search
 */

const PLACES_ENDPOINT = "https://places.googleapis.com/v1/places:searchText";

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.websiteUri",
  "places.formattedAddress",
  "places.rating",
  "places.userRatingCount",
  "places.businessStatus",
  "places.primaryTypeDisplayName",
].join(",");

/**
 * Find businesses matching a category in a location.
 * Returns only operational businesses that have a website.
 */
export async function findLeads(category, location, maxResults = 20) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_MAPS_API_KEY is not set");

  const response = await fetch(PLACES_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery: `${category} in ${location}`,
      maxResultCount: Math.min(Math.max(1, maxResults), 20),
      languageCode: "en",
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Places API ${response.status}: ${text.slice(0, 400)}`);
  }

  const data = await response.json();
  const places = Array.isArray(data.places) ? data.places : [];

  return places
    .filter(
      (p) =>
        (p.businessStatus ?? "OPERATIONAL") === "OPERATIONAL" && !!p.websiteUri,
    )
    .map((p) => ({
      placeId: p.id,
      businessName: p.displayName?.text ?? "Unknown",
      website: normaliseUrl(p.websiteUri),
      address: p.formattedAddress ?? null,
      rating: typeof p.rating === "number" ? p.rating : null,
      reviewCount:
        typeof p.userRatingCount === "number" ? p.userRatingCount : 0,
      primaryType: p.primaryTypeDisplayName?.text ?? null,
    }));
}

function normaliseUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
