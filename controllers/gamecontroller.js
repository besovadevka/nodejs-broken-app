const router = require("express").Router();
const Game = require("../models/game");

router.get("/all", ({ user }, res) => {
  Game.findAll({ where: { owner_id: user.id } })
    .then((games) =>
      res.status(200).json({
        games,
        message: "Data fetched.",
      })
    )
    .catch(() =>
      res.status(500).json({
        message: "Data not found",
      })
    );
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Game.findOne({ where: { id, owner_id: req.user.id } })
    .then((game) =>
      res.status(200).json({
        game,
      })
    )
    .catch(() =>
      res.status(500).json({
        message: "Data not found.",
      })
    );
});

router.post("/create", (req, res) => {
  const { title, owner_id, studio, esrb_rating, user_rating, have_played } =
    req.body.game;
  Game.create({
    title,
    owner_id,
    studio,
    esrb_rating,
    user_rating,
    have_played,
  })
    .then((game) =>
      res.status(200).json({
        game,
        message: "Game created.",
      })
    )
    .catch(({ message }) => res.status(500).send(message));
});

router.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const { title, owner_id, studio, esrb_rating, user_rating, have_played } =
    req.body.game;
  Game.update(
    {
      title,
      studio,
      esrb_rating,
      user_rating,
      have_played,
    },
    {
      where: {
        id,
        owner_id,
      },
    }
  ).then((game) =>
    res
      .status(200)
      .json({
        game,
        message: "Successfully updated.",
      })
      .catch(({ message }) =>
        res.status(500).json({
          message,
        })
      )
  );
});

router.delete("/remove/:id", (req, res) => {
  const { id } = req.params;
  const { owner_id } = req.game;
  Game.destroy({
    where: {
      id,
      owner_id,
    },
  })
    .then((game) =>
      res.status(200).json({
        game,
        message: "Successfully deleted",
      })
    )
    .catch(({ message }) =>
      res.status(500).json({
        message,
      })
    );
});

module.exports = router;
