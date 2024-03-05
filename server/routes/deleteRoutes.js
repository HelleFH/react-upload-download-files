const express = require('express');
const { Listing } = require('../model/listing');
const multer = require('multer');
const fs = require('fs').promises; // For file operations
const path = require('path'); // Import the path module
const cloudinary = require('cloudinary').v2; // Add Cloudinary library
const router = express.Router();


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
  // Assuming you have something like this in your server code
router.delete('/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Perform the delete operation based on the ID
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json({ message: 'Listing deleted successfully', deletedListing });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

  module.exports = router;
  