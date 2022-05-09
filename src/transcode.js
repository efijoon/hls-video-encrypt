const fs = require('fs');
const path = require('path');
const createMasterPlaylist = require('./createMasterPlaylist');
const createSegmentsFromOriginalVideo = require('./createSegmentsFromOriginalVideo');
const generateEncryptedSegments = require('./generateEncryptedSegments');
const generateEncryptionKey = require('./generateEncryptionKey');
const convertVideo = require('./convertVideo');

const inputPath = path.join(__dirname, '..', 'video.mp4');
const distPath = path.join(__dirname, '..', 'dist');
const resolutions = ['848x480'];

const main = async () => {
  await convertVideo(inputPath, resolutions[0]);
  await createSegmentsFromOriginalVideo(inputPath, distPath, resolutions[0]);

  await Promise.all(resolutions.map(async (resolution) => {
    const encryptPath = path.join(distPath, 'encrypted', resolution);
    if(fs.existsSync(encryptPath))
      fs.rmSync(encryptPath, { recursive: true, force: true });
    
    await fs.promises.mkdir(encryptPath, { 
      recursive: true 
    });

    await generateEncryptionKey(resolution, 'http://localhost:5000/dist/encrypted', distPath);
    await generateEncryptedSegments(resolution, inputPath, distPath);

    console.info(`
      ===================================================================================

          Encrypted video with the resolution of ${resolution}p was generated!

      ===================================================================================
    `);
  }));

  await createMasterPlaylist();

  
}

main();