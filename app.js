const dotenv = require("dotenv");
const express = require("express");
const app = express();
const fs = require("fs");
const port = parseInt(process.env.PORT, 10) || 3000;

app.get("/", (_req, res) => {
  const appName = process.env.APP_NAME;
  res.send(appName);
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
