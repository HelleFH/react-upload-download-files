"use strict";

var express = require('express');

var _require = require('../model/listingModel'),
    Listing = _require.Listing;

var multer = require('multer');

var fs = require('fs').promises;

var path = require('path');

var cloudinary = require('cloudinary').v2;

var router = express.Router();
var upload = multer({
  storage: multer.diskStorage({
    destination: function destination(req, file, cb) {
      cb(null, './files');
    },
    filename: function filename(req, file, cb) {
      cb(null, "".concat(new Date().getTime(), "_").concat(file.originalname));
    }
  }),
  limits: {
    fileSize: 10000000 // max file size 1MB = 10000000 bytes

  },
  fileFilter: function fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
      return cb(new Error('Only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.'));
    }

    cb(null, true); // continue with upload
  }
});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
router.post('/upload', upload.single('file'), function _callee(req, res) {
  var _path, _req$body, title, description, location, result, listing;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;

          if (req.file) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: 'No file uploaded.'
          }));

        case 3:
          _path = req.file.path;
          _req$body = req.body, title = _req$body.title, description = _req$body.description, location = _req$body.location; // Upload file to Cloudinary

          _context.next = 7;
          return regeneratorRuntime.awrap(cloudinary.uploader.upload(_path));

        case 7:
          result = _context.sent;
          // Create a new Listing with Cloudinary URL and other data
          listing = new Listing({
            title: title,
            description: description,
            location: location,
            cloudinaryUrl: result.secure_url // Note: You may or may not want to store the file_path and file_mimetype

          }); // Save the listing to the database

          _context.next = 11;
          return regeneratorRuntime.awrap(listing.save());

        case 11:
          _context.next = 13;
          return regeneratorRuntime.awrap(fs.unlink(_path));

        case 13:
          // Respond with success message
          res.json({
            msg: 'Listing data uploaded successfully.'
          });
          _context.next = 20;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](0);
          console.error('Error while uploading listing data:', _context.t0); // Handle errors properly and respond with an appropriate status code

          res.status(500).json({
            error: 'Internal Server Error.'
          });

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 16]]);
});
module.exports = router;