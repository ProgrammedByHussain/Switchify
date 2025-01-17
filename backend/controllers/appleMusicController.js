const appleMusicService = require("../services/appleMusicService");

const createPlaylist = async (req, res) => {
  const { playlistName, trackIds } = req.body;
  try {
    const playlist = await appleMusicService.createPlaylist(
      playlistName,
      trackIds
    );
    res.json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating Apple Music playlist");
  }
};

module.exports = { createPlaylist };
