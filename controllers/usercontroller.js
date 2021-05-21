const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/signup", ({ body }, res) => {
  User.create({
    full_name: body.user?.full_name,
    username: body.user?.username,
    passwordHash: bcrypt.hashSync(body.user?.password ?? "", 10),
    email: body.user?.email,
  })
    .then((user) => {
      const token = jwt.sign({ id: user.id }, "lets_play_sum_games_man", {
        expiresIn: 60 * 60 * 24,
      });
      res.status(201).json({
        user,
        token,
      });
    })
    .catch(({ message }) => res.status(500).send(message));
});

router.post("/signin", ({ body }, res) => {
  User.findOne({ where: { username: body.user?.username } })
    .then((user) => {
      user
        ? bcrypt.compare(
            body.user?.password ?? "",
            user.passwordHash,
            (_, matches) => {
              if (matches) {
                const token = jwt.sign(
                  { id: user.id },
                  "lets_play_sum_games_man",
                  {
                    expiresIn: 60 * 60 * 24,
                  }
                );
                res.json({
                  user,
                  message: "Successfully authenticated.",
                  sessionToken: token,
                });
              } else {
                res.status(502).send({ error: "Passwords do not match." });
              }
            }
          )
        : res.status(403).send({ error: "User not found." });
    })
    .catch(({ message }) => res.status(500).send(message));
});

module.exports = router;
