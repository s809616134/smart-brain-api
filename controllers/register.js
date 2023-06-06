const handleRegister = async (req, res, db, bcrypt) => {
  //add user in database
  const { name, email, password } = req.body;
  //simple validation
  if (!name || !email || !password) {
    return res.status(400).json("invalid register format");
  }
  //encrypt
  const hash = bcrypt.hashSync(password);
  //transaction to garantee consistency of two tables

  const newUser = await db
    .$transaction([
      db.login.create({
        data: {
          hash: hash,
          email: email,
        },
      }),
      db.users.create({
        data: {
          email: email,
          name: name,
          joined: new Date(),
        },
      }),
    ])
    .catch(async (e) => {
      res.status(400).json("unable to register");
      await db.$disconnect();
      process.exit(1);
    });
  res.json(name);

  // db.transaction((trx) => {
  //   trx
  //     .insert({
  //       hash: hash,
  //       email: email,
  //     })
  //     .into("login")
  //     .returning("email")
  //     .then((loginEmail) => {
  //       return trx("users")
  //         .returning("*")
  //         .insert({
  //           //loginEmail return sth like: [{email: xxxx }]
  //           email: loginEmail[0].email,
  //           name: name,
  //           joined: new Date(),
  //         })
  //         .then((user) => {
  //           res.json(user[0]); //just return one user
  //         });
  //     })
  //     .then(trx.commit)
  //     .catch(trx.rollback);
  // }).catch((err) => res.status(400).json("unable to register"));

  //dont give mistake info to frontend
};

module.exports = {
  handleRegister: handleRegister,
};
