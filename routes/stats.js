const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

async function getPlayerStats(req, res, next) {
  try {
    const data = fs.readFileSync(path.join(__dirname, "./stats.json"));
    const stats = await JSON.parse(data);
    const playerStats = stats.find(
      (player) => player.id === Number(req.params.id)
    );
    if (!playerStats) {
      const error = new Error("Player stats not found");
      error.status = 404;
      throw error;
    }
    res.json(playerStats);
  } catch (error) {
    next(error);
  }
}

router.route("/api/v1/stats/:id").get(getPlayerStats);

module.exports = router;
