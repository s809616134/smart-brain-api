const handleRegister = (req, res, db, bcrypt) => {
  //add user in database
  const { name, email, password } = req.body;
  //simple validation
  if (!name || !email || !password) {
    return res.status(400).json("invalid register format");
  }
  //encrypt
  const hash = bcrypt.hashSync(password);
  //transaction to garantee consistency of two tables
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            //loginEmail return sth like: [{email: xxxx }]
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]); //just return one user
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("unable to register"));

  //dont give mistake info to frontend
};

module.exports = {
  handleRegister: handleRegister,
};
