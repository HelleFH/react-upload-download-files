require("dotenv").config();
const express = require("express");
const { Listing } = require('../model/listingModel');
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const Multer = require("multer");
const fs = require('fs').promises; // For file operations

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new Multer.memoryStorage();
const upload = Multer({
  storage,
});

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
}

const app = express();

app.use(cors());

app.get('/', function(req, res) {
    res.send('Hi')
})

app.post("/upload", upload.single("my_file"), async (req, res) => {
  try {
    console.log('File upload successful.');

    const { path: filePath } = req.file;
    console.log('File path:', filePath);

    // Extract values from req.body
    const { title, description, location } = req.body;

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(filePath);

    // Create a new Listing with Cloudinary URL and other data
    const listing = new Listing({
      title,
      description,
      location,
      cloudinaryUrl: result.secure_url,
      // Note: You may or may not want to store the file_path and file_mimetype
    });

    // Save the listing to the database
    await listing.save();

    // Remove the uploaded file after processing
    await fs.unlink(filePath);

    // Respond with success message
    res.json({ msg: 'Listing data uploaded successfully.' });
  } catch (error) {
    console.error('Error while uploading listing data:', error);
    res
      .status(400)
      .json({ error: 'Error while uploading listing data. Try again later.' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server Listening on ${port}`);
});
