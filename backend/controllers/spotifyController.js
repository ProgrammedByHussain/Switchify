const spotifyService = require("../services/spotifyService");

const login = (req, res) => {
  spotifyService.login(res);
};

const callback = async (req, res) => {
  try {
    const accessToken = await spotifyService.getAccessToken(req.query.code);
    res.redirect(`http://localhost:3001?access_token=${accessToken}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving Spotify access token");
  }
};

const getPlaylists = async (req, res) => {
  try {
    const playlists = await spotifyService.getUserPlaylists(
      req.headers.authorization
    );
    res.json(playlists);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching Spotify playlists");
  }
};

module.exports = { login, callback, getPlaylists };
