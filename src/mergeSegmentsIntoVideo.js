const path = require('path');
const { execSync } = require('child_process');

const distPath = path.join(__dirname, '..', 'dist');

async function mergeSegmentsIntoVideo(resolution) {
  const playlistPath = path.join(distPath, resolution, 'playlist.m3u8');
  const joinedVideoPath = path.join(distPath, 'merged', `${resolution}.mp4`);

  const joinSegmentsArgs = [
    `-i ${playlistPath}`,
    `-codec copy`,
    joinedVideoPath
  ].join(' ');

  execSync(`ffmpeg ${joinSegmentsArgs}`);
};

module.exports = mergeSegmentsIntoVideo;