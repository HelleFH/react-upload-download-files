const express = require('express');
const router = express.Router();
const {
  deleteImage,
  deleteListing,
  getListingById,
  getListings,
  updateListing,
  uploadListing,
} = require('../controllers/listingController');
const upload = require('../middleware/upload');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get('/:id', getListingById);
router.get('/', getListings);
router.put('/:id', updateListing);
router.delete('/:id/delete-image', deleteImage);
router.delete('/:id', deleteListing);
router.post('/upload', upload.single('file'), uploadListing);

module.exports = router;
