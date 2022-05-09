const path = require('path');
const fs = require('fs');
const fluentFfmpeg = require('fluent-ffmpeg');
const uuidV4 = require('uuid').v4;

async function convertVideo(inputPath, resolution) {
  const inputInfo = path.parse(inputPath);
  const convertedUuidVideoName = `${inputInfo.dir}/${uuidV4()}${path.extname(inputPath)}`;
  const convertedVideoName = `${inputInfo.dir}/${inputInfo.base}`;

  return new Promise((resolve, reject) => {
    fluentFfmpeg(inputPath)
      .withSize(resolution)
      .withAspect('16:9')
      .output(convertedUuidVideoName)
      .on('progress', (progress) => {
        console.log('Converting Video:', progress.percent, '% done');
      })
      .once('end', async () => {
        fs.unlinkSync(inputPath);
        fs.renameSync(convertedUuidVideoName, convertedVideoName);
        
        resolve();
      })
      .once('error', err => {
        reject(err);
      })
      .run();
  });
};

module.exports = convertVideo;