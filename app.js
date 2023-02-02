const dotenv = require("dotenv");
const express = require("express");
const app = express();
const fs = require("fs");
const port = parseInt(process.env.PORT, 10) || 3000;
const PropertiesReader = require('properties-reader');
const base64 = require('base-64');
const watch = require('node-watch');
const mongoose = require('mongoose')


dotenv.config()
const properties = PropertiesReader('/vault/secrets/envvars').each((k, v) => {
  console.log(k, v)
});

const mongoCrds = PropertiesReader('/vault/secrets/mongodb')
const MONGO_USERNAME = base64.decode(mongoCrds.get("USERNAME"));
const MONGO_PASSWORD = base64.decode(mongoCrds.get("PASSWORD"));
mongoose.connect(`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@playground.uakfbxn.mongodb.net/sample_mflix?retryWrites=true&w=majority&connectTimeoutMS=300000`)

const commentSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  date: Date,
  email: String,
  movie_id: mongoose.Schema.Types.ObjectId,
  name: String,
  text: String
});

const Comment = mongoose.model('Comment', commentSchema);

// const watcher = watch('/Users/preecharatchuenta/vaultenvvars.secret', { recursive: true })
// watcher.on('ready', () => {
//   PropertiesReader('/Users/preecharatchuenta/vaultenvvars.secret').each((k, v) => {
//     global[k] = base64.decode(v)
//   })
// })

// watcher.on('change', () => {
//   PropertiesReader('/Users/preecharatchuenta/vaultenvvars.secret').each((k, v) => {
//     global[k] = base64.decode(v)
//   })
// })

app.get("/comment/:id", async (req,res) => {
  const _id = req.params.id
//   if (req.params.id === "favicon.ico") {
//     return res.status(404)
// }

  const result = await Comment.findOne({ _id: `${_id}` }).lean();
  console.log(result);
  return res.json(result)

})


app.get("/", async (_req, res) => {
  const properties = PropertiesReader('/vault/secrets/envvars.secret').each((k, v) => {
    console.log(k, v)
  });
  appName = base64.decode(properties.get("APP_NAME"));
  const port = global.PORT
  const appName = global.APP_NAME
  
  res.send({ port, app_name: appName });
});


app.listen(port, () => {
    
  console.log(`App listening on http://localhost:${port}`);
  const id = ["5a9427648b0beebeb69579e7", "5a9427648b0beebeb6957abd", "5a9427648b0beebeb6957ac8", "5a9427648b0beebeb6957b51"]
  setInterval(async () => {
    const result = await Comment.findOne({ _id: `${id[Math.floor(Math.random() * 3)]}` }).lean();
    console.log(result);
  }, 1000);

})