const path = require('path');
const fs = require('fs');
const HLS = require('hls-parser');

const distPath = path.join(__dirname, "..", "dist");

const { MasterPlaylist, Variant } = HLS.types;

const resolutions = ["848x480"];

async function createMasterPlaylist() {
  const variants = resolutions.map((resolution) => {
    const playlistPath = path.join(
      distPath,
      "encrypted",
      resolution,
      "playlist.m3u8"
    );
    const playlistContent = fs.readFileSync(playlistPath, { encoding: "utf8" });

    const { segments } = HLS.parse(playlistContent);
    const segment = segments[0];
    const segmentPath = path.join(distPath, resolution, segment.uri);
    const { size } = fs.statSync(segmentPath);

    const bandwidth = (size * 8) / segment.duration;

    const [width, height] = resolution.split("x").map(Number);

    return new Variant({
      uri: `${resolution}/playlist.m3u8`,
      bandwidth: Math.ceil(bandwidth),
      resolution: {
        width,
        height,
      },
    });
  });

  const masterPlaylist = new MasterPlaylist({
    variants,
  });

  await fs.promises.writeFile(
    path.join(distPath, "encrypted", "master.m3u8"),
    HLS.stringify(masterPlaylist)
  );
}

module.exports = createMasterPlaylist;