const axios = require("axios");

const { APPLE_MUSIC_DEVELOPER_TOKEN } = process.env;

//create playlist in apple music
const createPlaylist = async (playlistName, trackIds) => {
  const response = await axios.post(
    "https://api.music.apple.com/v1/me/library/playlists",
    {
      attributes: { name: playlistName },
      relationships: {
        tracks: {
          data: trackIds.map((id) => ({ id, type: "songs" })),
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${APPLE_MUSIC_DEVELOPER_TOKEN}`,
      },
    }
  );
  return response.data;
};

module.exports = { createPlaylist };
