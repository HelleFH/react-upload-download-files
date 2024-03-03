const mongoose = require('mongoose');
const { Schema } = mongoose;
const { File } = require('./file');

const bookSchema = new Schema({
  title: { type: String, required: true },

  file: { type: Schema.Types.ObjectId, ref: 'File' }, // Reference to the File model
});

const Book = mongoose.model('Book', bookSchema);

module.exports = { Book };