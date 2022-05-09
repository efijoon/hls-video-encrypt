const path = require('path');
const fluentFfmpeg = require('fluent-ffmpeg');

async function generateEncryptedSegments(resolution, inputPath, distPath) {
  const encryptedResolutionPath = path.join(distPath, 'encrypted', resolution);

  const segmentPath = path.join(encryptedResolutionPath, 'chunk%05d.ts');
  const playlistName = path.join(encryptedResolutionPath, 'playlist.m3u8');
  const encryptionKeyInfoPath = path.join(encryptedResolutionPath, 'encryption.keyinfo');
  
  return new Promise((resolve, reject) => {
    fluentFfmpeg(inputPath)
      .outputOptions([
        '-vcodec copy',
        '-acodec copy',
        '-muxdelay 0',
        '-hls_playlist_type vod',
        `-hls_key_info_file ${encryptionKeyInfoPath}`,
        `-hls_segment_filename ${segmentPath}`,
      ])
      .output(playlistName)
      .on('progress', (progress) => {
        console.log('Generate Encrypted Segments:', progress.percent, '% done');
      })
      .once('end', async () => {
        resolve()
      })
      .once('error', err => {
        reject(err);
      })
      .run();
  });
}

module.exports = generateEncryptedSegments;