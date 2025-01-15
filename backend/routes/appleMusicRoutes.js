const express = require("express");
const axios = require("axios");
const router = express.Router();

const { APPLE_MUSIC_DEVELOPER_TOKEN } = process.env;

router.post("/createPlaylist", async (req, res) => {
  const { playlistName, trackIds } = req.body;

  try {
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
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating Apple Music playlist");
  }
});

module.exports = router;
