const express = require('express');
const router = express.Router();
const downloaderService = require('../services/downloader');

// Route to get video information
router.get('/info', async (req, res) => {
  try {
    const videoUrl = req.query.url;
    if (!videoUrl) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const info = await downloaderService.getVideoInfo(videoUrl);
    res.json(info);
  } catch (error) {
    console.error('Error fetching video info:', error.message);
    let userMessage = 'Failed to fetch video information. Please ensure the URL is valid.';
    let statusCode = 500;
    
    if (error.message.includes('No video id found')) {
      userMessage = 'Invalid YouTube URL format. Please paste a full video link.';
      statusCode = 400;
    } else if (error.message.includes('playable formats')) {
      userMessage = 'YouTube blocked the request. The video might be age-restricted, private, or temporarily unavailable to downloaders.';
      statusCode = 400;
    }
    
    res.status(statusCode).json({ error: userMessage, details: error.message });
  }
});

// Route to download video/audio
router.get('/download', async (req, res) => {
  try {
    const videoUrl = req.query.url;
    const format = req.query.format; // e.g., '1080p', '720p', '480p', 'mp3'

    if (!videoUrl || !format) {
      return res.status(400).json({ error: 'URL and format are required' });
    }

    await downloaderService.downloadVideo(videoUrl, format, res);
  } catch (error) {
    console.error('Error downloading video:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to download media' });
    }
  }
});

module.exports = router;
