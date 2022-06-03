const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');

const UTILS = require('./utils/utils');

dotenv.config();

const app = express();
app.use(express.json());

// security packages
app.use(cors());

// use routes
app.use('/client', require('./routes/client'));
app.use('/node', require('./routes/node'));

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('../client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html'));
  });
}

const port = UTILS.PORT || 5001;

app.listen(port, () => console.log(`Node # ${UTILS.NODE_NUMBER} running on port ${port}`));