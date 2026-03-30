import { useState } from 'react';
import { Download, Music, Video, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://writing-pillow-immunology-duncan.trycloudflare.com/api';

export default function FormatSelector({ videoUrl, availableQualities }) {
  const [downloadingFormat, setDownloadingFormat] = useState(null);

  const handleDownload = (format) => {
    setDownloadingFormat(format);
    
    const downloadUrl = `${API_BASE_URL}/download?url=${encodeURIComponent(videoUrl)}&format=${format}`;
    
    toast.success('Download requested!', {
      description: `Your ${format} download is being prepared...`
    });
    
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      setDownloadingFormat(null);
    }, 2000); 
  };

  const isDownloading = downloadingFormat !== null;

  return (
    <div className="w-full md:w-1/2 flex flex-col justify-center">
      <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
        <Download size={20} className="text-primary" />
        Select Download Format
      </h3>

      <div className="flex flex-col gap-5">
        {/* Audio Formats */}
        <div>
          <h4 className="text-sm font-semibold text-textMuted mb-2 uppercase tracking-wide">Audio Options</h4>
          <div className="grid grid-cols-3 gap-3">
            {['mp3', 'm4a', 'wav'].map((audioFormat) => (
              <button
                key={audioFormat}
                onClick={() => handleDownload(audioFormat)}
                disabled={isDownloading}
                className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                  downloadingFormat === audioFormat 
                    ? 'bg-primary/20 border-primary/50 text-white' 
                    : 'bg-surface/50 border-white/10 hover:bg-surface hover:border-white/20 text-textMain disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {downloadingFormat === audioFormat ? (
                  <Loader2 size={24} className="animate-spin text-primary mb-2" />
                ) : (
                  <div className="p-2 bg-primary/20 text-primary rounded-lg mb-2">
                    <Music size={20} />
                  </div>
                )}
                <div className="font-semibold uppercase text-sm">{audioFormat}</div>
                <div className="text-[10px] text-textMuted mt-0.5">High Quality</div>
                
                {!isDownloading && downloadingFormat !== audioFormat && (
                  <Download size={14} className="absolute top-2 right-2 text-textMuted opacity-0 group-hover:opacity-100" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10"></div>

        {/* Video Formats */}
        <div>
          <h4 className="text-sm font-semibold text-textMuted mb-2 uppercase tracking-wide">Video Options</h4>
          <div className="grid grid-cols-2 gap-3">
            {['2160p', '1440p', '1080p', '720p', '480p', '360p', '240p', '144p']
              .filter(format => !availableQualities || availableQualities.length === 0 || availableQualities.includes(format))
              .map((format) => {
              // Check if this format is in available qualities (simplified check)
              const isHighest = format === '1080p' || format === '1440p' || format === '2160p';
              
              return (
                <button
                  key={format}
                  onClick={() => handleDownload(format)}
                  disabled={isDownloading}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                    downloadingFormat === format 
                      ? 'bg-primary/20 border-primary/50 text-white' 
                      : 'bg-surface/50 border-white/10 hover:bg-surface hover:border-white/20 text-textMain disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${isHighest ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      <Video size={16} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sm flex items-center gap-1.5">
                        {format}
                        {isHighest && (
                          <span className="text-[9px] uppercase font-bold tracking-wider bg-purple-500/20 text-purple-300 px-1 py-0.5 rounded">HQ</span>
                        )}
                      </div>
                      <div className="text-[10px] text-textMuted mt-0.5">MP4 + Audio</div>
                    </div>
                  </div>
                  
                  {downloadingFormat === format ? (
                    <Loader2 size={16} className="animate-spin text-primary" />
                  ) : (
                    <Download size={16} className="text-textMuted" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
