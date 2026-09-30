import HotelCardItem from './HotelCardItem';

function Hotels({ trip }) {
  const hotelOptions = trip?.tripData?.hotel_options;
  const hotels = Array.isArray(hotelOptions) ? hotelOptions : [];

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="font-bold text-2xl md:text-3xl text-slate-900">
          Hotel Recommendations 🏨
        </h2>
      </div>

      {hotels.length === 0 ? (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 text-center">
          No hotel recommendations available for this itinerary.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {hotels.map((hotel, index) => (
            <HotelCardItem key={index} hotel={hotel} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Hotels;