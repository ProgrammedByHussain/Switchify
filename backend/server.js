const express = require("express");
const dotenv = require("dotenv");
const spotifyRoutes = require("./routes/spotifyRoutes");
const appleMusicRoutes = require("./routes/appleMusicRoutes");

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use("/api/spotify", spotifyRoutes);
app.use("/api/applemusic", appleMusicRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
