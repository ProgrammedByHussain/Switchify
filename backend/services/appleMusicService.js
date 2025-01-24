const jwt = require("jsonwebtoken");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const generateDeveloperToken = () => {
  const teamId = process.env.APPLE_TEAM_ID;
  const keyId = process.env.APPLE_KEY_ID;
  const privateKeyPath = process.env.APPLE_PRIVATE_KEY_PATH;

  const privateKey = fs.readFileSync(
    path.resolve(__dirname, privateKeyPath),
    "utf8"
  );

  const payload = {
    iss: teamId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // Token valid for 1 hour
  };

  const token = jwt.sign(payload, privateKey, {
    algorithm: "ES256",
    header: {
      alg: "ES256",
      kid: keyId,
    },
  });

  return token;
};

const createPlaylist = async (userToken, name, description, tracks) => {
  const url = "https://api.music.apple.com/v1/me/library/playlists";

  const body = {
    attributes: {
      name,
      description,
    },
    relationships: {
      tracks: {
        data: tracks.map((trackId) => ({ id: trackId, type: "songs" })),
      },
    },
  };

  const response = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${generateDeveloperToken()}`,
      "Music-User-Token": userToken,
    },
  });

  return response.data;
};

module.exports = {
  generateDeveloperToken,
  createPlaylist,
};
