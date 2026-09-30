import { db } from '@/service/firebaseConfig';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Share2, Trash2, ArrowLeft, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

function Viewtrip() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const GetTripData = useCallback(async () => {
    if (!tripId) return;

    try {
      setLoading(true);
      const docRef = doc(db, 'AITrips', tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Trip Data retrieved from Firestore:", docSnap.data());
        setTrip(docSnap.data());
      } else {
        console.error("No trip document found with ID:", tripId);
        toast.error("No trip found with this ID.");
      }
    } catch (error) {
      console.error("Error fetching trip data:", error);
      toast.error("Unable to load trip details.");
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    GetTripData();
  }, [GetTripData]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Trip link copied to clipboard!");
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteDoc(doc(db, 'AITrips', tripId));
      toast.success("Trip deleted successfully.");
      navigate('/my-trips');
    } catch (error) {
      console.error("Delete trip error:", error);
      toast.error("Failed to delete trip.");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className='p-10 md:px-20 lg:px-44 xl:px-56 max-w-6xl mx-auto'>
        <div className="h-[340px] w-full bg-slate-200 animate-pulse rounded-2xl mb-8" />
        <div className="h-10 w-1/3 bg-slate-200 animate-pulse rounded-lg mb-4" />
        <div className="h-6 w-1/4 bg-slate-200 animate-pulse rounded-lg mb-8" />
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className='p-10 text-center max-w-md mx-auto my-20 bg-slate-50 border rounded-2xl'>
        <h2 className='font-bold text-2xl text-slate-800 mb-2'>Trip Not Found</h2>
        <p className='text-slate-500 mb-6'>The requested trip itinerary does not exist or has been removed.</p>
        <Button onClick={() => navigate('/create-trip')} className="bg-orange-600 hover:bg-orange-700 text-white rounded-full">
          Create New Trip
        </Button>
      </div>
    );
  }

  return (
    <div className='p-6 md:px-20 lg:px-44 xl:px-56 max-w-7xl mx-auto pb-20'>
      {/* Top Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/my-trips')}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium text-sm"
        >
          <ArrowLeft size={18} /> Back to My Trips
        </button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="rounded-full flex items-center gap-1.5 border-slate-300 hover:bg-slate-50"
          >
            <Share2 size={16} /> Share
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/create-trip')}
            className="rounded-full flex items-center gap-1.5 border-slate-300 hover:bg-slate-50"
          >
            <RefreshCw size={16} /> Re-plan
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
            className="rounded-full flex items-center gap-1.5 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 size={16} /> Delete
          </Button>
        </div>
      </div>

      {/* Information Section (Hero & Details) */}
      <InfoSection trip={trip} />

      {/* Recommended Hotels */}
      <Hotels trip={trip} />

      {/* Daily Plan / Places to Visit */}
      <PlacesToVisit trip={trip} />

      {/* Footer */}
      <Footer />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bold text-xl text-slate-900">Delete Trip Itinerary?</DialogTitle>
            <DialogDescription className="text-slate-500 mt-2">
              Are you sure you want to delete this trip itinerary? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={deleting}
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? 'Deleting...' : 'Delete Trip'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Viewtrip;