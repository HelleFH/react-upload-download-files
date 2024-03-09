"use strict";

var express = require('express');

var _require = require('../model/listingModel'),
    Listing = _require.Listing;

var multer = require('multer');

var fs = require('fs').promises; // For file operations


var path = require('path'); // Import the path module


var cloudinary = require('cloudinary').v2; // Add Cloudinary library


var router = express.Router();
router.get('/listings/:id', function _callee(req, res) {
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
          // If the listing is found, send it in the response
          res.status(200).json(listing);
          _context.next = 14;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.error('Error fetching listing:', _context.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
router.get('/listings', function _callee2(req, res) {
  var listings;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Listing.find());

        case 3:
          listings = _context2.sent;
          res.json(listings);
          _context2.next = 11;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.error('Error fetching listings:', _context2.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
module.exports = router;