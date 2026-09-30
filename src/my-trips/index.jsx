import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '@/service/firebaseConfig';
import UserTripCardItem from './components/UserTripCardItem';
import { Button } from '@/components/ui/button';
import { PlusCircle, Compass } from 'lucide-react';
import { toast } from 'sonner';

function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const GetUserTrips = useCallback(async () => {
    let userStr = localStorage.getItem('user');
    let user = null;
    try {
      user = userStr ? JSON.parse(userStr) : null;
    } catch {
      user = null;
    }

    const email = user?.email || auth.currentUser?.email;
    const uid = user?.uid || auth.currentUser?.uid;

    if (!email && !uid) {
      toast.info("Please sign in to view your trips.");
      navigate('/');
      return;
    }

    try {
      setLoading(true);

      // Query by userEmail
      const tripsRef = collection(db, 'AITrips');
      let q = email ? query(tripsRef, where('userEmail', '==', email)) : query(tripsRef, where('userId', '==', uid));
      
      const querySnapshot = await getDocs(q);
      const fetchedTrips = [];

      querySnapshot.forEach((docSnap) => {
        fetchedTrips.push({
          firestoreDocId: docSnap.id,
          ...docSnap.data()
        });
      });

      // Sort newest trips first
      fetchedTrips.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : Number(a.id || 0);
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : Number(b.id || 0);
        return timeB - timeA;
      });

      setUserTrips(fetchedTrips);
    } catch (error) {
      console.error("Error fetching user trips:", error);
      toast.error("Failed to load your trips.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    GetUserTrips();
  }, [GetUserTrips]);

  const handleDeleteTrip = async (e, tripId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await deleteDoc(doc(db, 'AITrips', tripId));
      setUserTrips((prev) => prev.filter((t) => (t.firestoreDocId || t.id) !== tripId));
      toast.success("Trip deleted.");
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Could not delete trip.");
    }
  };

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 px-5 mt-10 max-w-7xl mx-auto pb-20'>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h2 className='font-bold text-3xl md:text-4xl text-slate-900'>My Travel Plans ✈️</h2>
          <p className="text-slate-500 text-sm mt-1">Manage and view all your saved AI-generated travel itineraries.</p>
        </div>

        <Button
          onClick={() => navigate('/create-trip')}
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-6 flex items-center gap-2"
        >
          <PlusCircle size={18} /> Create New Trip
        </Button>
      </div>

      {loading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10'>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className='h-[280px] w-full bg-slate-200/80 animate-pulse rounded-2xl' />
          ))}
        </div>
      ) : userTrips.length === 0 ? (
        <div className="mt-16 p-12 text-center bg-slate-50 border border-slate-200/80 rounded-3xl max-w-lg mx-auto">
          <Compass size={48} className="mx-auto text-slate-400 mb-4 animate-bounce" />
          <h3 className="font-bold text-xl text-slate-800">No Trips Created Yet</h3>
          <p className="text-slate-500 text-sm mt-2 mb-6">
            Start by entering your destination, duration, and budget to generate a custom itinerary.
          </p>
          <Button
            onClick={() => navigate('/create-trip')}
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-8"
          >
            Create Your First Trip
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10'>
          {userTrips.map((trip, index) => (
            <UserTripCardItem
              key={trip.firestoreDocId || trip.id || index}
              trip={trip}
              onDelete={(e) => handleDeleteTrip(e, trip.firestoreDocId || trip.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTrips;