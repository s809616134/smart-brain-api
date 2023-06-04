const express = require("express");
const app = express();
const cors = require("cors");
const port = 3001;
const bcrypt = require("bcrypt-nodejs");

const signin = require("./controllers/signin");
const register = require("./controllers/register");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432, //postgres port NOT server port
    user: "postgres",
    password: "0verused",
    database: "user",
  },
});

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());
//home
app.get("/", (req, res) => {
  res.send(database.users);
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
