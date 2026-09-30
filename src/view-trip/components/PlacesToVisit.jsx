import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({ trip }) {
  const itinerary = Array.isArray(trip?.tripData?.itinerary)
    ? trip.tripData.itinerary
    : [];

  return (
    <div className="mt-12">
      <h2 className="font-bold text-2xl md:text-3xl text-slate-900 mb-6">
        Day-by-Day Itinerary 🗺️
      </h2>

      {itinerary.length === 0 ? (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 text-center">
          No itinerary plan available for this trip.
        </div>
      ) : (
        <div className="space-y-10">
          {itinerary.map((dayItem, index) => {
            const dayNumber = dayItem?.day || index + 1;
            const dayTitle = dayItem?.dayTitle || dayItem?.theme || `Day ${dayNumber}`;
            const planList = Array.isArray(dayItem?.plan) ? dayItem.plan : [];

            return (
              <div key={index} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-200/80">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-200">
                  <span className="flex items-center justify-center bg-orange-600 text-white font-extrabold text-sm px-4 py-1.5 rounded-full shadow-md">
                    Day {dayNumber}
                  </span>
                  <h3 className="font-bold text-xl text-slate-800">
                    {dayTitle}
                  </h3>
                </div>

                {planList.length === 0 ? (
                  <p className="text-slate-500 text-sm italic">
                    No specific activities listed for Day {dayNumber}.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {planList.map((place, placeIdx) => (
                      <PlaceCardItem
                        key={placeIdx}
                        place={place}
                        locationLabel={trip?.userSelection?.location?.label}
                        index={index * 10 + placeIdx}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PlacesToVisit;