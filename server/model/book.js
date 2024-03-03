const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  file_path: { type: String, required: true },
  file_mimetype: { type: String, required: true },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = { Book };
