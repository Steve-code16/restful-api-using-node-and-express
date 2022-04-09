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

async function createPlayerStats(req, res, next) {
  try {
    const data = fs.readFileSync(path.join(__dirname, "./stats.json"));
    const stats = await JSON.parse(data);
    const { id, wins, losses, points_scored } = req.body;
    const newStats = {
      id: id,
      wins: wins,
      losses: losses,
      points_scored: points_scored,
    };
    stats.push(newStats);
    fs.writeFileSync(
      path.join(__dirname, "./stats.json"),
      JSON.stringify(stats, null, 2)
    );
    res.status(201).json(newStats);
  } catch (error) {
    next(error);
  }
}

async function updatePlayerStats(req, res, next) {
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
    const { wins, losses, points_scored } = req.body;
    const newStatsData = {
      id: parseInt(req.params.id),
      wins: wins,
      losses: losses,
      points_scored: points_scored,
    };
    const newStats = stats.map((player) => {
      if (player.id === Number(req.params.id)) {
        return newStatsData;
      } else {
        return player;
      }
    });
    fs.writeFileSync(
      path.join(__dirname, "./stats.json"),
      JSON.stringify(newStats, null, 2)
    );
    res.status(200).json(newStatsData);
  } catch (error) {
    next(error);
  }
}

async function deletePlayerStats(req, res, next) {
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
    const newStats = stats
      .map((player) => {
        if (player.id === Number(req.params.id)) {
          return null;
        } else {
          return player;
        }
      })
      .filter((player) => player !== null);
    fs.writeFileSync(
      path.join(__dirname, "./stats.json"),
      JSON.stringify(newStats, null, 2)
    );
    res.status(200).end();
  } catch (error) {
    next(error);
  }
}

router
  .route("/api/v1/stats/:id")
  .get(getPlayerStats)
  .put(updatePlayerStats)
  .delete(deletePlayerStats);
router.route("/api/v1/stats").post(createPlayerStats);

module.exports = router;
