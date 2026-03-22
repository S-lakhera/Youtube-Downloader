import { useState } from 'react';
import axios from 'axios';
import { Search, Loader2, Youtube, AlertCircle } from 'lucide-react';
import VideoCard from './components/VideoCard';
import FormatSelector from './components/FormatSelector';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'https://youtube-downloader-backend-ahds.onrender.com/api';

function App() {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetchInfo = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    setIsLoading(true);
    setError('');
    setVideoInfo(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/info`, {
        params: { url }
      });
      setVideoInfo(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch video information. Please make sure the URL is valid.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-textMain px-4 py-12 md:py-20 flex flex-col items-center">
      
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in-down">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Youtube size={48} className="text-accent drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-textMuted tracking-tight">
            TubeDL
          </h1>
        </div>
        <p className="text-textMuted text-lg md:text-xl max-w-lg mx-auto font-light">
          Download YouTube videos in high quality, completely free.
        </p>
      </div>

      {/* Main Search Panel */}
      <div className="w-full max-w-3xl glass-panel p-6 md:p-8 animate-fade-in-up">
        <form onSubmit={handleFetchInfo} className="relative flex items-center group">
          <div className="absolute left-4 text-textMuted group-focus-within:text-primary transition-colors">
            <Search size={24} />
          </div>
          <input 
            type="text" 
            placeholder="Paste YouTube URL here..." 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-surface/50 border border-white/10 rounded-xl py-4 pl-12 pr-32 md:pr-40 text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-light placeholder:text-slate-500"
          />
          <button 
            type="submit" 
            disabled={isLoading || !url}
            className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primaryHover disabled:bg-surface text-white font-medium px-4 md:px-8 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Fetch'}
          </button>
        </form>

        {error && (
          <div className="mt-6 flex items-start gap-3 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <p>{error}</p>
          </div>
        )}

        {/* Video Info & Download Section */}
        {videoInfo && (
          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-8 animate-fade-in">
            <VideoCard info={videoInfo} />
            <FormatSelector videoUrl={url} availableQualities={videoInfo.availableQualities} />
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="mt-auto pt-16 text-textMuted text-sm text-center">
        By using this service, you agree to our terms of service.<br/>
        For educational purposes only.
      </p>

      {/* Very simple animations defined in inline styles for ease, though best in tailwind config */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-fade-in-down { animation: fade-in-down 0.6s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
}

export default App;
