const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const deleteRoutes = require('./routes/deleteRoutes');
const listingRoutes = require('./routes/listingRoutes');
const uploadRoute = require('./routes/uploadRoute');
require('./db/db');
const { Listing } = require('./model/listingModel');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(deleteRoutes);
app.use(listingRoutes);
app.use(uploadRoute);
app.use('/files', express.static(path.join(__dirname, 'files')));

// MongoDB connection
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

// Update a listing by ID
app.put('/listings/:id', async (req, res) => {
  const id = req.params.id;
  const { title, description, location, cloudinaryUrl } = req.body;

  const updatedData = req.body;

  try {
    
    const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, { new: true });
    res.json(updatedListing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});