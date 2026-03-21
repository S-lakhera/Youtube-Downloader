const ytdl = require('@distube/ytdl-core');
ytdl.getInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ').then(info => {
  console.log("Formats count:", info.formats.length);
  const playable = info.formats.filter(f => f.hasVideo || f.hasAudio);
  console.log("Playable count:", playable.length);
}).catch(e => console.error("ERROR:", e.message));
