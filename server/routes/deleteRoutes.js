const express = require('express');
const { Listing } = require('../model/listingModel');
const asyncHandler = require('../middleware/asyncHandler'); // Update with the correct path
const cloudinary = require('cloudinary').v2; // Add Cloudinary library
const router = express.Router();

// Wrap each route handler with asyncHandler

router.delete('/listings/:id/delete-image', asyncHandler(async (req, res) => {
  const id = req.params.id;

  // Fetch the listing from the database based on the ID
  const listing = await Listing.findById(id);

  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  // Delete the image from Cloudinary
  await cloudinary.uploader.destroy(listing.cloudinaryUrl);

  // Remove the file path from the listing (if needed)
  // listing.file_path = null;

  // Save the updated listing without the image
  await listing.save();

  res.json({ msg: 'Image deleted successfully.' });
}));

router.delete('/listings/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  res.json({ message: 'Listing deleted successfully', deletedListing });
}));

module.exports = router;
