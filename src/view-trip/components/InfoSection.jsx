import { useEffect, useState } from 'react';
import { getRandomFallbackImage } from '@/service/tripNormalizer';
import { CloudSun } from 'lucide-react';

function InfoSection({ trip }) {
  const [weather, setWeather] = useState(null);
  const locationObj = trip?.userSelection?.location;
  const locationLabel = locationObj?.label || 'Destination';

  // Extract hero photo from itinerary or hotel if available, otherwise random fallback
  const heroPhoto =
    trip?.tripData?.itinerary?.[0]?.plan?.[0]?.placeImageUrl ||
    trip?.tripData?.hotel_options?.[0]?.hotelImageUrl ||
    getRandomFallbackImage(locationLabel.length);

  useEffect(() => {
    if (locationObj?.lat && locationObj?.lon) {
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${locationObj.lat}&longitude=${locationObj.lon}&current_weather=true`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data?.current_weather) {
            setWeather(data.current_weather);
          }
        })
        .catch((err) => console.log('Weather fetch notice:', err));
    }
  }, [locationObj]);

  return (
    <div className="relative group">
      <div className="relative h-[360px] w-full overflow-hidden rounded-3xl shadow-lg border border-slate-200">
        <img
          src={heroPhoto}
          alt={locationLabel}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            e.currentTarget.src = getRandomFallbackImage(0);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 text-white">
          <span className="inline-block px-3 py-1 rounded-full bg-orange-600/90 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
            Trip Overview
          </span>
          <h1 className="font-extrabold text-3xl sm:text-4xl text-white tracking-tight drop-shadow-md">
            {locationLabel}
          </h1>
        </div>
      </div>

      <div className="my-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 p-2.5 px-5 bg-slate-100/90 border border-slate-200 rounded-full text-slate-700 font-medium text-sm">
            <span>📅</span>
            <span>{trip?.userSelection?.noOfDays || '-'} Days</span>
          </div>

          <div className="flex items-center gap-2 p-2.5 px-5 bg-slate-100/90 border border-slate-200 rounded-full text-slate-700 font-medium text-sm">
            <span>💰</span>
            <span>{trip?.userSelection?.budget || '-'} Budget</span>
          </div>

          <div className="flex items-center gap-2 p-2.5 px-5 bg-slate-100/90 border border-slate-200 rounded-full text-slate-700 font-medium text-sm">
            <span>👥</span>
            <span>{trip?.userSelection?.traveler || '-'}</span>
          </div>

          {weather && (
            <div className="flex items-center gap-2 p-2.5 px-5 bg-sky-50 border border-sky-200 rounded-full text-sky-800 font-medium text-sm">
              <CloudSun size={18} className="text-sky-600" />
              <span>
                Weather: {weather.temperature}°C (Wind: {weather.windspeed} km/h)
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InfoSection;