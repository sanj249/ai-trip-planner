import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider } from '@/service/firebaseConfig';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'sonner';

function Header() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          picture: firebaseUser.photoURL
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithFirebaseGoogle = async () => {
    try {
      setSigningIn(true);
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        picture: firebaseUser.photoURL
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setOpenDialog(false);
      toast.success('Signed in successfully!');
    } catch (error) {
      console.error("Firebase Google Sign-In error:", error);
      toast.error('Sign-in failed. Please try again.');
    } finally {
      setSigningIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      setUser(null);
      toast.info('Logged out successfully.');
      window.location.href = '/';
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className='border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm flex justify-between items-center px-6 py-3'>
      <a href="/" className="flex items-center gap-2">
        <img src="/logo.svg" alt="AI Trip Planner Logo" className="h-9 w-auto" />
      </a>

      <div>
        {user ? (
          <div className='flex items-center gap-3'>
            <a href="/create-trip">
              <Button variant="outline" className="rounded-full hover:bg-orange-50 hover:text-orange-600 transition-colors">
                + Create Trip
              </Button>
            </a>
            <a href="/my-trips">
              <Button variant="outline" className="rounded-full hover:bg-orange-50 hover:text-orange-600 transition-colors">
                My Trips
              </Button>
            </a>

            <Popover>
              <PopoverTrigger asChild>
                <button className="rounded-full outline-none ring-2 ring-orange-500/20 hover:ring-orange-500 transition-all">
                  <img
                    src={user?.picture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=traveler'}
                    alt={user?.name || "User Avatar"}
                    className='h-9 w-9 rounded-full object-cover'
                    onError={(e) => {
                      e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=traveler';
                    }}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-4 align-end">
                <div className="pb-3 mb-2 border-b">
                  <p className="font-semibold text-sm truncate">{user?.name || 'Traveler'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <button
                  className='w-full text-left font-medium text-sm text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors cursor-pointer'
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)} className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-6">
            Sign In
          </Button>
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-col items-center text-center">
            <img src="/logo.svg" alt="Logo" className="w-24 mb-2" />
            <DialogTitle className="font-bold text-xl mt-2">Sign In to AI Trip Planner</DialogTitle>
            <DialogDescription className="text-gray-500 text-sm mt-1">
              Sign in securely with Google to create, save, and access your custom travel itineraries.
            </DialogDescription>
            <Button
              disabled={signingIn}
              onClick={loginWithFirebaseGoogle}
              className="w-full mt-6 flex gap-3 items-center justify-center bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm"
            >
              <FcGoogle className="h-6 w-6" />
              {signingIn ? 'Signing in...' : 'Sign in with Google'}
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </header>
  );
}

export default Header;