const router = require("express").Router();
const Game = require("../models/game");

router.get("/all", (_, res) => {
  Game.findAll()
    .then((games) =>
      games.length
        ? res.status(200).json({
            games,
            message: "Data fetched.",
          })
        : res.status(404).json({
            message: "Data not found",
          })
    )
    .catch(() => res.status(500).send("Something went wrong!"));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Game.findOne({ where: { id } })
    .then((game) =>
      game
        ? res.status(200).json({
            game,
          })
        : res.status(404).json({
            message: "Data not found.",
          })
    )
    .catch(() => res.status(500).send("Something went wrong!"));
});

router.post("/create", ({ body }, res) => {
  Game.create({
    title: body.game?.title,
    owner_id: body.game?.owner_id,
    studio: body.game?.studio,
    esrb_rating: body.game?.esrb_rating,
    user_rating: body.game?.user_rating,
    have_played: body.game?.have_played,
  })
    .then((game) =>
      res.status(201).json({
        game,
        message: "Game created.",
      })
    )
    .catch(({ message }) => res.status(500).send(message));
});

router.put("/update/:id", (req, res) => {
  const { id } = req.params;
  Game.update(
    {
      title: req.body.game?.title,
      studio: req.body.game?.studio,
      esrb_rating: req.body.game?.esrb_rating,
      user_rating: req.body.game?.user_rating,
      have_played: req.body.game?.have_played,
    },
    {
      where: {
        id,
      },
    }
  )
    .then((game) =>
      game
        ? res.status(200).json({
            message: "Successfully updated.",
          })
        : res.status(404).json({
            message: "Data not found",
          })
    )
    .catch(({ message }) => res.status(500).send(message));
});

router.delete("/remove/:id", (req, res) => {
  const { id } = req.params;
  Game.destroy({
    where: {
      id,
    },
  })
    .then((game) =>
      game
        ? res.status(200).json({
            game,
            message: "Successfully deleted",
          })
        : res.status(404).json({
            message: "Data not found",
          })
    )
    .catch(({ message }) => res.status(500).send(message));
});

module.exports = router;
