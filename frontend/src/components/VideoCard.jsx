import { Clock, Eye, User } from 'lucide-react';

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const formatViews = (views) => {
  return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(views);
};

export default function VideoCard({ info }) {
  return (
    <div className="w-full md:w-1/2 flex flex-col gap-4">
      <div className="relative group rounded-xl overflow-hidden shadow-2xl border border-white/5 bg-black">
        <img 
          src={info.thumbnail} 
          alt={info.title} 
          className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100" />
        
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-xs px-2 py-1 rounded font-medium flex items-center gap-1.5">
          <Clock size={12} />
          {formatDuration(info.lengthSeconds)}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-medium leading-tight text-white mb-3 line-clamp-2" title={info.title}>
          {info.title}
        </h2>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-textMuted">
          <div className="flex items-center gap-1.5">
            <User size={16} />
            <span className="truncate max-w-[150px]">{info.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye size={16} />
            <span>{formatViews(info.views)} views</span>
          </div>
        </div>
      </div>
    </div>
  );
}
