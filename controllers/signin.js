const handleSignin = (db, bcrypt) => async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("invalid signin format");
  }

  const user = await db.login.findUnique({
    where: { email: email },
  });

  const isValid = bcrypt.compareSync(password, user.hash);
  if (!user || !isValid) {
    res.status(400).json("Invallid credentials");
  }

  res.json(user);
  // db.select("email", "hash")
  //   .from("login")
  //   .where("email", "=", email)
  //   .then((data) => {
  //     const isValid = bcrypt.compareSync(password, data[0].hash);
  //     if (isValid) {
  //       //give info of success login user
  //       return db
  //         .select("*")
  //         .from("users")
  //         .where("email", "=", email)
  //         .then((user) => {
  //           res.json(user[0]);
  //         })
  //         .catch((err) => res.status(400).json("cannot get user"));
  //     } else {
  //       res.status(400).json("wrong credentials");
  //     }
  //   })
  //   .catch((err) => res.status(400).json("wrong credentials"));
};

module.exports = {
  handleSignin: handleSignin,
};
