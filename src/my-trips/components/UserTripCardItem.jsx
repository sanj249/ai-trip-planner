import { Link } from 'react-router-dom';
import { getRandomFallbackImage } from '@/service/tripNormalizer';
import { Trash2 } from 'lucide-react';

function UserTripCardItem({ trip, onDelete }) {
  const locationLabel = trip?.userSelection?.location?.label || 'Trip Itinerary';
  const noOfDays = trip?.userSelection?.noOfDays || '-';
  const budget = trip?.userSelection?.budget || '-';
  const traveler = trip?.userSelection?.traveler || '-';

  const photoUrl =
    trip?.tripData?.itinerary?.[0]?.plan?.[0]?.placeImageUrl ||
    trip?.tripData?.hotel_options?.[0]?.hotelImageUrl ||
    getRandomFallbackImage(locationLabel.length);

  return (
    <div className="group relative rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <Link to={`/view-trip/${trip?.id || trip?.firestoreDocId}`}>
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={photoUrl}
            alt={locationLabel}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = getRandomFallbackImage(0);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h3 className="font-bold text-lg leading-tight line-clamp-1 text-white drop-shadow">
              {locationLabel}
            </h3>
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-wrap gap-2 text-xs text-slate-600 mb-2">
            <span className="bg-slate-100 px-2.5 py-1 rounded-full font-medium">
              📅 {noOfDays} Days
            </span>
            <span className="bg-slate-100 px-2.5 py-1 rounded-full font-medium">
              💰 {budget}
            </span>
            <span className="bg-slate-100 px-2.5 py-1 rounded-full font-medium">
              👥 {traveler}
            </span>
          </div>
        </div>
      </Link>

      {onDelete && (
        <button
          onClick={onDelete}
          title="Delete trip"
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-2 rounded-full text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors shadow-md"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}

export default UserTripCardItem;