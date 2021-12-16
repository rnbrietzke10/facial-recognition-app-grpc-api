const express = require('express');
require('dotenv').config();

const app = express();

//Middleware

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entties: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entties: 0,
      joined: new Date(),
    },
  ],
};

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.status(200).json('Success');
  } else {
    res.status(400).json('error loggin in');
  }
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  database.users.push({
    id: '125',
    name: name,
    email: email,
    password: password,
    entties: 0,
    joined: new Date(),
  });
  res.status(201).json(database.users[database.users.length - 1]);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}!`);
});

/* 
/ --> res = this is working
/signin --> POST respond with success or fail
/register --> POST respond with new user object
/profile/:userId --> GET respond with the user
/image --> PUT update the score, returns the updated data 

*/
