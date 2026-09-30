import { FaMapLocationDot } from 'react-icons/fa6';
import { getRandomFallbackImage } from '@/service/tripNormalizer';

function HotelCardItem({ hotel, index = 0 }) {
  const hotelName = hotel?.hotelName || hotel?.name || 'Recommended Hotel';
  const hotelAddress = hotel?.hotelAddress || hotel?.address || '';
  const latitude = hotel?.geoCoordinates?.latitude;
  const longitude = hotel?.geoCoordinates?.longitude;

  const mapUrl =
    latitude && longitude && latitude !== 0
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${hotelName} ${hotelAddress}`
        )}`;

  const imageUrl = hotel?.hotelImageUrl || hotel?.imageUrl || getRandomFallbackImage(index);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={hotelName}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = getRandomFallbackImage(index);
            }}
          />
          {hotel?.rating && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 shadow">
              ⭐ {hotel.rating}
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-lg text-slate-900 leading-snug line-clamp-1">
              {hotelName}
            </h3>

            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-700 p-1.5 hover:bg-orange-50 rounded-lg transition-colors shrink-0"
              title="Open location in Google Maps"
            >
              <FaMapLocationDot size={20} />
            </a>
          </div>

          <p className="text-slate-500 text-xs mt-2 flex items-start gap-1 line-clamp-2">
            📍 {hotelAddress || 'Address details available in map link'}
          </p>

          {hotel?.description && (
            <p className="text-slate-600 text-xs mt-3 leading-relaxed line-clamp-3">
              {hotel.description}
            </p>
          )}
        </div>
      </div>

      <div className="p-5 pt-0 border-t border-slate-100 mt-4 flex justify-between items-center">
        <div>
          <span className="text-xs text-slate-400 block font-medium">Estimated Price</span>
          <span className="font-bold text-orange-600 text-base">
            💰 {hotel?.price || 'Price varies'}
          </span>
        </div>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-slate-700 hover:text-orange-600 underline"
        >
          View Map →
        </a>
      </div>
    </div>
  );
}

export default HotelCardItem;