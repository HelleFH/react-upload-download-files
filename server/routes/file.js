const express = require('express');
const { Book } = require('../model/book');
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
    fileSize: 1000000, // max file size 1MB = 1000000 bytes
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

// Route for handling both file upload and book data submission
router.post(
  '/upload',
  upload.single('file'),
  async (req, res) => {
    try {
      const { path, mimetype } = req.file;
      const { title } = req.body;
      const { description } = req.body;
      const { location } = req.body;


      // Save book information with file details
      const book = new Book({
        title,
        description,
        location,
        file_path: path.replace(/\\/g, '/'),  // Replace backslashes with forward slashes
        file_mimetype: mimetype,
      });
      await book.save();

      res.json({ msg: 'Book data uploaded successfully.' });
    } catch (error) {
      console.error('Error while uploading book data:', error);
      res.status(400).json({ error: 'Error while uploading book data. Try again later.' });
    }
  },
  (error, req, res, next) => {
    if (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
