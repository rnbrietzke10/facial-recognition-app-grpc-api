const express = require('express');
require('dotenv').config();

const app = express();

app.get('/', (req, res) => {
  res.send('this is working');
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
