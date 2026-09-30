export const SelectTravelList = [
  {
    id: 1,
    title: 'Just Me',
    desc: 'A sole traveler exploring the world',
    icon: '✈️',
    people: '1 person'
  },
  {
    id: 2,
    title: 'A Couple',
    desc: 'Two travelers in tandem',
    icon: '🥂',
    people: '2 people'
  },
  {
    id: 3,
    title: 'Family',
    desc: 'A group of fun-loving adventurers',
    icon: '🏡',
    people: '3 to 5 People'
  },
  {
    id: 4,
    title: 'Friends',
    desc: 'A bunch of thrill-seekers',
    icon: '⛵',
    people: '5 to 10 people'
  }
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: 'Cheap',
    desc: 'Stay conscious of costs',
    icon: '💵',
  },
  {
    id: 2,
    title: 'Moderate',
    desc: 'Keep cost on the average side',
    icon: '💰',
  },
  {
    id: 3,
    title: 'Luxury',
    desc: "Don't worry about cost",
    icon: '💸',
  }
];

export const AI_PROMPT = `Generate a detailed Travel Plan in valid raw JSON format (without markdown fences) for:
- Location: {location}
- Duration: {totalDays} Days
- Travelers: {traveler}
- Budget: {budget}

The JSON structure MUST follow this exact schema:
{
  "hotel_options": [
    {
      "hotelName": "Hotel Name",
      "hotelAddress": "Full Street Address",
      "price": "$XX / night",
      "hotelImageUrl": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      "geoCoordinates": {
        "latitude": 0.0,
        "longitude": 0.0
      },
      "rating": 4.5,
      "description": "Short appealing description of amenities and location."
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "dayTitle": "Theme or highlight of Day 1",
      "plan": [
        {
          "placeName": "Attraction Name",
          "placeDetails": "Engaging description of attraction.",
          "placeImageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
          "geoCoordinates": {
            "latitude": 0.0,
            "longitude": 0.0
          },
          "ticketPricing": "Ticket cost or Free",
          "rating": 4.7,
          "travelTimeFromPrevious": "Approx travel time",
          "estimatedDuration": "Recommended duration (e.g. 2 hours)",
          "bestTimeToVisit": "Best time of day (e.g. Morning)"
        }
      ]
    }
  ]
}

Ensure high accuracy for place details and geo coordinates. Provide at least 3 hotel options and 2 to 4 place activities per day. Do NOT wrap output in markdown code blocks. Output JSON only.`;