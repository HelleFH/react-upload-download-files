const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },

  file_path: { type: String, required: true },
  file_mimetype: { type: String, required: true },
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = { Listing };
