const express = require("express");
const router = express.Router();
const appleMusicController = require("../controllers/appleMusicController");

router.post("/user-token", appleMusicController.getDeveloperToken);
router.get("/playlists", appleMusicController.getPlaylists);

module.exports = router;
