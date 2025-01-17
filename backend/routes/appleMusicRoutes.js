const express = require("express");
const router = express.Router();
const appleMusicController = require("../controllers/appleMusicController");

router.post("/createPlaylist", appleMusicController.createPlaylist);

module.exports = router;
