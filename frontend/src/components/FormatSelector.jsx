import { useState } from 'react';
import { Download, Music, Video, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://youtube-downloader-alpha-two.vercel.app/api';

export default function FormatSelector({ videoUrl, availableQualities }) {
  const [downloadingFormat, setDownloadingFormat] = useState(null);

  const handleDownload = (format) => {
    setDownloadingFormat(format);
    
    // Construct the download URL
    const downloadUrl = `${API_BASE_URL}/download?url=${encodeURIComponent(videoUrl)}&format=${format}`;
    
    // Trigger download via anchor element for native browser downloading (avoids RAM bloat)
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    
    // Clean up and reset loading state since browser handles the download stream
    setTimeout(() => {
      document.body.removeChild(a);
      setDownloadingFormat(null);
    }, 2000); // 2 second mock delay for UI feedback
  };

  const isDownloading = downloadingFormat !== null;

  return (
    <div className="w-full md:w-1/2 flex flex-col justify-center">
      <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
        <Download size={20} className="text-primary" />
        Select Download Format
      </h3>

      <div className="flex flex-col gap-3">
        {/* MP3 Format */}
        <button
          onClick={() => handleDownload('mp3')}
          disabled={isDownloading}
          className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
            downloadingFormat === 'mp3' 
              ? 'bg-primary/20 border-primary/50 text-white' 
              : 'bg-surface/50 border-white/10 hover:bg-surface hover:border-white/20 text-textMain disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 text-primary rounded-lg">
              <Music size={20} />
            </div>
            <div className="text-left">
              <div className="font-semibold">Audio Copy</div>
              <div className="text-xs text-textMuted mt-0.5">MP3 format, 128kbps</div>
            </div>
          </div>
          
          {downloadingFormat === 'mp3' ? (
            <Loader2 size={24} className="animate-spin text-primary" />
          ) : (
            <Download size={20} className="text-textMuted group-hover:text-white" />
          )}
        </button>

        <div className="my-2 border-t border-white/10"></div>

        {/* Video Formats */}
        {['1080p', '720p', '480p'].map((format) => {
          // Check if this format is in available qualities (simplified check)
          const isHighest = format === '1080p';
          
          return (
            <button
              key={format}
              onClick={() => handleDownload(format)}
              disabled={isDownloading}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                downloadingFormat === format 
                  ? 'bg-primary/20 border-primary/50 text-white' 
                  : 'bg-surface/50 border-white/10 hover:bg-surface hover:border-white/20 text-textMain disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isHighest ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  <Video size={20} />
                </div>
                <div className="text-left">
                  <div className="font-semibold flex items-center gap-2">
                    {format} Resoluton
                    {isHighest && (
                      <span className="text-[10px] uppercase font-bold tracking-wider bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">HQ Audio + Video</span>
                    )}
                  </div>
                  <div className="text-xs text-textMuted mt-0.5">MP4 format (Includes Audio)</div>
                </div>
              </div>
              
              {downloadingFormat === format ? (
                <Loader2 size={24} className="animate-spin text-primary" />
              ) : (
                <Download size={20} className="text-textMuted" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
