const express = require('express');
const { Listing } = require('../model/listing');
const multer = require('multer');

const router = express.Router();

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
    cb(undefined, true); // continue with upload
  },
});

// Route for handling both file upload and listing data submission
router.post(
  '/upload',
  upload.single('file'),
  async (req, res) => {
    try {
      const { path, mimetype } = req.file;
      const { title } = req.body;
      const { description } = req.body;
      const { location } = req.body;


      // Save listing information with file details
      const listing = new Listing({
        title,
        description,
        location,
        file_path: path.replace(/\\/g, '/'),  // Replace backslashes with forward slashes
        file_mimetype: mimetype,
      });
      await listing.save();

      res.json({ msg: 'Listing data uploaded successfully.' });
    } catch (error) {
      console.error('Error while uploading listing data:', error);
      res.status(400).json({ error: 'Error while uploading listing data. Try again later.' });
    }
  },
  (error, req, res, next) => {
    if (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

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
