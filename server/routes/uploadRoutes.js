const express = require('express');
const { Listing } = require('../model/listingModel');
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
      const { path } = req.file;
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
  module.exports = router;


