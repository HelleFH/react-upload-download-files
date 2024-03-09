"use strict";

var express = require('express');

var _require = require('../model/listingModel'),
    Listing = _require.Listing;

var multer = require('multer');

var fs = require('fs').promises; // For file operations


var path = require('path'); // Import the path module


var cloudinary = require('cloudinary').v2; // Add Cloudinary library


var router = express.Router();
router["delete"]('/listings/:id/delete-image', function _callee(req, res) {
  var id, listing;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          id = req.params.id; // Fetch the listing from the database based on the ID

          _context.next = 4;
          return regeneratorRuntime.awrap(Listing.findById(id));

        case 4:
          listing = _context.sent;

          if (listing) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            error: 'Listing not found'
          }));

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(cloudinary.uploader.destroy(listing.cloudinaryUrl));

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap(listing.save());

        case 11:
          res.json({
            msg: 'Image deleted successfully.'
          });
          _context.next = 18;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          console.error('Error deleting image:', _context.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
router["delete"]('/listings/:id', function _callee2(req, res) {
  var id, deletedListing;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          id = req.params.id;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Listing.findByIdAndDelete(id));

        case 4:
          deletedListing = _context2.sent;

          if (deletedListing) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            error: 'Listing not found'
          }));

        case 7:
          res.json({
            message: 'Listing deleted successfully',
            deletedListing: deletedListing
          });
          _context2.next = 14;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.error('Error deleting listing:', _context2.t0);
          res.status(500).json({
            error: 'Internal server error'
          });

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
module.exports = router;