const express = require('express');
const { Listing } = require('../model/listingModel');
const asyncHandler = require('../middleware/asyncHandler'); // Update with the correct path
const router = express.Router();

// Wrap each route handler with asyncHandler

router.get('/listings/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;

  // Fetch the listing from the database based on the ID
  const listing = await Listing.findById(id);

  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  // If the listing is found, send it in the response
  res.status(200).json(listing);
}));

router.get('/listings', asyncHandler(async (req, res) => {
  const listings = await Listing.find();
  res.json(listings);
}));

module.exports = router;
