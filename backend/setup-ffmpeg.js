const fs = require('fs');
const path = require('path');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const ffprobe = require('@ffprobe-installer/ffprobe');

const binDir = path.join(__dirname, 'ffmpeg_bin');

if (!fs.existsSync(binDir)) {
    fs.mkdirSync(binDir);
}

// Copy ffmpeg.exe and ffprobe.exe into the unified directory for yt-dlp to use
fs.copyFileSync(ffmpeg.path, path.join(binDir, 'ffmpeg.exe'));
fs.copyFileSync(ffprobe.path, path.join(binDir, 'ffprobe.exe'));

console.log('Successfully copied ffmpeg and ffprobe to', binDir);
