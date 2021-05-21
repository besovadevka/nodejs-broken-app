const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = ({ method, headers }, res, next) => {
  if (method == "OPTIONS") {
    next(); // allowing options as a method for request
  } else {
    const sessionToken = headers.authorization;
    console.log(sessionToken);
    !sessionToken
      ? res.status(403).send({ auth: false, message: "No token provided." })
      : jwt.verify(
          sessionToken.includes("Bearer ")
            ? sessionToken.slice(7)
            : sessionToken,
          "lets_play_sum_games_man",
          (_, decoded) => {
            decoded
              ? User.findOne({ where: { id: decoded.id } })
                  .then((user) => {
                    console.log(`user: ${user}`);
                    next();
                  })
                  .catch((err) => {
                    res.status(401).send({ error: "not authorized" });
                    console.log(decoded, err);
                  })
              : res.status(400).send({ error: "not authorized" });
          }
        );
  }
};
