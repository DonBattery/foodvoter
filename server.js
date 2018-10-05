const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(morgan("combined"));
app.use(express.static("public"));

app.post("/vote", (req, res) => {
  console.log(req.body);
  res.send("yolo");
});

app.get("*", (req, res) => {
  res.status(404).send("404 - Wrong Way 🐸");
});

app.listen(PORT, () => {
  console.log(`Food Voter Server listening on ${PORT}\n`);
});