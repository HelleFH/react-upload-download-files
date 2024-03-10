"use strict";

var express = require('express');

var cors = require('cors');

var path = require('path');

var bodyParser = require('body-parser');

var mongoose = require('mongoose');

require('dotenv').config();

var deleteRoutes = require('./routes/deleteRoutes');

var listingRoutes = require('./routes/listingRoutes');

var uploadRoute = require('./routes/uploadRoutes');

require('./config/db');

var _require = require('./model/listingModel'),
    Listing = _require.Listing;

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(deleteRoutes);
app.use(listingRoutes);
app.use(uploadRoute);
app.use('/files', express["static"](path.join(__dirname, 'files'))); // MongoDB connection

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
}); // Update a listing by ID

app.put('/listings/:id', function _callee(req, res) {
  var id, _req$body, title, description, location, cloudinaryUrl, updatedData, updatedListing;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = req.params.id;
          _req$body = req.body, title = _req$body.title, description = _req$body.description, location = _req$body.location, cloudinaryUrl = _req$body.cloudinaryUrl;
          updatedData = req.body;
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(Listing.findByIdAndUpdate(id, updatedData, {
            "new": true
          }));

        case 6:
          updatedListing = _context.sent;
          res.json(updatedListing);
          _context.next = 14;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](3);
          console.error(_context.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 10]]);
});
var port = process.env.PORT || 3030;
app.listen(port, function () {
  console.log("Server is running on port ".concat(port));
});