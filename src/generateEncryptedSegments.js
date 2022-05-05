const path = require('path');
const { execSync } = require('child_process');

const distPath = path.join(__dirname, '..', 'dist');

async function generateEncryptedSegments(resolution) {
  const encryptedResolutionPath = path.join(distPath, 'encrypted', resolution);

  const inputPath = path.join(distPath, 'merged', `${resolution}.mp4`);
  const segmentPath = path.join(encryptedResolutionPath, 'chunk%05d.ts');
  const playlistName = path.join(encryptedResolutionPath, 'playlist.m3u8');
  const encryptionKeyInfoPath = path.join(encryptedResolutionPath, 'encryption.keyinfo');
  
  const createSegmentsArgs = [
    `-i ${inputPath}`, 
    '-vcodec copy',
    '-acodec copy',
    '-muxdelay 0',
    '-hls_playlist_type vod',
    `-hls_key_info_file ${encryptionKeyInfoPath}`,
    `-hls_segment_filename ${segmentPath}`,
    playlistName,
  ].join(' ');

  execSync(`ffmpeg ${createSegmentsArgs}`);
}

module.exports = generateEncryptedSegments;