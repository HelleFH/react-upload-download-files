const express = require('express');
const { Listing } = require('../model/listingModel');
const fs = require('fs').promises;
const cloudinary = require('cloudinary').v2;
const router = express.Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Route for handling listing data submission with Cloudinary file upload
router.post('/upload', async (req, res) => {
  try {
    const { title, description, location } = req.body;

    // Assuming 'file' is the field name used for file upload
    const result = await cloudinary.uploader.upload(req.file.path);

    const listing = new Listing({
      title,
      description,
      location,
      cloudinaryUrl: result.secure_url,
      // Note: You may or may not want to store additional information
    });

    // Save the listing to the database
    await listing.save();

    // Remove the uploaded file after processing
    await fs.unlink(req.file.path);

    // Respond with success message
    res.json({ msg: 'Listing data uploaded successfully.' });
  } catch (error) {
    console.error('Error while uploading listing data:', error);
    res.status(400).json({ error: 'Error while uploading listing data. Try again later.' });
  }
});

module.exports = router;
