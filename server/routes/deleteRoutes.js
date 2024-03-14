const express = require('express');
const { Listing } = require('../model/listingModel');
<<<<<<< HEAD
const cloudinary = require('cloudinary').v2;
const router = express.Router();

router.delete('/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the listing by ID
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Use the stored public_id to delete the image from Cloudinary
    const { cloudinaryPublicId } = deletedListing;
    console.log('Cloudinary public_id:', cloudinaryPublicId);

    if (cloudinaryPublicId) {
      const result = await cloudinary.uploader.destroy(cloudinaryPublicId);
      console.log('Cloudinary deletion result:', result);
    }

    res.json({ message: 'Listing deleted successfully', deletedListing });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
=======
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
>>>>>>> 5e7d41e258ed5dfc79c07ef140268d3eb7918e5a

module.exports = router;
