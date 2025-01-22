const appleMusicService = require("../services/appleMusicService");

// Get developer token for frontend initialization
const getDeveloperToken = async (req, res) => {
  try {
    const token = await appleMusicService.generateDeveloperToken();
    res.json({ token });
  } catch (error) {
    console.error("Error getting developer token:", error);
    res.status(500).send("Error generating Apple Music developer token");
  }
};

// Create playlist from Spotify data
const createPlaylist = async (req, res) => {
  try {
    const { name, description, tracks, userToken } = req.body;

    const playlist = await appleMusicService.createPlaylist(
      userToken,
      name,
      description,
      tracks
    );

    res.json(playlist);
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).send("Error creating Apple Music playlist");
  }
};

module.exports = {
  getDeveloperToken,
  createPlaylist,
};
