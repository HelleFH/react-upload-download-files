const express = require('express');
const multer = require('multer');
const { Listing } = require('../model/listingModel');
const cloudinary = require('cloudinary').v2;
const router = express.Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration
const upload = multer();

// Route for handling file upload and listing data submission
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { title, description, location } = req.body;

    // Use cloudinary.uploader.upload_stream to handle the file upload directly
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
        if (error) reject(error);
        else resolve(result);
      });

      // Pipe the file buffer to the Cloudinary upload stream
      req.file.stream.pipe(uploadStream);
    });

    const listing = new Listing({
      title,
      description,
      location,
      cloudinaryUrl: result.secure_url,
      // Additional fields or data you want to store
    });

    // Save the listing to the database
    await listing.save();

    // Respond with success message
    res.json({ msg: 'Listing data uploaded successfully.' });
  } catch (error) {
    console.error('Error while uploading listing data:', error);
    res.status(400).json({ error: 'Error while uploading listing data. Try again later.' });
  }
});

module.exports = router;
