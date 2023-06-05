const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3001;
const bcrypt = require("bcrypt-nodejs");

const signin = require("../controllers/signin");
const register = require("../controllers/register");
const profile = require("../controllers/profile");
const image = require("../controllers/image");

const db = require("knex")({
  client: "pg",
  connection: {
    host: process.env.POSTGRES_URL,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
  },
});

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());
//home
app.get("/test", (req, res) => {
  res.send("");
});

//signin
app.post("/signin", signin.handleSignin(db, bcrypt));

//register
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

//user profile
app.get("/profile/:id", (req, res) => {
  profile.handleProfile(req, res, db);
});

//entries update when submit an image
app.put("/image", (req, res) => {
  image.handleUpdateImageEntries(req, res, db);
});

//get url of image
app.post("/imageUrl", (req, res) => {
  image.handleApiCall(req, res, db);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
