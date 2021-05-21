const express = require("express");
const db = require("./db");
const userRouter = require("./controllers/userController");
const gameRouter = require("./controllers/gameController");
const { urlencoded, json } = require("body-parser");
const validate = require("./middleware/validateSession");

const app = express();
const PORT = process.env.PORT || 4000;

db.sync().then(() =>
  app.listen(PORT, () => console.log(`App is listening on ${PORT} port...`))
);

app
  .use(urlencoded({ extended: false }))
  .use(json())
  .use("/api/auth", userRouter)
  .use(validate)
  .use("/api/game", gameRouter);
