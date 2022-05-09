const path = require('path');
const fs = require('fs');
const fluentFfmpeg = require('fluent-ffmpeg');

async function createSegmentsFromOriginalVideo(inputPath, distPath, resolution) {
  const originalPath = path.join(distPath, resolution);
  if(fs.existsSync(originalPath))
    fs.rmSync(originalPath, { recursive: true, force: true });

  await fs.promises.mkdir(originalPath);

  const segmentPath = path.join(originalPath, 'chunk%05d.ts');
  const playlistName = path.join(originalPath, 'playlist.m3u8');

  return new Promise((resolve, reject) => {
    fluentFfmpeg(inputPath)
      .outputOptions([
        '-vcodec copy',
        '-acodec copy',
        '-f segment',
        '-muxdelay 0',
        `-segment_list ${playlistName}`,
        segmentPath,
      ])
      .output(segmentPath)
      .on('progress', (progress) => {
        console.log('Creating video segments:', progress.percent, '% done');
      })
      .once('end', async () => {
        const playlistFileContent = await fs.promises.readFile(playlistName);
        const chunkRegex = /chunk[0-9]{5}\.ts/g
        const chunksGenerated = ((playlistFileContent.toString() || '').match(chunkRegex) || []).length;

        resolve(chunksGenerated)
      })
      .once('error', err => {
        reject(err);
      })
      .run();
  });
};

module.exports = createSegmentsFromOriginalVideo;