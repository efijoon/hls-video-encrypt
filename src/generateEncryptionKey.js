const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// http://localhost:5001/dist/enc.key
// /Users/diegofernandes/www/lambda-transcoding/dist/enc.key
// f192b31edaba4424d3804d8ddbf0b7ce

const distPath = path.join(__dirname, '..', 'dist');

async function generateEncryptionKey(resolution) {
  const key = crypto.randomBytes(16).toString('hex');
  const iv = crypto.randomBytes(16).toString('hex');

  const encryptionKeyFilePath = path.join(distPath, 'encrypted', resolution, 'encryption.key');

  await fs.promises.writeFile(encryptionKeyFilePath, key);

  const encryptionKeyInfo = [
    `http://localhost:5001/dist/encrypted/${resolution}/encryption.key`,
    path.resolve(distPath, 'encrypted', resolution, 'encryption.key'),
    iv
  ].join('\n');

  const keyInfoFilePath = path.join(distPath, 'encrypted', resolution, 'encryption.keyinfo');

  await fs.promises.writeFile(keyInfoFilePath, encryptionKeyInfo);
}

module.exports = generateEncryptionKey;