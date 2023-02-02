import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
const posts = [
  {
    username: "Rakesh",
    post: "Post 1",
  },
  {
    username: "Rohit",
    post: "Post 2",
  },
];

app.get("/", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };
  const accessToken = jwt.sign(user, process.env.SECRET_TOKEN);
  res.json(accessToken);
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) res.sendStatus(401);
  jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
    if (err) res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(8080, () => {
  console.log("Running on 8080");
});
