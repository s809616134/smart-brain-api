const handleProfile = async (req, res, db) => {
  const { id } = req.params;
  const user = await db.users
    .findUnique({
      where: { id: Number(id) },
    })
    .catch((err) => res.status(400).json("error getting user"));

  if (user) {
    res.json(user);
  } else {
    res.status(400).json("Not found");
  }
  //Boolean([]) = true
  //consider db return []
  // db.select()
  //   .from("users")
  //   .where({ id: id })
  //   .then((user) => {
  //     if (user.length) {
  //       res.json(user[0]);
  //     } else {
  //       res.status(400).json("Not found");
  //     }
  //   })
  //   .catch((err) => res.status(400).json("error getting user"));
};

module.exports = {
  handleProfile: handleProfile,
};
