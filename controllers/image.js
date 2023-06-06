const Clarifai = require("clarifai");

// basic use of Clarifai
const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_KEY,
});

const handleApiCall = (req, res) => {
  app.models
    .predict("face-detection", req.body.input)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("unable to work with API"));
};

const handleUpdateImageEntries = async (req, res, db) => {
  const { id } = req.body;
  const user = await db.users
    .update({
      where: { id: Number(id) },
      data: {
        entries: {
          increment: 1,
        },
      },
    })
    .catch(async (e) => {
      res.status(400).json("unable to get entries");
      await db.$disconnect();
      process.exit(1);
    });

  res.json(user.entries);
  // db("users")
  //   .where("id", "=", id)
  //   .increment("entries", 1)
  //   .returning("entries")
  //   .then((entries) => {
  //     //return a array of object[{entries: x}]
  //     res.json(entries[0].entries);
  //   })
  //   .catch((err) => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleUpdateImageEntries,
  handleApiCall,
};
