const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/signup", (req, res) => {
  const { full_name, username, password, email } = req.body.user;
  User.create({
    full_name,
    username,
    passwordHash: bcrypt.hashSync(password, 10),
    email,
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
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

router.post("/signin", (req, res) => {
  const { username, password } = req.body.user;
  User.findOne({ where: { username } }).then((user) => {
    user
      ? bcrypt.compare(password, user.passwordHash, (err, matches) => {
          if (matches) {
            const token = jwt.sign({ id: user.id }, "lets_play_sum_games_man", {
              expiresIn: 60 * 60 * 24,
            });
            res.json({
              user: user,
              message: "Successfully authenticated.",
              sessionToken: token,
            });
          } else {
            res.status(502).send({ error: "Passwords do not match." });
          }
        })
      : res.status(403).send({ error: "User not found." });
  });
});

module.exports = router;
