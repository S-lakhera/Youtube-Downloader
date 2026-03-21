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
if (!isWin) {
    const cp = require('child_process');
    console.log('Linux Server Detected (Render). Using curl to reliably download standalone binary...');
    // Render and generic Linux containers natively support curl, which flawlessly handles Github's redirect trees
    cp.execSync('curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux -o yt-dlp_linux');
    cp.execSync('chmod a+rx yt-dlp_linux');
    console.log('yt-dlp_linux downloaded completely and is ready for production!');
} else {
    const ytDlpFileName = 'yt-dlp.exe';
    const ytDlpUrl = `https://github.com/yt-dlp/yt-dlp/releases/latest/download/${ytDlpFileName}`;
    const ytDlpPath = path.join(__dirname, ytDlpFileName);
    
    console.log(`Windows Machine Detected. Downloading ${ytDlpFileName} from ${ytDlpUrl}...`);
    
    const file = fs.createWriteStream(ytDlpPath);
    https.get(ytDlpUrl, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
            https.get(response.headers.location, (res) => {
                res.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log('yt-dlp.exe downloaded perfectly.');
                });
            });
        } else {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log('yt-dlp.exe downloaded perfectly.');
            });
        }
    }).on('error', (err) => {
        fs.unlink(ytDlpPath, () => {});
        console.error('Download error:', err.message);
    });
}
