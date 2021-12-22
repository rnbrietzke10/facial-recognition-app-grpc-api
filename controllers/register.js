const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then(loginEmail => {
        return trx
          .insert({
            name: name,
            email: loginEmail[0],
            joined: new Date(),
          })
          .into("users")
          .returning("*")
          .then(user => res.status(201).json(user[0]));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => res.status(400).json("Unable to register"));
};

module.exports = {
  handleRegister,
};
