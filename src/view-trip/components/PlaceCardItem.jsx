import { FaMapLocationDot } from 'react-icons/fa6';
import { getRandomFallbackImage } from '@/service/tripNormalizer';
import { Clock, Ticket, Navigation } from 'lucide-react';

function PlaceCardItem({ place, locationLabel = '', index = 0 }) {
  const placeName = place?.placeName || place?.name || 'Attraction';
  const latitude = place?.geoCoordinates?.latitude;
  const longitude = place?.geoCoordinates?.longitude;

  const mapUrl =
    latitude && longitude && latitude !== 0
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${placeName} ${locationLabel}`
        )}`;

  const imageUrl = place?.placeImageUrl || place?.imageUrl || getRandomFallbackImage(index);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="relative h-52 w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={placeName}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = getRandomFallbackImage(index);
            }}
          />
          {place?.rating && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 shadow">
              ⭐ {place.rating}
            </div>
          )}
          {place?.bestTimeToVisit && (
            <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1">
              <Clock size={12} /> {place.bestTimeToVisit}
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start gap-3">
            <h4 className="font-bold text-lg text-slate-900 leading-snug">
              {placeName}
            </h4>

            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-700 p-1.5 hover:bg-orange-50 rounded-lg transition-colors shrink-0"
              title="Open in Google Maps"
            >
              <FaMapLocationDot size={20} />
            </a>
          </div>

          <p className="text-slate-600 text-xs mt-3 leading-relaxed">
            {place?.placeDetails || place?.details || 'Popular local spot to explore.'}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
              <span className="text-slate-400 block flex items-center gap-1 font-medium mb-0.5">
                <Ticket size={12} /> Ticket Price
              </span>
              <span className="font-semibold text-slate-800 truncate block">
                {place?.ticketPricing || 'Free / Varies'}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
              <span className="text-slate-400 block flex items-center gap-1 font-medium mb-0.5">
                <Navigation size={12} /> Travel Time
              </span>
              <span className="font-semibold text-slate-800 truncate block">
                {place?.travelTimeFromPrevious || place?.timeTravel || 'Nearby'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {(place?.estimatedDuration || place?.duration) && (
        <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-500 font-medium flex justify-between items-center bg-slate-50/50">
          <span>⏱️ Rec. Duration: {place.estimatedDuration || place.duration}</span>
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 hover:underline font-semibold"
          >
            Directions →
          </a>
        </div>
      )}
    </div>
  );
}

export default PlaceCardItem;