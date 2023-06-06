const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const bcrypt = require("bcrypt-nodejs");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const signin = require("../controllers/signin");
const register = require("../controllers/register");
const profile = require("../controllers/profile");
const image = require("../controllers/image");

//entries type is BigInt, express cannot serialize it
BigInt.prototype.toJSON = function () {
  return this.toString();
};
const db = new PrismaClient();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());
//home
app.get("/test", async (req, res) => {
  try {
    const allUsers = await db.users.findMany();
    res.json(allUsers);
  } catch (e) {
    console.log(e);
  } finally {
    async () => await db.$disconnect();
  }
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

module.exports = {
  app,
};
