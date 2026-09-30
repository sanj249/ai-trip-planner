import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className='flex flex-col items-center px-6 md:px-20 lg:px-36 gap-8 text-center mt-12 mb-16 max-w-6xl mx-auto'>
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-sm font-medium">
        <span>✨ Powered by Gemini AI</span>
      </div>

      <h1 className='font-extrabold text-4xl sm:text-50px md:text-6xl text-slate-900 leading-tight tracking-tight'>
        <span className='text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500'>
          Discover Your Next Adventure:
        </span>{' '}
        Personalized Itineraries at Your Fingertips
      </h1>

      <p className='text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed'>
        Your personal AI travel curator. Generate custom itineraries, hotel recommendations, and day-by-day travel plans tailored specifically to your interests and budget in seconds.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-2">
        <Link to={'/create-trip'}>
          <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all">
            Get Started — It&apos;s Free
          </Button>
        </Link>
        <a href="/my-trips">
          <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg font-semibold border-slate-300 hover:bg-slate-50 transition-all">
            View My Trips
          </Button>
        </a>
      </div>

      <div className="relative w-full max-w-4xl mt-8 rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 group">
        <img
          src="/landing.png"
          alt="AI Trip Planner Dashboard Preview"
          className='w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500'
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

export default Hero;