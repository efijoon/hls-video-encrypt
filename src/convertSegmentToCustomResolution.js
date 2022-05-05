const path = require('path');
const { execSync } = require('child_process');

const ffmpegPath = 'ffmpeg';
const distPath = path.join(__dirname, '..', 'dist');

const audioBitrate = {
  "640x480": '128k',
  // "1280x720": '128k'
}

const videoMinBitRate = {
  "640x480": '1400k',
  // "1280x720": '2800k'
}

const videoMaxBitRate = {
  "640x480": '1498k',
  // "1280x720": '2996k'
}

const videoBufferSize = {
  "640x480": '2100k',
  // "1280x720": '4200k',
}

function convertSegmentToCustomResolution(chunkName, resolution) {
  const segmentPath = path.join(distPath, 'original', chunkName);
  const destinationPath = path.join(distPath, resolution, chunkName);

  const convertSegmentArgs = [
    `-i ${segmentPath}`, 
    `-s ${resolution}`,
    '-vcodec libx264',
    '-acodec copy',
    '-c:a aac',
    '-ar 48000',
    `-b:a ${audioBitrate[resolution]}`,
    '-c:v h264',
    '-profile:v main',
    '-crf 20',
    `-b:v ${videoMinBitRate[resolution]}`,
    `-maxrate ${videoMaxBitRate[resolution]}`,
    `-bufsize ${videoBufferSize[resolution]}`,
    '-sc_threshold 0',
    '-keyint_min 48',
    '-muxdelay 0',
    '-copyts',
    destinationPath
  ].join(' ');

  // console.log(convertSegmentArgs);

  const convertSegment = `${ffmpegPath} ${convertSegmentArgs}`;

  execSync(convertSegment);
}

module.exports = convertSegmentToCustomResolution;