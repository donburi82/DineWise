require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5050;

const { dbConnection } = require('./db/dbConnection');
const authRoute = require('./routes/auth/index.js');
const restaurantsRoute = require('./routes/restaurants/index.js');
const favoritesRoute = require('./routes/favorites/index.js');
const auth = require('./middleware/auth/index.js');

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', authRoute);
app.use('/restaurants', auth, restaurantsRoute);
app.use('/favorites', auth, favoritesRoute);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
  dbConnection(process.env.MongoURI);
});
