const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");

const app = express();

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "987",
      hash: "",
      email: "john@gmail.com",
    },
  ],
};

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  // Load hash from your password DB
  bcrypt.compare(
    "1234abc",
    "$2a$10$ncW3ozdZcZ1nIiy4VgAkreUR5JnpPyi/IOVzwNeW.tS93wzLpCwhi",
    (err, res) => {
      // console.log("first guess", res);
    }
  );
  bcrypt.compare(
    "veggies",
    "$2a$10$ncW3ozdZcZ1nIiy4VgAkreUR5JnpPyi/IOVzwNeW.tS93wzLpCwhi",
    (err, res) => {
      // console.log("second guess", res);
    }
  );
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.status(200).json("success");
  } else {
    res.status(400).json("error loggin in");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, (err, hash) => {
    console.log(hash);
  });

  database.users.push({
    id: "125",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  res.status(201).json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.status(200).json(user);
    }
  });
  if (!found) {
    res.status(404).json("No user found with that id");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.status(200).json(user.entries);
    }
  });
  if (!found) {
    res.status(404).json("No user found with that id");
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}!`);
});
