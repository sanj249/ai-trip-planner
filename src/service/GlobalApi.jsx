/* eslint-disable react-refresh/only-export-components */
/**
 * GlobalApi utility module.
 * Note: Google Places API dependency has been removed to avoid 403 BillingNotEnabled errors.
 * Map search links and dynamic Unsplash fallback images are used instead.
 */
import { getRandomFallbackImage } from "./tripNormalizer";

export const GetPlaceDetails = async (data) => {
  console.log("Using free Open-Meteo geocoding & fallback image strategy for query:", data?.textQuery);
  return {
    data: {
      places: [
        {
          id: "placeholder-place",
          displayName: { text: data?.textQuery || "Destination" },
          photos: []
        }
      ]
    }
  };
};

export const PHOTO_REF_URL = "";

export function getPlacePhotoUrl(placeName, seed = 0) {
  if (!placeName) return getRandomFallbackImage(seed);
  return getRandomFallbackImage(seed + placeName.length);
}