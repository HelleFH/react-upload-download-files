const express = require('express');
const { Listing } = require('../model/listing');
const multer = require('multer');
const fs = require('fs').promises; // For file operations
const path = require('path'); // Import the path module
const cloudinary = require('cloudinary').v2; // Add Cloudinary library
const router = express.Router();

// Multer configuration for file upload
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './files');
    },
    filename(req, file, cb) {
      cb(null, `${new Date().getTime()}_${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 10000000, // max file size 1MB = 10000000 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
      return cb(
        new Error(
          'Only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.'
        )
      );
    }
    cb(null, true); // continue with upload
  },
});

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Route for handling both file upload and listing data submission
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { path, mimetype } = req.file;
    const { title, description, location } = req.body;

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(path);

    // Create a new Listing with Cloudinary URL and other data
    const listing = new Listing({
      title,
      description,
      location,
      cloudinaryUrl: result.secure_url,
      // Note: You may or may not want to store the file_path and file_mimetype
      file_path: path.replace(/\\/g, '/'), // Replace backslashes with forward slashes
      file_mimetype: mimetype,
    });

    // Save the listing to the database
    await listing.save();

    // Remove the uploaded file after processing
    await fs.unlink(path);

    // Respond with success message
    res.json({ msg: 'Listing data uploaded successfully.' });
  } catch (error) {
    console.error('Error while uploading listing data:', error);
    res.status(400).json({ error: 'Error while uploading listing data. Try again later.' });
  }
});

router.get('/listings/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Fetch the listing from the database based on the ID
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // If the listing is found, send it in the response
    res.status(200).json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/listings', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.delete('/listings/:id/delete-image', async (req, res) => {
  try {
    const id = req.params.id;

    // Fetch the listing from the database based on the ID
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Delete the image from Cloudinary (assuming cloudinaryUrl is stored in the listing)
    await cloudinary.uploader.destroy(listing.cloudinaryUrl);

    // Remove the file path from the listing (if needed)
    // listing.file_path = null;

    // Save the updated listing without the image
    await listing.save();

    res.json({ msg: 'Image deleted successfully.' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add other routes for listing operations (get, update, delete) here

module.exports = router;
