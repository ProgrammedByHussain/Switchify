const axios = require("axios");
const querystring = require("querystring");

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } =
  process.env;

//authorization with spotify
const login = (res) => {
  console.log("Starting login process");
  const scope = "playlist-read-private playlist-read-collaborative";
  const authUrl =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      show_dialog: true,
      state: Math.random().toString(36).substring(7),
    });

  console.log("Redirecting to:", authUrl);
  res.redirect(authUrl);
};

//generating access token
const getAccessToken = async (code) => {
  const tokenResponse = await axios.post(
    "https://accounts.spotify.com/api/token",
    querystring.stringify({
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      grant_type: "authorization_code",
    }),
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString(
            "base64"
          ),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return tokenResponse.data.access_token;
};

const getUserPlaylists = async (accessToken) => {
  console.log(
    "Getting playlists with token:",
    accessToken?.substring(0, 20) + "..."
  );
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: {
          Authorization: accessToken.startsWith("Bearer ")
            ? accessToken
            : `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Spotify API response status:", response.status);
    return response.data.items;
  } catch (error) {
    console.error("Spotify API error:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = { login, getAccessToken, getUserPlaylists };
