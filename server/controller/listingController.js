const cloudinary = require('cloudinary').v2;
const { Listing } = require('../model/listingModel');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fetch a specific listing by its ID
const getListingById = async (req, res) => {
  try {
    const id = req.params.id;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.status(200).json(listing);
  } catch (error) {
    console.error('Error fetching listing by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Fetch all listings
const getListings = async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (error) {
    console.error('Error fetching all listings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a listing by its ID
const updateListing = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, { new: true });
    res.json(updatedListing);
  } catch (error) {
    console.error('Error updating listing by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete an image associated with a listing
const deleteImage = async (req, res) => {
  try {
    const id = req.params.id;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    await cloudinary.uploader.destroy(listing.cloudinaryUrl);

    res.json({ msg: 'Image deleted successfully.' });
  } catch (error) {
    console.error('Error deleting image associated with listing:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a listing by its ID
const deleteListing = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json({ message: 'Listing deleted successfully', deletedListing });
  } catch (error) {
    console.error('Error deleting listing by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Upload a new listing with an associated image
const uploadListing = async (req, res) => {
  try {
    const { path } = req.file;
    const { title, description, location } = req.body;

    const result = await cloudinary.uploader.upload(path);

    const listing = new Listing({
      title,
      description,
      location,
      cloudinaryUrl: result.secure_url,
    });

    await listing.save();
    res.json({ msg: 'Listing data uploaded successfully.' });
  } catch (error) {
    console.error('Error uploading listing:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getListingById,
  getListings,
  updateListing,
  deleteImage,
  deleteListing,
  uploadListing,
};
