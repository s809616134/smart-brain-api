const handleSignin = (db, bcrypt) => async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("invalid signin format");
  }

  const loginUser = await db.login
    .findUnique({
      where: { email: email },
    })
    .catch(async (e) => {
      res.status(400).json("unable to register");
      await db.$disconnect();
      process.exit(1);
    });

  const isValid = bcrypt.compareSync(password, loginUser.hash);
  if (!loginUser || !isValid) {
    res.status(400).json("Invallid credentials");
  } else {
    const validUser = await db.users.findUnique({
      where: {
        email: email,
      },
    });

    res.json(validUser);
  }
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
