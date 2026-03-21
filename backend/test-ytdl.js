const youtubedl = require('youtube-dl-exec');

youtubedl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
  dumpSingleJson: true,
  noCheckCertificates: true,
  noWarnings: true,
  addHeader: ['referer:youtube.com', 'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36']
})
  .then(output => console.log('TITLE:', output.title))
  .catch(err => console.error('ERROR:', err.message));
