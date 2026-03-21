const cp = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const isWin = os.platform() === 'win32';
const ytdlpPath = path.join(__dirname, '..', isWin ? 'yt-dlp.exe' : 'yt-dlp');
const ffmpegPath = path.join(__dirname, '..', 'ffmpeg_bin');

exports.getVideoInfo = (url) => {
  return new Promise((resolve, reject) => {
    cp.execFile(ytdlpPath, ['-J', '--no-warnings', '--no-playlist', url], { maxBuffer: 1024 * 1024 * 30 }, (err, stdout) => {
        if (err) {
           console.error('yt-dlp info error:', err.message);
           return reject(new Error('Failed to parse video info'));
        }
        try {
            const info = JSON.parse(stdout);
            
            // yt-dlp parses qualities reliably, but we can default to ensuring these exist
            const availableQualities = new Set();
            if (info.formats) {
                info.formats.forEach(f => {
                   if (f.height === 1080) availableQualities.add('1080p');
                   if (f.height === 720) availableQualities.add('720p');
                   if (f.height === 480) availableQualities.add('480p');
                });
            }

            resolve({
                title: info.title,
                thumbnail: info.thumbnail,
                author: info.uploader,
                lengthSeconds: info.duration,
                views: info.view_count,
                availableQualities: Array.from(availableQualities).length ? Array.from(availableQualities) : ['1080p', '720p', '480p'], 
                // We provide fallback since yt-dlp can implicitly downgrade/merge.
            });
        } catch (e) {
            reject(new Error('Invalid JSON from yt-dlp'));
        }
    });
  });
};

exports.downloadVideo = async (url, format, res) => {
  return new Promise((resolve) => {
    // Generate temporary file name with random ID
    const tempId = Date.now() + '-' + Math.floor(Math.random() * 100000);
    const tempBase = path.join(os.tmpdir(), `tubeDL-${tempId}`);
    
    let args = [
      '--ffmpeg-location', ffmpegPath,
      '--no-warnings',
      '--no-playlist'
    ];

    if (format === 'mp3') {
        args.push('-x', '--audio-format', 'mp3', '--audio-quality', '0', '-o', `${tempBase}-%(title)s.%(ext)s`, url);
    } else if (format === '1080p') {
        args.push('-f', 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best', '--merge-output-format', 'mp4', '-o', `${tempBase}-%(title)s.%(ext)s`, url);
    } else if (format === '720p') {
        args.push('-f', 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best', '--merge-output-format', 'mp4', '-o', `${tempBase}-%(title)s.%(ext)s`, url);
    } else if (format === '480p') {
        args.push('-f', 'bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best', '--merge-output-format', 'mp4', '-o', `${tempBase}-%(title)s.%(ext)s`, url);
    } else {
        args.push('-f', 'best[ext=mp4]/best', '--merge-output-format', 'mp4', '-o', `${tempBase}-%(title)s.%(ext)s`, url);
    }

    const downloader = cp.spawn(ytdlpPath, args);
    let errorOutput = '';

    downloader.stderr.on('data', (data) => {
        errorOutput += data.toString();
    });

    downloader.on('close', (code) => {
        if (code !== 0) {
           console.error('yt-dlp download failed:', errorOutput);
           if (!res.headersSent) res.status(500).send('Video download failed or format unavailable');
           return resolve();
        }
        
        // yt-dlp appends the generated extension, so we must find the exact file
        const files = fs.readdirSync(os.tmpdir()).filter(f => f.startsWith(`tubeDL-${tempId}`));
        
        if (files.length === 0) {
             if (!res.headersSent) res.status(500).send('Could not process video file');
             return resolve();
        }
        
        const file = path.join(os.tmpdir(), files[0]);
        // Strip out our temporary "tubeDL-timestamp-" prefix for the clean title sent to the user
        const finalName = files[0].substring(files[0].indexOf('-') + 1); 
        const originalTitle = finalName.substring(finalName.indexOf('-') + 1); 
        
        // Sanitize the title so it doesn't crash Express HTTP headers
        const safeTitle = encodeURIComponent(originalTitle).replace(/['()]/g, escape).replace(/\*/g, '%2A');

        // Once downloaded natively by yt-dlp, trigger browser download
        try {
            res.download(file, safeTitle, (err) => {
                // Cleanup the temp file once sent or aborted
                try { fs.unlinkSync(file); } catch(e){}
                resolve();
            });
        } catch (downloadErr) {
            console.error('Express download crash prevented:', downloadErr.message);
            try { fs.unlinkSync(file); } catch(e){}
            if (!res.headersSent) res.status(500).send('Error serving the file');
            resolve();
        }
    });
  });
};
