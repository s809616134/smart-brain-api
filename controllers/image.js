const Clarifai = require("clarifai");

// basic use of Clarifai
const app = new Clarifai.App({
  apiKey: "40d7504e73bf45928f9f5f985422af84",
});

const handleApiCall = (req, res) => {
  app.models
    .predict("face-detection", req.body.input)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("unable to work with API"));
};

const handleUpdateImageEntries = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      //return a array of object[{entries: x}]
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleUpdateImageEntries,
  handleApiCall,
};
