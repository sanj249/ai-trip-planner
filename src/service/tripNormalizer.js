/**
 * Sanitizes and normalizes raw JSON output from Gemini API into a standard Trip schema.
 */

// High quality fallback images for travel destinations and places
const FALLBACK_DESTINATION_IMAGES = [
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1476514525535-ce74f45814d2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=80'
];

export function getRandomFallbackImage(seed = 0) {
  const index = Math.abs(seed) % FALLBACK_DESTINATION_IMAGES.length;
  return FALLBACK_DESTINATION_IMAGES[index];
}

export function cleanJsonString(rawText) {
  if (!rawText) return '';
  let text = rawText.trim();

  // Strip markdown code block wrappers
  text = text.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();

  // Extract from first { to last } if extra commentary exists
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    text = text.substring(firstBrace, lastBrace + 1);
  }

  return text;
}

export function parseAndValidateTripJSON(rawText) {
  const cleaned = cleanJsonString(rawText);
  let parsed;

  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error("JSON parse failure on raw Gemini text:", err, rawText);
    throw new Error("Received an invalid response format from AI. Please try again.");
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error("AI response was not a valid object structure.");
  }

  return normalizeTripStructure(parsed);
}

export function normalizeTripStructure(data) {
  const result = {
    hotel_options: [],
    itinerary: []
  };

  // 1. Normalize Hotel Options
  const rawHotels = data.hotel_options || data.hotels || data.hotelOptions || data.hotel_recommendations || [];
  if (Array.isArray(rawHotels)) {
    result.hotel_options = rawHotels.map((h, idx) => ({
      hotelName: h.hotelName || h.name || h.hotel_name || `Hotel Option ${idx + 1}`,
      hotelAddress: h.hotelAddress || h.address || h.location || 'Address available upon booking',
      price: h.price || h.cost || h.pricing || 'Price varies',
      hotelImageUrl: h.hotelImageUrl || h.imageUrl || h.image_url || getRandomFallbackImage(idx),
      geoCoordinates: {
        latitude: Number(h.geoCoordinates?.latitude || h.latitude || h.lat || 0),
        longitude: Number(h.geoCoordinates?.longitude || h.longitude || h.lng || h.lon || 0)
      },
      rating: Number(h.rating || 4.5),
      description: h.description || h.details || 'Comfortable stay recommended for travelers.'
    }));
  }

  // 2. Normalize Itinerary
  const rawItinerary = data.itinerary || data.itinerary_plan || data.days || data.day_plan;

  if (Array.isArray(rawItinerary)) {
    result.itinerary = rawItinerary.map((dayItem, dayIdx) => {
      const dayNum = Number(dayItem.day || dayIdx + 1);
      const rawPlan = Array.isArray(dayItem.plan)
        ? dayItem.plan
        : Array.isArray(dayItem.activities)
        ? dayItem.activities
        : Array.isArray(dayItem.places)
        ? dayItem.places
        : [];

      return {
        day: dayNum,
        dayTitle: dayItem.dayTitle || dayItem.title || dayItem.theme || `Day ${dayNum}`,
        plan: rawPlan.map((p, pIdx) => ({
          placeName: p.placeName || p.name || p.place || `Attraction ${pIdx + 1}`,
          placeDetails: p.placeDetails || p.details || p.description || 'Popular local spot to visit.',
          placeImageUrl: p.placeImageUrl || p.imageUrl || p.image_url || getRandomFallbackImage(dayNum * 10 + pIdx),
          geoCoordinates: {
            latitude: Number(p.geoCoordinates?.latitude || p.latitude || p.lat || 0),
            longitude: Number(p.geoCoordinates?.longitude || p.longitude || p.lng || p.lon || 0)
          },
          ticketPricing: p.ticketPricing || p.ticket_pricing || p.price || p.ticketPrice || 'Free / Varies',
          rating: Number(p.rating || 4.5),
          travelTimeFromPrevious: p.travelTimeFromPrevious || p.timeTravel || p.travelTime || '10-20 mins nearby',
          estimatedDuration: p.estimatedDuration || p.duration || p.timeToSpend || '1-2 hours',
          bestTimeToVisit: p.bestTimeToVisit || p.best_time_to_visit || p.time || 'Morning / Afternoon'
        }))
      };
    });
  } else if (typeof rawItinerary === 'object' && rawItinerary !== null) {
    // Handle case where itinerary is {"day1": [...], "day2": [...]}
    const dayKeys = Object.keys(rawItinerary);
    result.itinerary = dayKeys.map((key, idx) => {
      const dayNum = parseInt(key.replace(/\D/g, ''), 10) || idx + 1;
      const dayVal = rawItinerary[key];
      const rawPlan = Array.isArray(dayVal)
        ? dayVal
        : Array.isArray(dayVal?.plan)
        ? dayVal.plan
        : [];

      return {
        day: dayNum,
        dayTitle: dayVal?.title || `Day ${dayNum}`,
        plan: rawPlan.map((p, pIdx) => ({
          placeName: p.placeName || p.name || p.place || `Attraction ${pIdx + 1}`,
          placeDetails: p.placeDetails || p.details || p.description || 'Popular local spot to visit.',
          placeImageUrl: p.placeImageUrl || p.imageUrl || p.image_url || getRandomFallbackImage(dayNum * 10 + pIdx),
          geoCoordinates: {
            latitude: Number(p.geoCoordinates?.latitude || p.latitude || p.lat || 0),
            longitude: Number(p.geoCoordinates?.longitude || p.longitude || p.lng || p.lon || 0)
          },
          ticketPricing: p.ticketPricing || p.ticket_pricing || p.price || p.ticketPrice || 'Free / Varies',
          rating: Number(p.rating || 4.5),
          travelTimeFromPrevious: p.travelTimeFromPrevious || p.timeTravel || p.travelTime || '10-20 mins nearby',
          estimatedDuration: p.estimatedDuration || p.duration || p.timeToSpend || '1-2 hours',
          bestTimeToVisit: p.bestTimeToVisit || p.best_time_to_visit || p.time || 'Morning / Afternoon'
        }))
      };
    });
  }

  return result;
}
