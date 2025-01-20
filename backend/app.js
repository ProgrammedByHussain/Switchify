const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const spotifyRoutes = require("./routes/spotifyRoutes");
const appleMusicRoutes = require("./routes/appleMusicRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/spotify", spotifyRoutes);
app.use("/api/apple-music", appleMusicRoutes);

module.exports = app;
