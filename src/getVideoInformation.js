const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

const tmpPath = path.join(__dirname, "..", 'tmp');
const probeVideoDataPath = path.join(tmpPath, 'probeVideoData.json');

async function getVideoInformation(objectPath) {
  const command = `ffprobe -v error -show_entries stream=width,height -show_entries format=size,duration -print_format json -i "${objectPath}" > "${probeVideoDataPath}"`;

  execSync(command);

  const probeData = await fs.promises.readFile(probeVideoDataPath);

  return JSON.parse(probeData.toString());
};

module.exports = getVideoInformation;