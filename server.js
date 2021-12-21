const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const e = require("express");
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: process.env.DATABASE_USER_NAME,
    password: process.env.DATABASE_PASSWORD,
    database: "smart-brain",
  },
});

db.select("*")
  .from("users")
  .then(data => {
    data;
  });

const app = express();

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  // Route not being used set up for future
  res.send("success");
});

app.post("/signin", (req, res) => {
  // Load hash from your password DB
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then(user => {
            res.status(200).json(user[0]);
          })
          .catch(err => res.status(400).json("Unable to get user"));
      } else {
        res.status(400).json("Wrong credentials");
      }
    })
    .catch(err => res.status(400).json("Wrong credentials"));
});

app.post("/register", (req, res) => {
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
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({
      id,
    })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(404).json("Not found");
      }
    })
    .catch(err => res.status(404).json("Error getting user"));
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.status(200).json(entries[0]);
    })
    .catch(err => res.status(400).json("Unable to get entries"));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}!`);
});
``;
