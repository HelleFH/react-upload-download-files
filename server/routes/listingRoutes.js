const express = require('express');
const { Listing } = require('../model/listing');
const multer = require('multer');
const fs = require('fs').promises; // For file operations
const path = require('path'); // Import the path module
const cloudinary = require('cloudinary').v2; // Add Cloudinary library
const router = express.Router();



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

  module.exports = router;
