const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const listingRoutes = require('./routes/listingRoutes');

require('./config/db');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/listings', listingRoutes);

// Serve static files from the 'files' directory
app.use('/files', express.static(path.join(__dirname, 'files')));

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
