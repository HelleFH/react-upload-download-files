"use strict";

var express = require('express');

var multer = require('multer');

var _require = require('../model/listingModel'),
    Listing = _require.Listing;

var cloudinary = require('cloudinary').v2;

var router = express.Router(); // Cloudinary configuration

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
}); // Multer configuration

var upload = multer(); // Route for handling file upload and listing data submission

router.post('/upload', upload.single('file'), function _callee(req, res) {
  var _req$body, title, description, location, result, listing;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, title = _req$body.title, description = _req$body.description, location = _req$body.location; // Use cloudinary.uploader.upload_stream to handle the file upload directly

          _context.next = 4;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            var uploadStream = cloudinary.uploader.upload_stream(function (error, result) {
              if (error) reject(error);else resolve(result);
            }); // Pipe the file buffer to the Cloudinary upload stream

            req.file.stream.pipe(uploadStream);
          }));

        case 4:
          result = _context.sent;
          listing = new Listing({
            title: title,
            description: description,
            location: location,
            cloudinaryUrl: result.secure_url // Additional fields or data you want to store

          }); // Save the listing to the database

          _context.next = 8;
          return regeneratorRuntime.awrap(listing.save());

        case 8:
          // Respond with success message
          res.json({
            msg: 'Listing data uploaded successfully.'
          });
          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.error('Error while uploading listing data:', _context.t0);
          res.status(400).json({
            error: 'Error while uploading listing data. Try again later.'
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
module.exports = router;