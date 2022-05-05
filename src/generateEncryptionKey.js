const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// http://localhost:5001/dist/enc.key
// /Users/diegofernandes/www/lambda-transcoding/dist/enc.key
// f192b31edaba4424d3804d8ddbf0b7ce

async function generateEncryptionKey(
  resolution,
  domain = "http://localhost:5001/dist/encrypted",
  keyPath = path.join(__dirname, "..", "dist")
) {
  const key = crypto.randomBytes(16).toString("hex");
  const iv = crypto.randomBytes(16).toString("hex");
  const encryptionKeyFilePath = path.join(
    keyPath,
    "encrypted",
    resolution,
    "encryption.key"
  );

  await fs.promises.writeFile(encryptionKeyFilePath, key);

  const encryptionKeyInfo = [
      `${domain}/${resolution}/encryption.key`,
      path.resolve(keyPath, "encrypted", resolution, "encryption.key"),
      iv,
    ].join("\n");
    
  const keyInfoFilePath = path.join(
      keyPath,
      "encrypted",
      resolution,
      "encryption.keyinfo"
    );

  await fs.promises.writeFile(keyInfoFilePath, encryptionKeyInfo);
}

module.exports = generateEncryptionKey;
