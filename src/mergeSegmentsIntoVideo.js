const path = require('path');
const fluentFfmpeg = require('fluent-ffmpeg');

async function mergeSegmentsIntoVideo(resolution, distPath) {
  const playlistPath = path.join(distPath, resolution, 'playlist.m3u8');
  const joinedVideoPath = path.join(distPath, 'merged', `${resolution}.mp4`);

  return new Promise((resolve, reject) => {
    fluentFfmpeg(playlistPath)
      .outputOptions([`-codec copy`])
      .output(joinedVideoPath)
      .on('progress', (progress) => {
        console.log('Merge segments into video:', progress.percent, '% done');
      })
      .once('end', async () => {
        resolve()
      })
      .once('error', err => {
        reject(err);
      })
      .run();
  });
};

module.exports = mergeSegmentsIntoVideo;