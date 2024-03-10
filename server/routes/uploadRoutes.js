const express = require('express');
const { Listing } = require('../model/listingModel');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const router = express.Router();

// Multer configuration for file upload
const upload = multer({
  storage: multer.memoryStorage(), // Store the file in memory instead of the local file system
  limits: {
    fileSize: 10000000, // max file size 1MB = 10000000 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
      return cb(
        new Error('Only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.')
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

// Route for handling file upload and listing data submission
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { buffer, originalname } = req.file;
    const { title, description, location } = req.body;

    // Upload file to Cloudinary directly from the buffer
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: 'auto', timeout: 60000 },  // Set the timeout to 60 seconds
      (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          res.status(400).json({ error: 'Error while uploading listing data. Try again later.' });
        } else {
          // Create a new Listing with Cloudinary URL and other data
          const listing = new Listing({
            title,
            description,
            location,
            cloudinaryUrl: result.secure_url,
            // Note: You may or may not want to store the file_path and file_mimetype
          });

          // Save the listing to the database
          listing.save();

          // Respond with success message
          res.json({ msg: 'Listing data uploaded successfully.' });
        }
      }
    );

    // Pipe the file buffer to the Cloudinary stream
    const stream = cloudinary.uploader.upload_stream(result);
    stream.end(buffer);
  } catch (error) {
    console.error('Error while uploading listing data:', error);
    res.status(400).json({ error: 'Error while uploading listing data. Try again later.' });
  }
});

module.exports = router;
