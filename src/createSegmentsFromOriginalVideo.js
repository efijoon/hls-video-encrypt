const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const ffmpegPath = 'ffmpeg';
const distPath = path.join(__dirname, '..', 'dist');

async function createSegmentsFromOriginalVideo(objectPath) {
  console.time('Creating segments');

  const originalPath = path.join(distPath, 'original');
  if(fs.existsSync(originalPath))
    fs.rmdirSync(originalPath, { recursive: true, force: true });

  await fs.promises.mkdir(originalPath);

  const segmentPath = path.join(originalPath, 'chunk%05d.ts');
  const playlistName = path.join(originalPath, 'playlist.m3u8');

  const createSegmentsArgs = [
    `-i ${objectPath}`, 
    '-vcodec copy',
    '-acodec copy',
    '-f segment',
    '-muxdelay 0',
    `-segment_list ${playlistName}`,
    segmentPath,
  ].join(' ');

  const createSegments = `${ffmpegPath} ${createSegmentsArgs}`;

  execSync(createSegments);

  // console.timeEnd('Creating segments');

  const playlistFileContent = await fs.promises.readFile(playlistName);

  const chunkRegex = /chunk[0-9]{5}\.ts/g
  const chunksGenerated = ((playlistFileContent.toString() || '').match(chunkRegex) || []).length;

  return chunksGenerated;
};

module.exports = createSegmentsFromOriginalVideo;