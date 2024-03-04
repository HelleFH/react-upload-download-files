const express = require('express');
const cors = require('cors');
const path = require('path'); // Add this line
const fileRoute = require('./routes/file');
require('./db/db');

const app = express();

app.use(cors());
app.use(fileRoute);
app.use('/files', express.static(path.join(__dirname, 'files')));

app.listen(3030, () => {
  console.log('server started on port 3030');
});