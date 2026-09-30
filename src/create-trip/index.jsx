import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelList
} from '@/constants/options';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { generateTrip } from '@/service/AIModel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider, db } from '@/service/firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

function CreateTrip() {
  const [destination, setDestination] = useState('');
  const [locationResults, setLocationResults] = useState([]);
  const [searchingLocation, setSearchingLocation] = useState(false);

  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const searchLocation = async () => {
    if (!destination.trim()) {
      toast.error('Please enter a destination name');
      return;
    }

    try {
      setSearchingLocation(true);
      setLocationResults([]);

      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          destination.trim()
        )}&count=5&language=en&format=json`
      );

      if (!response.ok) {
        throw new Error('Location search network response was not ok');
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        toast.info('No matching locations found. Try a broader city name.');
        return;
      }

      setLocationResults(data.results);
    } catch (error) {
      console.error('Location search error:', error);
      toast.error('Unable to search destination. Check network connection.');
    } finally {
      setSearchingLocation(false);
    }
  };

  const onGenerateTrip = async () => {
    // 1. Authenticate user
    let userStr = localStorage.getItem('user');
    let user = null;
    try {
      user = userStr ? JSON.parse(userStr) : null;
    } catch {
      user = null;
    }

    if (!user || (!user.email && !auth.currentUser)) {
      setOpenDialog(true);
      return;
    }

    // 2. Validate Form Data
    if (
      !formData?.location ||
      !formData?.noOfDays ||
      !formData?.budget ||
      !formData?.traveler
    ) {
      toast.error('Please complete all form fields before generating your itinerary.');
      return;
    }

    const days = Number(formData.noOfDays);
    if (isNaN(days) || days <= 0) {
      toast.error('Number of days must be greater than 0.');
      return;
    }

    if (days > 30) {
      toast.error('Trip length is currently capped at 30 days maximum.');
      return;
    }

    if (loading) return; // Prevent double submission

    setLoading(true);

    try {
      toast.info('AI is crafting your personalized itinerary. This may take 5-10 seconds...');

      const FINAL_PROMPT = AI_PROMPT
        .replace('{location}', formData?.location?.label || destination)
        .replace('{totalDays}', formData?.noOfDays)
        .replace('{traveler}', formData?.traveler)
        .replace('{budget}', formData?.budget);

      // Generate trip using Gemini AI service (returns normalized JSON object directly)
      const normalizedTripData = await generateTrip(FINAL_PROMPT);

      if (!normalizedTripData) {
        throw new Error('AI service returned empty data.');
      }

      // Save trip to Firestore
      await SaveAiTrip(normalizedTripData, user);
    } catch (error) {
      console.error('Error generating trip:', error);
      toast.error(error.message || 'Something went wrong while generating your trip.');
    } finally {
      setLoading(false);
    }
  };

  const SaveAiTrip = async (tripData, user) => {
    try {
      const docId = Date.now().toString();
      const currentUser = auth.currentUser;

      const tripDocument = {
        id: docId,
        userSelection: formData,
        tripData: tripData,
        userEmail: user?.email || currentUser?.email || 'guest@user.com',
        userId: user?.uid || currentUser?.uid || 'guest_uid',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, "AITrips", docId), tripDocument);

      toast.success('Your travel plan is ready!');
      navigate(`/view-trip/${docId}`);
    } catch (error) {
      console.error('Error saving trip to Firestore:', error);
      toast.error('Failed to save trip data to database.');
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        picture: firebaseUser.photoURL
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setOpenDialog(false);
      toast.success('Signed in successfully! Continuing trip generation...');
      
      // Auto-trigger trip generation after sign-in
      setTimeout(() => {
        onGenerateTrip();
      }, 300);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      toast.error('Google Sign-In failed.');
    }
  };

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 px-5 mt-10 max-w-6xl mx-auto pb-20'>
      <div className="border-b pb-6">
        <h2 className='font-bold text-3xl md:text-4xl text-slate-900'>
          Tell us your travel preferences 🏕️🌴
        </h2>
        <p className='mt-3 text-slate-600 text-lg'>
          Provide a few basic details, and our AI travel planner will generate a customized itinerary tailored specifically to your budget and travel style.
        </p>
      </div>

      <div className='mt-10 flex flex-col gap-10'>
        {/* 1. Destination Search */}
        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200">
          <label className='text-xl font-semibold text-slate-900 mb-2 block'>
            1. What is your destination of choice?
          </label>
          <p className="text-sm text-slate-500 mb-4">Enter a city or region name below and click Search.</p>

          <div className='flex gap-3'>
            <Input
              placeholder='e.g. Paris, Tokyo, New York, Bali'
              value={destination}
              className="bg-white border-slate-300 h-12 text-base focus-visible:ring-orange-500"
              onChange={(e) => {
                setDestination(e.target.value);
                setLocationResults([]);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  searchLocation();
                }
              }}
            />

            <Button
              type='button'
              onClick={searchLocation}
              disabled={searchingLocation}
              className="bg-slate-900 hover:bg-slate-800 text-white h-12 px-6 rounded-lg font-medium"
            >
              {searchingLocation ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Location Results List */}
          {locationResults.length > 0 && (
            <div className='mt-3 border rounded-xl overflow-hidden bg-white shadow-lg border-slate-200'>
              {locationResults.map((location) => {
                const label = `${location.name}${location.admin1 ? `, ${location.admin1}` : ''}, ${location.country || ''}`;
                return (
                  <button
                    key={`${location.id}-${location.latitude}-${location.longitude}`}
                    type='button'
                    className='w-full text-left p-3.5 hover:bg-orange-50/60 border-b last:border-b-0 transition-colors flex justify-between items-center'
                    onClick={() => {
                      handleInputChange('location', {
                        label,
                        lat: location.latitude,
                        lon: location.longitude
                      });
                      setDestination(label);
                      setLocationResults([]);
                      toast.success(`Destination set to ${location.name}`);
                    }}
                  >
                    <div>
                      <div className='font-semibold text-slate-800'>{location.name}</div>
                      <div className='text-xs text-slate-500'>
                        {location.admin1 ? `${location.admin1}, ` : ''}{location.country}
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-600">Select</span>
                  </button>
                );
              })}
            </div>
          )}

          {formData?.location?.label && (
            <div className="mt-3 inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium">
              ✓ Selected: {formData.location.label}
            </div>
          )}
        </div>

        {/* 2. Number of Days */}
        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200">
          <label className='text-xl font-semibold text-slate-900 mb-2 block'>
            2. How many days are you planning your trip?
          </label>
          <p className="text-sm text-slate-500 mb-4">Enter trip duration in days (1 to 30).</p>

          <Input
            placeholder='e.g. 4'
            type='number'
            min='1'
            max='30'
            className="bg-white border-slate-300 h-12 text-base focus-visible:ring-orange-500 max-w-xs"
            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
          />
        </div>

        {/* 3. Budget */}
        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200">
          <label className='text-xl font-semibold text-slate-900 mb-2 block'>
            3. What is your budget level?
          </label>
          <p className="text-sm text-slate-500 mb-4">The budget is explicitly factored into hotel and activity suggestions.</p>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-5 mt-4'>
            {SelectBudgetOptions.map((item) => (
              <div
                key={item.id}
                onClick={() => handleInputChange('budget', item.title)}
                className={`p-5 border cursor-pointer rounded-xl bg-white hover:border-orange-400 hover:shadow-md transition-all ${
                  formData?.budget === item.title
                    ? 'shadow-md border-orange-600 ring-2 ring-orange-500/20 bg-orange-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className='text-3xl mb-2'>{item.icon}</div>
                <h3 className='font-bold text-lg text-slate-900'>{item.title}</h3>
                <p className='text-sm text-slate-500 mt-1'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Travel Group */}
        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200">
          <label className='text-xl font-semibold text-slate-900 mb-2 block'>
            4. Who do you plan on traveling with?
          </label>
          <p className="text-sm text-slate-500 mb-4">Select your party composition.</p>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-4'>
            {SelectTravelList.map((item) => (
              <div
                key={item.id}
                onClick={() => handleInputChange('traveler', item.people)}
                className={`p-5 border cursor-pointer rounded-xl bg-white hover:border-orange-400 hover:shadow-md transition-all ${
                  formData?.traveler === item.people
                    ? 'shadow-md border-orange-600 ring-2 ring-orange-500/20 bg-orange-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className='text-3xl mb-2'>{item.icon}</div>
                <h3 className='font-bold text-lg text-slate-900'>{item.title}</h3>
                <p className='text-sm text-slate-500 mt-1'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Trip CTA Button */}
      <div className='mt-12 flex justify-end'>
        <Button
          disabled={loading}
          onClick={onGenerateTrip}
          size="lg"
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-10 py-6 text-lg font-semibold shadow-lg shadow-orange-500/20"
        >
          {loading ? (
            <span className="flex items-center gap-3">
              <AiOutlineLoading3Quarters className='h-5 w-5 animate-spin' />
              Planning your trip...
            </span>
          ) : (
            'Generate Trip ✨'
          )}
        </Button>
      </div>

      {/* Login Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-col items-center text-center">
            <img src='/logo.svg' alt='logo' className='w-24 mb-2' />
            <DialogTitle className='font-bold text-xl'>Sign In to Continue</DialogTitle>
            <DialogDescription className='text-slate-500 text-sm mt-1'>
              Sign in securely with Google to generate and save your travel itinerary.
            </DialogDescription>
            <Button
              onClick={loginWithGoogle}
              className='w-full mt-6 flex gap-3 items-center justify-center bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm'
            >
              <FcGoogle className='h-6 w-6' />
              Sign in with Google
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;