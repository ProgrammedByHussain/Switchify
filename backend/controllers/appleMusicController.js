const appleMusicService = require("../services/appleMusicService");

const getDeveloperToken = (req, res) => {
  try {
    const token = appleMusicService.generateDeveloperToken();
    res.json({ token });
  } catch (error) {
    console.error("Error generating developer token:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
};

const createPlaylist = async (req, res) => {
  try {
    const { name, description, tracks, userToken } = req.body;

    if (!userToken) {
      return res.status(400).send("User token is required");
    }

    const playlist = await appleMusicService.createPlaylist(
      userToken,
      name,
      description,
      tracks
    );
    res.json(playlist);
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({ error: "Failed to create playlist" });
  }
};

module.exports = {
  getDeveloperToken,
  createPlaylist,
};
