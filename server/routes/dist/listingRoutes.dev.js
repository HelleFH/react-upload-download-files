"use strict";

var express = require('express');

var router = express.Router();

var cloudinary = require('cloudinary').v2;

var _require = require('../model/listingModel'),
    Listing = _require.Listing;

var multer = require('multer');

var fs = require('fs').promises; // Cloudinary configuration


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
}); // Multer configuration for file upload

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
router.get('/:id', function _callee(req, res) {
  var id, listing;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          id = req.params.id;
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
router.get('/', function _callee2(req, res) {
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
router.put('/:id', function _callee3(req, res) {
  var id, updatedData, updatedListing;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = req.params.id;
          updatedData = req.body;
          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap(Listing.findByIdAndUpdate(id, updatedData, {
            "new": true
          }));

        case 5:
          updatedListing = _context3.sent;
          res.json(updatedListing);
          _context3.next = 13;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](2);
          console.error(_context3.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 9]]);
});
router["delete"]('/:id/delete-image', function _callee4(req, res) {
  var id, listing;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Listing.findById(id));

        case 4:
          listing = _context4.sent;

          if (listing) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: 'Listing not found'
          }));

        case 7:
          _context4.next = 9;
          return regeneratorRuntime.awrap(cloudinary.uploader.destroy(listing.cloudinaryUrl));

        case 9:
          res.json({
            msg: 'Image deleted successfully.'
          });
          _context4.next = 16;
          break;

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](0);
          console.error('Error deleting image:', _context4.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
router["delete"]('/:id', function _callee5(req, res) {
  var id, deletedListing;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          id = req.params.id;
          _context5.next = 4;
          return regeneratorRuntime.awrap(Listing.findByIdAndDelete(id));

        case 4:
          deletedListing = _context5.sent;

          if (deletedListing) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            error: 'Listing not found'
          }));

        case 7:
          res.json({
            message: 'Listing deleted successfully',
            deletedListing: deletedListing
          });
          _context5.next = 14;
          break;

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](0);
          console.error('Error deleting listing:', _context5.t0);
          res.status(500).json({
            error: 'Internal server error'
          });

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
router.post('/upload', upload.single('file'), function _callee6(req, res) {
  var path, _req$body, title, description, location, result, listing;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          path = req.file.path;
          _req$body = req.body, title = _req$body.title, description = _req$body.description, location = _req$body.location; // Upload file to Cloudinary

          _context6.next = 5;
          return regeneratorRuntime.awrap(cloudinary.uploader.upload(path));

        case 5:
          result = _context6.sent;
          // Create a new Listing with Cloudinary URL and other data
          listing = new Listing({
            title: title,
            description: description,
            location: location,
            cloudinaryUrl: result.secure_url
          }); // Save the listing to the database

          _context6.next = 9;
          return regeneratorRuntime.awrap(listing.save());

        case 9:
          _context6.next = 11;
          return regeneratorRuntime.awrap(fs.unlink(path));

        case 11:
          // Respond with success message
          res.json({
            msg: 'Listing data uploaded successfully.'
          });
          _context6.next = 18;
          break;

        case 14:
          _context6.prev = 14;
          _context6.t0 = _context6["catch"](0);
          console.error('Error while uploading listing data:', _context6.t0);
          res.status(400).json({
            error: 'Error while uploading listing data. Try again later.'
          });

        case 18:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
module.exports = router;