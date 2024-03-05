const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  cloudinaryUrl: { type: String, required: true }, // Add this field for storing Cloudinary URL

});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = { Listing };
