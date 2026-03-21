const play = require('play-dl');

play.video_info('https://www.youtube.com/watch?v=XqXVi6awwMA')
  .then(info => {
    console.log('SUCCESS!', info.video_details.title);
  })
  .catch(err => console.error('ERROR:', err.message));
