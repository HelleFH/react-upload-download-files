const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  file_path: { type: String, required: true },
  file_mimetype: { type: String, required: true },
});

const File = mongoose.model('File', fileSchema);

module.exports = { File };
