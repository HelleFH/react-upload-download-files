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
  }  });
  module.exports = router;