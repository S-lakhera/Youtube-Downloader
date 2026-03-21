const play = require('play-dl');

play.video_info('https://www.youtube.com/watch?v=XqXVi6awwMA')
  .then(info => {
    console.log('Available video formats:');
    info.format.forEach(f => {
      if(f.qualityLabel) console.log(f.qualityLabel, 'itag:', f.url ? 'hasUrl' : 'noUrl');
    });
  })
  .catch(console.error);
