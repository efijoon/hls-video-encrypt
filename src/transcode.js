const fs = require('fs');
const path = require('path');

const convertSegmentToCustomResolution = require('./convertSegmentToCustomResolution');
const createMasterPlaylist = require('./createMasterPlaylist');
const createSegmentsFromOriginalVideo = require('./createSegmentsFromOriginalVideo');
const generateEncryptedSegments = require('./generateEncryptedSegments');
const generateEncryptionKey = require('./generateEncryptionKey');
const getVideoInformation = require('./getVideoInformation');
const mergeSegmentsIntoVideo = require('./mergeSegmentsIntoVideo');

const inputPath = path.join(__dirname, '..', 'video.mp4');
const distPath = path.join(__dirname, '..', 'dist');

const main = async () => {
  // const info = await getVideoInformation(inputPath);
  // const has720Resolution = info.streams.some(stream => {
  //   return stream.width === 1280 && stream.height === 720;
  // });

  // if (!has720Resolution)
  //   throw new Error('Incorrect video resolution, please use 1280x720.');

  const numberOfChunks = await createSegmentsFromOriginalVideo(inputPath, distPath);

  const meregedPath = path.join(distPath, 'merged');
  if(fs.existsSync(meregedPath))
    fs.rmSync(meregedPath, { recursive: true, force: true });

  await fs.promises.mkdir(meregedPath);

  await Promise.all(['640x480'].map(async (resolution) => { // '1280x720'
    const convertSegmentsPromises = [];
    const destinationPath = path.join(distPath, resolution);

    if(fs.existsSync(destinationPath))
      fs.rmSync(destinationPath, { recursive: true, force: true });
    
    await fs.promises.mkdir(destinationPath);

    for (let i = 0; i < numberOfChunks; i++) {
      const convertSegmentPromise = convertSegmentToCustomResolution(
        `chunk${String(i).padStart(5, '0')}.ts`,
        resolution,
        distPath
      );

      convertSegmentsPromises.push(convertSegmentPromise)
    }

    await Promise.all(convertSegmentsPromises);

    await fs.promises.copyFile(
      path.join(distPath, 'original', 'playlist.m3u8'),
      path.join(destinationPath, 'playlist.m3u8')
    );

    const encryptPath = path.join(distPath, 'encrypted', resolution);
    if(fs.existsSync(encryptPath))
      fs.rmSync(encryptPath, { recursive: true, force: true });
    
    await fs.promises.mkdir(encryptPath, { 
      recursive: true 
    });

    await generateEncryptionKey(resolution, 'http://localhost:5001/dist/encrypted', distPath);
    await mergeSegmentsIntoVideo(resolution, distPath);
    await generateEncryptedSegments(resolution, distPath);

console.info(`
===================================================================================

    Encrypted video with the resolution of ${resolution}p was generated!

===================================================================================
`);
  }));

  await createMasterPlaylist();
}

main();