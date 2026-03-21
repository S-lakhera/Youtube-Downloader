const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const ffprobe = require('@ffprobe-installer/ffprobe');

const isWin = os.platform() === 'win32';
const binDir = path.join(__dirname, 'ffmpeg_bin');

if (!fs.existsSync(binDir)) {
    fs.mkdirSync(binDir);
}

// 1. Copy OS-specific FFmpeg and FFprobe securely
const ext = isWin ? '.exe' : '';
fs.copyFileSync(ffmpeg.path, path.join(binDir, 'ffmpeg' + ext));
fs.copyFileSync(ffprobe.path, path.join(binDir, 'ffprobe' + ext));

if (!isWin) {
    fs.chmodSync(path.join(binDir, 'ffmpeg' + ext), 0o755);
    fs.chmodSync(path.join(binDir, 'ffprobe' + ext), 0o755);
}

console.log('Successfully copied ffmpeg and ffprobe');

// 2. Download OS-specific yt-dlp binary natively
const ytDlpFileName = isWin ? 'yt-dlp.exe' : 'yt-dlp_linux';
const ytDlpUrl = `https://github.com/yt-dlp/yt-dlp/releases/latest/download/${ytDlpFileName}`;
const ytDlpPath = path.join(__dirname, ytDlpFileName);

console.log(`Downloading ${ytDlpFileName} from ${ytDlpUrl}...`);

const file = fs.createWriteStream(ytDlpPath);
https.get(ytDlpUrl, (response) => {
    if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle Github Redirects
        https.get(response.headers.location, (res) => {
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                if (!isWin) fs.chmodSync(ytDlpPath, 0o755);
                console.log('yt-dlp downloaded completely and is ready for production!');
            });
        });
    } else {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            if (!isWin) fs.chmodSync(ytDlpPath, 0o755);
            console.log('yt-dlp downloaded completely and is ready for production!');
        });
    }
}).on('error', (err) => {
    fs.unlink(ytDlpPath, () => {});
    console.error('Download error:', err.message);
});
