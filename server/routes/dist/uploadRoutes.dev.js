"use strict";

var express = require('express');

var _require = require('../model/listingModel'),
    Listing = _require.Listing;

var fs = require('fs').promises;

var cloudinary = require('cloudinary').v2;

var router = express.Router(); // Cloudinary configuration

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
}); // Route for handling listing data submission with Cloudinary file upload

router.post('/upload', function _callee(req, res) {
  var _req$body, title, description, location, result, listing;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, title = _req$body.title, description = _req$body.description, location = _req$body.location; // Assuming 'file' is the field name used for file upload

          _context.next = 4;
          return regeneratorRuntime.awrap(cloudinary.uploader.upload(req.file.path));

        case 4:
          result = _context.sent;
          listing = new Listing({
            title: title,
            description: description,
            location: location,
            cloudinaryUrl: result.secure_url // Note: You may or may not want to store additional information

          }); // Save the listing to the database

          _context.next = 8;
          return regeneratorRuntime.awrap(listing.save());

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(fs.unlink(req.file.path));

        case 10:
          // Respond with success message
          res.json({
            msg: 'Listing data uploaded successfully.'
          });
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.error('Error while uploading listing data:', _context.t0);
          res.status(400).json({
            error: 'Error while uploading listing data. Try again later.'
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
module.exports = router;