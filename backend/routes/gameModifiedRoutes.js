const express = require("express");
const router = express.Router();
const gameModifiedController = require("../controller/gameModifiedController");

router.post("/POST/new/game", gameModifiedController.newGameResults);
router.post("/POST/results/game", gameModifiedController.addGameResults);
router.get("/GET/results/game", gameModifiedController.getGameResults);
router.delete("/DELETE/results/game", gameModifiedController.resetGameResults);
router.delete(
  "/DELETE/undo/results/game",
  gameModifiedController.undoGameResults
);
router.post(
  "/POST/detail/game",
  gameModifiedController.secondaryAddGameResults
);

module.exports = router;
