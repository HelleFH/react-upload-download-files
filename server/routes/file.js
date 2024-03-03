
const express = require('express');
const {  File } = require('../model/file');
const { Book } = require('../model/book');

const multer = require('multer');

const router = express.Router();

// Define multer storage and file filter
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

// Combined route for handling both file upload and book data submission
router.post(
  '/upload',
  upload.single('file'),
  async (req, res) => {
    try {
      const { path, mimetype } = req.file;
      const { title } = req.body;

      // Save file information
      const file = new File({
        file_path: path,
        file_mimetype: mimetype,
      });
      const savedFile = await file.save();

      // Save book information with a reference to the file
      const book = new Book({
        title,
        file: savedFile._id, // Associate the file with the book
      });
      await book.save();

      res.json({ msg: 'File and book data uploaded successfully.' });
    } catch (error) {
      console.error('Error while uploading file and book data:', error);
      res.status(400).json({ error: 'Error while uploading file and book data. Try again later.' });
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
    const books = await Book.find().populate('file'); // Use populate to get the associated file details
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Other book routes...
// ...

module.exports = router;