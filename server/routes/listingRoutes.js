const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { Listing } = require('../model/listingModel');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.status(200).json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  try {
    const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, { new: true });
    res.json(updatedListing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id/delete-image', async (req, res) => {
  try {
    const id = req.params.id;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    await cloudinary.uploader.destroy(listing.cloudinaryUrl);

    // Optionally, update the listing data or remove the image URL from the listing
    // listing.cloudinaryUrl = null;
    // await listing.save();

    res.json({ msg: 'Image deleted successfully.' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
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

router.post('/upload', async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided.' });
    }

    const { path } = req.file;
    const { title, description, location } = req.body;

    // Handle file upload logic (e.g., using Cloudinary)
    const result = await cloudinary.uploader.upload(path);

    // Create a new listing with the uploaded file information
    const listing = new Listing({
      title,
      description,
      location,
      cloudinaryUrl: result.secure_url,
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
